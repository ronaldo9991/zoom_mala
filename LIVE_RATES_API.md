# Live Rates API Documentation

## Overview

The Live Rates feature provides real-time gold and silver prices for Zoom Mala Gold & Diamonds LLC. It integrates with free APIs to fetch live market data and display it in a premium terminal-style interface.

## API Endpoint

### GET `/api/live-rates`

Returns live rates for gold and silver commodities in AED.

**Response:**
```json
{
  "gold": {
    "spot": 2650.00,
    "aedPerOz": { "bid": 9725.50, "ask": 9730.75, "mid": 9728.125 },
    "aedPerGram": { "bid": 312.75, "ask": 312.90, "mid": 312.825 },
    "aedPerKg": { "bid": 312750.00, "ask": 312900.00, "mid": 312825.00 },
    "aed1Gm": { "bid": 312.75, "ask": 312.90, "mid": 312.825 },
    "aed10Gm": { "bid": 3127.50, "ask": 3129.00, "mid": 3128.25 },
    "aedTTB": { "bid": 36475.00, "ask": 36495.00, "mid": 36485.00 }
  },
  "silver": {
    "spot": 31.50,
    "aedPerOz": { "bid": 115.65, "ask": 115.75, "mid": 115.70 },
    "aedPerKg": { "bid": 3718.50, "ask": 3721.25, "mid": 3719.875 }
  },
  "usdToAED": 3.6725,
  "timestamp": 1704067200000,
  "isDelayed": false,
  "isDemo": false,
  "provider": "Metals.dev"
}
```

**Status Fields:**
- `isDelayed`: `true` if using cached data
- `isDemo`: `true` if using demo/mock data (no API key)
- `provider`: Data source name

## External API Integration

### Metals.dev API (Primary)

**Endpoint:**
```
GET https://api.metals.dev/v1/latest?api_key={API_KEY}&base=USD&symbols=XAU,XAG
```

**Example:**
```bash
curl "https://api.metals.dev/v1/latest?api_key=$METALS_DEV_API_KEY&base=USD&symbols=XAU,XAG"
```

**Response:**
```json
{
  "success": true,
  "base": "USD",
  "rates": {
    "XAU": 2650.00,
    "XAG": 31.50
  },
  "timestamp": 1704067200
}
```

**Notes:**
- Free plan available with ~60s delay
- Requires `METALS_DEV_API_KEY` environment variable
- XAU = Gold per troy oz in USD
- XAG = Silver per troy oz in USD

### ExchangeRate-API (FX Rates)

**Endpoint:**
```
GET https://open.er-api.com/v6/latest/USD
```

**Example:**
```bash
curl "https://open.er-api.com/v6/latest/USD"
```

**Response:**
```json
{
  "result": "success",
  "base_code": "USD",
  "rates": {
    "AED": 3.6725,
    ...
  },
  "time_last_update_utc": "2024-01-01 12:00:00+00:00"
}
```

**Notes:**
- Free open access endpoint (no API key required)
- Rate limit applies for heavy usage
- Fallback to fixed rate (3.6725) if API fails

## Environment Variables

Required for production:

```bash
METALS_DEV_API_KEY=your_api_key_here
```

Optional configuration:

```bash
TTB_GRAMS=116.64              # TTB weight in grams (default: 116.64)
SPREAD_BPS=12                 # Bid/ask spread in basis points (default: 12 = 0.12%)
CACHE_TTL_SECONDS=60          # Cache TTL in seconds (default: 60)
```

## Conversion Rules

- **1 troy oz** = 31.1034768 grams
- **1 kg** = 1000 grams
- **TTB** = Configurable grams (default: 116.64g)

### Price Calculations

1. Fetch spot price (USD per troy oz)
2. Convert to AED using USD/AED exchange rate
3. Calculate per gram: `spot_price_usd / 31.1034768 * usd_to_aed`
4. Apply bid/ask spread: `mid ± (spread_bps / 10000)`

## Fallback Behavior

1. **Primary**: Fetch from Metals.dev API
2. **Fallback 1**: Return cached data (marked as `isDelayed: true`)
3. **Fallback 2**: Return demo/mock data (marked as `isDemo: true`)

Demo mode automatically activates if:
- `METALS_DEV_API_KEY` is not set
- API request fails

## Caching

- In-memory cache with configurable TTL
- Cache key: `live_rates`
- Stale cache preserved for fallback scenarios
- **Note**: For production with multiple instances, consider Redis

## TV Mode

Access TV fullscreen mode:
```
/live-rates?mode=tv
```

Features:
- No navbar/footer
- Larger typography
- 5-second polling (vs 10s for web)
- Always-on display
- Subtle watermark
- Status indicator (LIVE/DELAYED/DEMO)

