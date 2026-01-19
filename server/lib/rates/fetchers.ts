/**
 * API fetchers for live rates
 */

const METALS_DEV_API_URL = "https://api.metals.dev/v1/latest";
const EXCHANGE_RATE_API_URL = "https://open.er-api.com/v6/latest/USD";
const CACHE_TTL_SECONDS = parseInt(process.env.CACHE_TTL_SECONDS || "60", 10);

interface MetalsDevResponse {
  success: boolean;
  base: string;
  rates: {
    XAU?: number; // Gold per troy oz in USD
    XAG?: number; // Silver per troy oz in USD
  };
  timestamp: number;
}

interface ExchangeRateResponse {
  result: string;
  base_code: string;
  rates: {
    AED?: number;
  };
  time_last_update_utc: string;
}

interface LiveRatesData {
  gold: {
    spot: number; // USD per troy oz
    aedPerOz: { bid: number; ask: number; mid: number };
    aedPerGram: { bid: number; ask: number; mid: number };
    aedPerKg: { bid: number; ask: number; mid: number };
    aed1Gm: { bid: number; ask: number; mid: number };
    aed10Gm: { bid: number; ask: number; mid: number };
    aedTTB: { bid: number; ask: number; mid: number };
  };
  silver: {
    spot: number;
    aedPerOz: { bid: number; ask: number; mid: number };
    aedPerKg: { bid: number; ask: number; mid: number };
  };
  usdToAED: number;
  timestamp: number;
  isDelayed: boolean;
  isDemo: boolean;
  provider?: string;
}

// Mock demo data
function getDemoData(usdToAED: number = 3.6725): LiveRatesData {
  const goldSpot = 2650.00;
  const silverSpot = 31.50;

  const spreadBps = 12;
  const goldMid = goldSpot * usdToAED;
  const silverMid = silverSpot * usdToAED;
  const spread = (goldMid * spreadBps) / 10000;
  const silverSpread = (silverMid * spreadBps) / 10000;

  const goldBid = goldMid - spread / 2;
  const goldAsk = goldMid + spread / 2;
  const silverBid = silverMid - silverSpread / 2;
  const silverAsk = silverMid + silverSpread / 2;

  const gramPrice = goldMid / 31.1034768;
  const gramSpread = (gramPrice * spreadBps) / 10000;
  const gramBid = gramPrice - gramSpread / 2;
  const gramAsk = gramPrice + gramSpread / 2;

  const kgPrice = gramPrice * 1000;
  const kgSpread = (kgPrice * spreadBps) / 10000;
  const kgBid = kgPrice - kgSpread / 2;
  const kgAsk = kgPrice + kgSpread / 2;

  const ttbGrams = parseFloat(process.env.TTB_GRAMS || "116.64");
  const ttbPrice = gramPrice * ttbGrams;
  const ttbSpread = (ttbPrice * spreadBps) / 10000;
  const ttbBid = ttbPrice - ttbSpread / 2;
  const ttbAsk = ttbPrice + ttbSpread / 2;

  const silverGramPrice = silverMid / 31.1034768;
  const silverKgPrice = silverGramPrice * 1000;
  const silverKgSpread = (silverKgPrice * spreadBps) / 10000;
  const silverKgBid = silverKgPrice - silverKgSpread / 2;
  const silverKgAsk = silverKgPrice + silverKgSpread / 2;

  return {
    gold: {
      spot: goldSpot,
      aedPerOz: { mid: goldMid, bid: goldBid, ask: goldAsk },
      aedPerGram: {
        mid: gramPrice,
        bid: gramBid,
        ask: gramAsk,
      },
      aedPerKg: {
        mid: kgPrice,
        bid: kgBid,
        ask: kgAsk,
      },
      aed1Gm: {
        mid: gramPrice,
        bid: gramBid,
        ask: gramAsk,
      },
      aed10Gm: {
        mid: gramPrice * 10,
        bid: gramBid * 10,
        ask: gramAsk * 10,
      },
      aedTTB: {
        mid: ttbPrice,
        bid: ttbBid,
        ask: ttbAsk,
      },
    },
    silver: {
      spot: silverSpot,
      aedPerOz: {
        mid: silverMid,
        bid: silverBid,
        ask: silverAsk,
      },
      aedPerKg: {
        mid: silverKgPrice,
        bid: silverKgBid,
        ask: silverKgAsk,
      },
    },
    usdToAED,
    timestamp: Date.now(),
    isDelayed: false,
    isDemo: true,
    provider: "Demo Data",
  };
}

/**
 * Fetch USD to AED exchange rate
 */
