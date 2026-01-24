import https from "https";
import crypto from "crypto";
import net from "net";

const MT5_CONFIG = {
  host: process.env.MT5_HOST || "192.109.17.202",
  port: Number.parseInt(process.env.MT5_PORT || "443", 10),
  login: Number.parseInt(process.env.MT5_LOGIN || "0", 10),
  password: process.env.MT5_PASSWORD || "",
  agent: process.env.MT5_AGENT || "WebAPI",
  version: Number.parseInt(process.env.MT5_VERSION || "3000", 10),
  type: (process.env.MT5_AUTH_TYPE || "manager") as "manager" | "client",
};

console.log("MT5 Configuration:", { ...MT5_CONFIG, password: "***" });

interface MT5AuthStartResponse {
  retcode: string;
  srv_rand: string;
  cli_rand?: string;
}

interface MT5AuthAnswerResponse {
  retcode: string;
}

interface MT5TickResponse {
  retcode: string;
  trans_id?: number;
  answer?: {
    Symbol: string;
    Bid: number;
    Ask: number;
    Last: number;
    Time: number;
  };
}

export class MT5Client {
  private isConnected = false;
  private authPromise: Promise<void> | null = null;
  private cookies: string[] = [];
  private agent = new https.Agent({
    keepAlive: true,
    maxSockets: 1,
    rejectUnauthorized: false,
  });

