/**
 * Rate conversion utilities for gold and silver
 */

// Constants
export const TROY_OZ_TO_GRAMS = 31.1034768;
export const KG_TO_GRAMS = 1000;
export const DEFAULT_TTB_GRAMS = 116.64;
export const DEFAULT_SPREAD_BPS = 12; // basis points (0.12%)

export interface SpotRate {
  symbol: string;
  price: number; // in USD per troy oz
  timestamp: number;
}

export interface ConvertedRate {
  bid: number;
  ask: number;
  mid: number;
}

/**
 * Convert USD spot price to AED with bid/ask spread
 */
export function convertSpotToAED(
  spotUSD: number,
  usdToAED: number,
  spreadBps: number = DEFAULT_SPREAD_BPS
): ConvertedRate {
  const midPrice = spotUSD * usdToAED;
  const spread = (midPrice * spreadBps) / 10000;
  
  return {
    mid: midPrice,
    bid: midPrice - spread / 2,
    ask: midPrice + spread / 2,
  };
}

/**
 * Calculate price per gram from troy oz price
 */
export function pricePerGram(troyOzPrice: number, usdToAED: number): ConvertedRate {
  const pricePerGramUSD = troyOzPrice / TROY_OZ_TO_GRAMS;
  return convertSpotToAED(pricePerGramUSD, usdToAED);
}

/**
 * Calculate price per kg from troy oz price
 */
export function pricePerKg(troyOzPrice: number, usdToAED: number): ConvertedRate {
  const pricePerGramUSD = troyOzPrice / TROY_OZ_TO_GRAMS;
  const pricePerKgUSD = pricePerGramUSD * KG_TO_GRAMS;
  return convertSpotToAED(pricePerKgUSD, usdToAED);
}

/**
 * Calculate price for TTB (configurable grams)
 */
export function priceForTTB(
  troyOzPrice: number,
  usdToAED: number,
  ttbGrams: number = DEFAULT_TTB_GRAMS
): ConvertedRate {
  const pricePerGramUSD = troyOzPrice / TROY_OZ_TO_GRAMS;
  const pricePerTTBUSD = pricePerGramUSD * ttbGrams;
  return convertSpotToAED(pricePerTTBUSD, usdToAED);
}

/**
 * Calculate price for specific grams
 */
export function priceForGrams(
  troyOzPrice: number,
  usdToAED: number,
  grams: number
): ConvertedRate {
  const pricePerGramUSD = troyOzPrice / TROY_OZ_TO_GRAMS;
  const totalPriceUSD = pricePerGramUSD * grams;
  return convertSpotToAED(totalPriceUSD, usdToAED);
}

/**
 * Format AED price for display (terminal style)
 */
export function formatAED(price: number, decimals: number = 2): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(price);
}

/**
 * Format spot price (more decimals)
 */
export function formatSpot(price: number, decimals: number): string {
  return price.toFixed(decimals);
}