async function fetchUSDToAED(): Promise<number> {
  try {
    const response = await fetch(EXCHANGE_RATE_API_URL, {
      headers: { Accept: "application/json" },
    });
    
    if (!response.ok) {
      throw new Error(`FX API error: ${response.status}`);
    }

    const data: ExchangeRateResponse = await response.json();
    
    if (data.result === "success" && data.rates.AED) {
      return data.rates.AED;
    }
    
    throw new Error("AED rate not found in response");
  } catch (error) {
    console.error("Failed to fetch USD/AED rate:", error);
    // Fallback to fixed rate
    return 3.6725;
  }
}

/**
 * Fetch metals prices from Metals.dev
 */
async function fetchMetalsPrices(apiKey: string): Promise<{ XAU?: number; XAG?: number }> {
  const url = `${METALS_DEV_API_URL}?api_key=${apiKey}&base=USD&symbols=XAU,XAG`;
  
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Metals.dev API error: ${response.status}`);
    }

    const data: MetalsDevResponse = await response.json();
    
    if (data.success && data.rates) {
      return {
        XAU: data.rates.XAU,
        XAG: data.rates.XAG,
      };
    }

    throw new Error("Invalid response from Metals.dev");
  } catch (error) {
    console.error("Failed to fetch metals prices:", error);
    throw error;
  }
}

/**
 * Calculate all rates from spot prices
 */
function calculateRates(
  goldSpot: number,
  silverSpot: number,
  usdToAED: number
): LiveRatesData {
  const spreadBps = parseFloat(process.env.SPREAD_BPS || "12");
  const ttbGrams = parseFloat(process.env.TTB_GRAMS || "116.64");

  // Helper to calculate bid/ask with spread
  const calcBidAsk = (mid: number) => {
    const spread = (mid * spreadBps) / 10000;
    return {
      mid,
      bid: mid - spread / 2,
      ask: mid + spread / 2,
    };
  };

  // Gold calculations
  const goldMidPerOz = goldSpot * usdToAED;
  const goldPerGram = goldMidPerOz / 31.1034768;
  const goldPerKg = goldPerGram * 1000;
  const goldTTB = goldPerGram * ttbGrams;
  const gold10Gm = goldPerGram * 10;

  // Silver calculations
  const silverMidPerOz = silverSpot * usdToAED;
  const silverPerGram = silverMidPerOz / 31.1034768;
  const silverPerKg = silverPerGram * 1000;

  return {
    gold: {
      spot: goldSpot,
      aedPerOz: calcBidAsk(goldMidPerOz),
      aedPerGram: calcBidAsk(goldPerGram),
      aedPerKg: calcBidAsk(goldPerKg),
      aed1Gm: calcBidAsk(goldPerGram),
      aed10Gm: calcBidAsk(gold10Gm),
      aedTTB: calcBidAsk(goldTTB),
    },
    silver: {
      spot: silverSpot,
      aedPerOz: calcBidAsk(silverMidPerOz),
      aedPerKg: calcBidAsk(silverPerKg),
    },
    usdToAED,
    timestamp: Date.now(),
    isDelayed: false,
    isDemo: false,
    provider: "Metals.dev",
  };
}

/**
 * Fetch live rates with caching and fallback
 */
export async function fetchLiveRates(): Promise<LiveRatesData> {
  const { getCached, setCached } = await import("./cache");
  const cacheKey = "live_rates";

  // Check cache first
  const cached = getCached(cacheKey);
  if (cached) {
    return { ...cached, isDelayed: true };
  }

  const apiKey = process.env.METALS_DEV_API_KEY;

  // If no API key, return demo data
  if (!apiKey) {
    const usdToAED = await fetchUSDToAED();
    const demoData = getDemoData(usdToAED);
    setCached(cacheKey, demoData, CACHE_TTL_SECONDS);
    return demoData;
  }

  try {
    // Fetch both in parallel
    const [usdToAED, metals] = await Promise.all([
      fetchUSDToAED(),
      fetchMetalsPrices(apiKey),
    ]);

    if (!metals.XAU || !metals.XAG) {
      throw new Error("Missing gold or silver prices");
    }

    const rates = calculateRates(metals.XAU, metals.XAG, usdToAED);
    setCached(cacheKey, rates, CACHE_TTL_SECONDS);
    
    return rates;
  } catch (error) {
    console.error("Failed to fetch live rates:", error);
    
    // Return cached data if available (even if expired)
    const staleCache = getCached("live_rates_stale");
    if (staleCache) {
      return { ...staleCache, isDelayed: true };
    }

    // Last resort: demo data
    const usdToAED = await fetchUSDToAED();
    return getDemoData(usdToAED);
  }
}

