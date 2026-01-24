# Live Rates API Documentation

## Overview

The Live Rates feature provides real-time gold and silver prices in AED. Live rates are fetched from MT5 WebAPI only.

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
  "provider": "MT5"
}
```

**Status Fields:**
- `isDelayed`: `true` if using cached data
- `isDemo`: `true` if using demo/mock data
- `provider`: Data source name

## Provider

### MT5 WebAPI (Only Provider)

Live spot prices are fetched from MT5 symbols:
- `XAUUSD`
- `XAGUSD`

## Environment Variables

```bash
MT5_LOGIN=your_login
MT5_PASSWORD=your_password
```

Optional configuration:

```bash
MT5_HOST=192.109.17.202
MT5_PORT=443
MT5_VERSION=3000
MT5_AGENT=WebAPI
MT5_AUTH_TYPE=manager

USD_TO_AED=3.6725
TTB_GRAMS=116.64              # TTB weight in grams (default: 116.64)
SPREAD_BPS=12                 # Bid/ask spread in basis points (default: 12 = 0.12%)
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

1. **Primary**: Fetch from MT5
2. **Fallback**: Return cached data (marked as `isDelayed: true`)

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
- Status indicator (LIVE/DELAYED)
