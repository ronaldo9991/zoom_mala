import https from "https";

const agent = new https.Agent({
  keepAlive: true,
  maxSockets: 1,
  rejectUnauthorized: false,
  minVersion: "TLSv1", // Allow older TLS
  ciphers: "DEFAULT:@SECLEVEL=0" // Allow weak ciphers
});

const options = {
  hostname: "192.109.17.202", // Use IP directly
  port: 443,
  path: "/api/auth/start?version=3000&agent=WebAPI&login=906706&type=manager",
  method: "GET",
  headers: {
    "User-Agent": "MT5WebAPI/1.0",
    "Accept": "application/json",
    "Connection": "keep-alive"
  },
  rejectUnauthorized: false,
  // servername: "web.mekness.com", // Comment out SNI
  agent: agent
};

console.log("Testing connection with Agent...");

const req = https.request(options, (res) => {
  console.log("Response Status:", res.statusCode);
  res.on("data", (d) => process.stdout.write(d));
});

req.on("error", (e) => {
  console.error("Connection Error:", e);
});

req.end();
