import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";

interface MarketPulseProps {
  buyersPercentage: number; // 0-100
  sellersPercentage: number; // 0-100
  isTVMode?: boolean;
}

export function MarketPulse({
  buyersPercentage,
  sellersPercentage,
  isTVMode = false,
}: MarketPulseProps) {
  const [animatedBuyers, setAnimatedBuyers] = useState(0);
  const [animatedSellers, setAnimatedSellers] = useState(0);

  useEffect(() => {
    // Smooth animation
    const duration = 1000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedBuyers(buyersPercentage * easeOut);
      setAnimatedSellers(sellersPercentage * easeOut);

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [buyersPercentage, sellersPercentage]);

  const isBullish = buyersPercentage > sellersPercentage;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn(
        "relative border-2 border-gold/30 rounded-2xl p-6 bg-black/60 backdrop-blur-2xl",
        "overflow-hidden",
        "shadow-[0_8px_32px_rgba(0,0,0,0.8)]",
        isTVMode && "p-8 border-2"
      )}
      style={{
        boxShadow: "0 8px 32px rgba(0,0,0,0.8), inset 0 1px 0 rgba(212,175,55,0.1), 0 0 40px rgba(212,175,55,0.1)",
      }}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-red-500/10 opacity-50" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-2.5 rounded-xl bg-green-500/20 border-2 border-green-500/30"
              animate={{
                boxShadow: [
                  "0 0 15px rgba(34, 197, 94, 0.3)",
                  "0 0 25px rgba(34, 197, 94, 0.5)",
                  "0 0 15px rgba(34, 197, 94, 0.3)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Activity className={cn("text-green-400", isTVMode ? "w-7 h-7" : "w-6 h-6")} />
            </motion.div>
            <h3
              className={cn(
                "font-bold text-gold uppercase tracking-wider",
                "drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]",
                isTVMode ? "text-3xl" : "text-xl"
              )}
            >
              Market Pulse
            </h3>
          </div>
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-bold",
            isBullish 
              ? "bg-green-500/20 text-green-400 border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.3)]" 
              : "bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
            isTVMode ? "text-xl" : "text-sm"
          )}>
            {isBullish ? (
              <TrendingUp className={cn("w-5 h-5", isTVMode && "w-6 h-6")} />
            ) : (
              <TrendingDown className={cn("w-5 h-5", isTVMode && "w-6 h-6")} />
            )}
            <span>{isBullish ? "Bullish" : "Bearish"}</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Buyers vs Sellers Bar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-3 h-3 rounded-full bg-green-400"
                  animate={{
                    boxShadow: [
                      "0 0 10px rgba(34, 197, 94, 0.8)",
                      "0 0 20px rgba(34, 197, 94, 1)",
                      "0 0 10px rgba(34, 197, 94, 0.8)",
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span
                  className={cn(
                    "font-bold text-green-400",
                    isTVMode ? "text-xl" : "text-sm"
                  )}
                >
                  Buyers
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "font-bold text-red-400",
                    isTVMode ? "text-xl" : "text-sm"
                  )}
                >
                  Sellers
                </span>
                <motion.div
                  className="w-3 h-3 rounded-full bg-red-400"
                  animate={{
                    boxShadow: [
                      "0 0 10px rgba(239, 68, 68, 0.8)",
                      "0 0 20px rgba(239, 68, 68, 1)",
                      "0 0 10px rgba(239, 68, 68, 0.8)",
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>
            
            <div className="relative h-14 bg-gray-900/50 rounded-xl overflow-hidden border-2 border-gold/20">
              {/* Buyers Bar */}
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500/60 via-green-400/50 to-green-500/40 transition-all duration-700 ease-out"
                initial={{ width: 0 }}
                animate={{ width: `${animatedBuyers}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                  boxShadow: "inset 0 0 20px rgba(34, 197, 94, 0.5), 0 0 20px rgba(34, 197, 94, 0.3)",
                }}
              />
              
              {/* Sellers Bar */}
              <motion.div
                className="absolute right-0 top-0 h-full bg-gradient-to-l from-red-500/60 via-red-400/50 to-red-500/40 transition-all duration-700 ease-out"
                initial={{ width: 0 }}
                animate={{ width: `${animatedSellers}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                  boxShadow: "inset 0 0 20px rgba(239, 68, 68, 0.5), 0 0 20px rgba(239, 68, 68, 0.3)",
                }}
              />
              
              {/* Center Divider */}
              <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gold/30" />
              
              {/* Percentage Display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={cn(
                    "font-mono tabular-nums text-gray-100 font-bold drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]",
                    isTVMode ? "text-3xl" : "text-lg"
                  )}
                >
                  {animatedBuyers.toFixed(1)}% / {animatedSellers.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Activity Indicator */}
          <div className="flex items-center justify-between pt-4 border-t border-gold/20">
            <div className="flex items-center gap-3">
              <motion.div
                className="relative"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
                <div className="relative w-3.5 h-3.5 bg-green-400 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
              </motion.div>
              <span
                className={cn(
                  "text-gray-400 font-semibold",
                  isTVMode ? "text-lg" : "text-sm"
                )}
              >
                Active Trading
              </span>
            </div>
            <div className={cn(
              "px-4 py-2 rounded-lg bg-gray-900/50 border border-gold/20",
              isTVMode ? "text-base" : "text-xs"
            )}>
              <span className="font-mono tabular-nums text-gold font-bold">
                {buyersPercentage + sellersPercentage}% Volume
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