  private async request<T>(path: string, params: Record<string, string | number>, retries = 3): Promise<T> {
    try {
      return await this.performRequest<T>(path, params);
    } catch (error: any) {
      if (retries > 0 && (error.code === 'ECONNRESET' || error.message.includes('socket disconnected'))) {
        console.warn(`MT5 connection failed (${error.code}), retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s
        return this.request<T>(path, params, retries - 1);
      }
      throw error;
    }
  }

  private async performRequest<T>(path: string, params: Record<string, string | number>): Promise<T> {
    const url = new URL(`https://${MT5_CONFIG.host}:${MT5_CONFIG.port}${path}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });

    const headers: Record<string, string> = {
      Accept: "application/json",
      Connection: "keep-alive",
      "User-Agent": "MT5WebAPI/1.0",
    };

    if (this.cookies.length > 0) {
      headers.Cookie = this.cookies.join("; ");
      console.log("Sending Cookies:", headers.Cookie);
    }

    const isIP = net.isIP(MT5_CONFIG.host);
    const requestOptions = {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      method: "GET",
      path: `${url.pathname}?${url.searchParams.toString()}`,
      headers,
      agent: this.agent,
      servername: isIP ? undefined : MT5_CONFIG.host,
      rejectUnauthorized: false,
    };

    console.log(`MT5 Request: ${url.href} with options:`, { 
      ...requestOptions, 
      agent: "Agent", 
      headers: { ...headers, Cookie: headers.Cookie ? "***" : undefined }
    });

    return new Promise<T>((resolve, reject) => {
      const req = https.request(
        requestOptions,
        (res) => {
          const setCookies = res.headers["set-cookie"];
          if (setCookies && setCookies.length > 0) {
            this.cookies = setCookies.map((c) => c.split(";")[0]);
            console.log("Received Cookies:", this.cookies);
          }

          const chunks: Buffer[] = [];
          res.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
          res.on("end", () => {
            const body = Buffer.concat(chunks).toString("utf8");
            if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
              reject(new Error(`MT5 Request Failed (${path}): ${res.statusCode} ${res.statusMessage} - ${body}`));
              return;
            }

            try {
              resolve(JSON.parse(body) as T);
            } catch {
              reject(new Error(`MT5 Response JSON Parse Failed: ${body}`));
            }
          });
        }
      );

      req.on("error", reject);
      req.end();
    });
  }

  private calculateAnswerCandidates(password: string, rand: string): string[] {
    const passwordEncodings: BufferEncoding[] = ["utf16le", "utf8"];
    const randEncodings: BufferEncoding[] = ["hex", "utf8"];
    const includeAgentValues = [true, false];

    const candidates: string[] = [];
    for (const passwordEncoding of passwordEncodings) {
      const passwordHash = crypto
        .createHash("md5")
        .update(Buffer.from(password, passwordEncoding))
        .digest();

      for (const randEncoding of randEncodings) {
        let randBuf: Buffer | null = null;
        try {
          randBuf = Buffer.from(rand, randEncoding);
        } catch {
          randBuf = null;
        }
        if (!randBuf || randBuf.length === 0) continue;

        for (const includeAgent of includeAgentValues) {
          const parts = includeAgent
            ? [passwordHash, Buffer.from(MT5_CONFIG.agent, "ascii"), randBuf]
            : [passwordHash, randBuf];
          const combined = Buffer.concat(parts);
          candidates.push(crypto.createHash("md5").update(combined).digest("hex"));
        }
      }
    }

    return Array.from(new Set(candidates));
  }

  async authenticate(): Promise<void> {
    if (this.isConnected) return;
    if (this.authPromise) return this.authPromise;

    this.authPromise = (async () => {
      try {
        if (!MT5_CONFIG.login || !MT5_CONFIG.password) {
          throw new Error("MT5 credentials missing. Set MT5_LOGIN and MT5_PASSWORD.");
        }

        // Step 1: Start Auth
        const startData = await this.request<MT5AuthStartResponse>("/api/auth/start", {
          version: MT5_CONFIG.version,
          agent: MT5_CONFIG.agent,
          login: MT5_CONFIG.login,
          type: MT5_CONFIG.type,
        });

        if (startData.retcode !== "0 Done") {
          throw new Error(`Auth Start Failed: ${startData.retcode}`);
        }

        const srvRandAnswers = this.calculateAnswerCandidates(MT5_CONFIG.password, startData.srv_rand);
        const cliRandCandidates = Array.from(
          new Set([startData.cli_rand, crypto.randomBytes(16).toString("hex")].filter(Boolean) as string[])
        );

        const baseParams = {
          version: MT5_CONFIG.version,
          agent: MT5_CONFIG.agent,
          login: MT5_CONFIG.login,
          type: MT5_CONFIG.type,
        } as const;

        let lastError: unknown = null;
        let answerData: MT5AuthAnswerResponse | null = null;

        for (const cliRand of cliRandCandidates) {
          const cliRandAnswers = this.calculateAnswerCandidates(MT5_CONFIG.password, cliRand);

          for (const srvRandAnswer of srvRandAnswers) {
            try {
              answerData = await this.request<MT5AuthAnswerResponse>("/api/auth/answer", {
                ...baseParams,
                srv_rand_answer: srvRandAnswer,
                cli_rand: cliRand,
              });
              if (answerData.retcode === "0 Done") break;
            } catch (e) {
              lastError = e;
            }

            for (const cliRandAnswer of cliRandAnswers) {
              try {
                answerData = await this.request<MT5AuthAnswerResponse>("/api/auth/answer", {
                  ...baseParams,
                  srv_rand_answer: srvRandAnswer,
                  cli_rand: cliRand,
                  cli_rand_answer: cliRandAnswer,
                });
                if (answerData.retcode === "0 Done") break;
              } catch (e) {
                lastError = e;
              }

              try {
                answerData = await this.request<MT5AuthAnswerResponse>("/api/auth/answer", {
                  ...baseParams,
                  srv_rand_answer: srvRandAnswer,
                  cli_rand_answer: cliRandAnswer,
                });
                if (answerData.retcode === "0 Done") break;
              } catch (e) {
                lastError = e;
              }
            }

            if (answerData?.retcode === "0 Done") break;
          }

          if (answerData?.retcode === "0 Done") break;
        }

        if (!answerData) {
          throw lastError instanceof Error ? lastError : new Error("Auth Answer Failed");
        }

        if (answerData.retcode !== "0 Done") {
          throw new Error(`Auth Answer Failed: ${answerData.retcode}`);
        }

        this.isConnected = true;
      } catch (error) {
        this.isConnected = false;
        throw error;
      } finally {
        this.authPromise = null;
      }
    })();

    return this.authPromise;
  }

  async getSymbol(symbol: string): Promise<{ bid: number; ask: number; last: number } | null> {
    if (!this.isConnected) {
      await this.authenticate();
    }

    try {
      // Fetch tick data
      const data = await this.request<MT5TickResponse>("/api/tick/last", {
        symbol: symbol,
      });

      if (data.retcode !== "0 Done" || !data.answer) {
        // If auth expired, retry once
        if (data.retcode.includes("Auth") || data.retcode.includes("Session")) {
          console.log("MT5 Session expired, re-authenticating...");
          await this.authenticate();
          return this.getSymbol(symbol);
        }
        console.error(`Failed to get symbol ${symbol}: ${data.retcode}`);
        return null;
      }

      return {
        bid: data.answer.Bid,
        ask: data.answer.Ask,
        last: data.answer.Last,
      };
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error);
      return null;
    }
  }

  async getRates(): Promise<{ XAU?: number; XAG?: number }> {
    const [gold, silver] = await Promise.all([
      this.getSymbol("XAUUSD"),
      this.getSymbol("XAGUSD")
    ]);

    return {
      XAU: gold?.last,
      XAG: silver?.last
    };
  }
}

export const mt5Client = new MT5Client();
