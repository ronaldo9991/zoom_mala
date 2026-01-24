import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { formatSpot } from "@/lib/rates/convert";
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SpotCardProps {
  metal: "gold" | "silver";
  spot: number;
  bid: number;
  ask: number;
  mid: number;
  change?: number;
  changePercent?: number;
  isTVMode?: boolean;
  lastSpot?: number;
}

function AnimatedSpot({
  value,
  lastValue,
  isTVMode = false,
}: {
  value: number;
  lastValue?: number;
  isTVMode?: boolean;
}) {
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const [direction, setDirection] = useState<"up" | "down" | "neutral">("neutral");

  useEffect(() => {
    if (lastValue === undefined) return;
    
    if (value > lastValue) {
      setFlash("up");
      setDirection("up");
    } else if (value < lastValue) {
      setFlash("down");
      setDirection("down");
    }

    const timer = setTimeout(() => setFlash(null), 500);
    return () => clearTimeout(timer);
  }, [value, lastValue]);

  const decimals = value > 100 ? 2 : 3;
  const Icon = direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : null;

  return (
    <motion.div
      className="flex items-center gap-3"
      animate={{
        backgroundColor: flash === "up" 
          ? "rgba(34, 197, 94, 0.15)" 
          : flash === "down" 
          ? "rgba(239, 68, 68, 0.15)" 
          : "transparent",
        boxShadow: flash 
          ? flash === "up"
            ? "0 0 20px rgba(34, 197, 94, 0.4)"
            : "0 0 20px rgba(239, 68, 68, 0.4)"
          : "none",
      }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {flash && Icon && (
          <motion.div
            key={flash}
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Icon
              className={cn(
                isTVMode ? "w-7 h-7" : "w-5 h-5",
                flash === "up" && "text-green-400",
                flash === "down" && "text-red-400"
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <span
        className={cn(
          "font-mono tabular-nums font-bold transition-all duration-300",
          isTVMode ? "text-6xl" : "text-4xl",
          flash === "up" && "text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]",
          flash === "down" && "text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]",
          !flash && "text-gray-100"
        )}
      >
        {formatSpot(value, decimals)}
      </span>
    </motion.div>
  );
}

export function SpotCard({
  metal,
  spot,
  bid,
  ask,
  mid,
  change = 0,
  changePercent = 0,
  isTVMode = false,
  lastSpot,
}: SpotCardProps) {
  const isPositive = change >= 0;
  const decimals = spot > 100 ? 2 : 3;
  const metalGradient = metal === "gold" 
    ? "from-yellow-500/20 via-gold/20 to-yellow-600/20" 
    : "from-gray-300/20 via-gray-400/20 to-gray-500/20";
  const metalGlow = metal === "gold"
    ? "shadow-[0_0_40px_rgba(212,175,55,0.3)]"
    : "shadow-[0_0_40px_rgba(148,163,184,0.3)]";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative border-2 border-gold/30 rounded-2xl p-6 bg-black/60 backdrop-blur-2xl",
        "overflow-hidden",
        metalGlow,
        isTVMode && "p-8 border-2"
      )}
      style={{
        boxShadow: metal === "gold"
          ? "0 8px 32px rgba(0,0,0,0.8), inset 0 1px 0 rgba(212,175,55,0.1), 0 0 40px rgba(212,175,55,0.2)"
          : "0 8px 32px rgba(0,0,0,0.8), inset 0 1px 0 rgba(148,163,184,0.1), 0 0 40px rgba(148,163,184,0.2)",
      }}
    >
      {/* Gradient Background */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-30", metalGradient)} />
      
      {/* Animated Sparkle Effect */}
      <motion.div
        className="absolute top-4 right-4"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Sparkles className={cn("text-gold/40", isTVMode ? "w-8 h-8" : "w-6 h-6")} />
      </motion.div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3
              className={cn(
                "font-bold text-gold uppercase tracking-wider mb-1",
                "drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]",
                isTVMode ? "text-3xl" : "text-xl"
              )}
            >
              {metal === "gold" ? "Gold" : "Silver"}
            </h3>
            <p className={cn("text-gray-400", isTVMode ? "text-lg" : "text-xs")}>
              Spot Price (USD/OZ)
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div
              className={cn(
                "text-gray-400 mb-3 font-semibold",
                isTVMode ? "text-xl" : "text-xs"
              )}
            >
              Current Spot
            </div>
            <AnimatedSpot
              value={spot}
              lastValue={lastSpot}
              isTVMode={isTVMode}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-5 border-t border-gold/20">
            <div className="space-y-2">
              <div
                className={cn(
                  "text-gray-400 font-semibold",
                  isTVMode ? "text-base" : "text-xs"
                )}
              >
                Bid
              </div>
              <div
                className={cn(
                  "font-mono tabular-nums font-bold text-gold",
                  "drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]",
                  isTVMode ? "text-2xl" : "text-lg"
                )}
              >
                {formatSpot(bid, decimals)}
              </div>
            </div>
            <div className="space-y-2">
              <div
                className={cn(
                  "text-gray-400 font-semibold",
                  isTVMode ? "text-base" : "text-xs"
                )}
              >
                Ask
              </div>
              <div
                className={cn(
                  "font-mono tabular-nums font-bold text-gold",
                  "drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]",
                  isTVMode ? "text-2xl" : "text-lg"
                )}
              >
                {formatSpot(ask, decimals)}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gold/10">
            <div className="flex items-center justify-between">
              <span className={cn("text-gray-500", isTVMode ? "text-base" : "text-xs")}>
                Mid Price
              </span>
              <span className={cn("font-mono tabular-nums font-semibold text-gray-300", isTVMode ? "text-xl" : "text-sm")}>
                {formatSpot(mid, decimals)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface SpotCardsProps {
  goldSpot: number;
  goldBid: number;
  goldAsk: number;
  goldMid: number;
  silverSpot: number;
  silverBid: number;
  silverAsk: number;
  silverMid: number;
  usdToAED: number;
  isTVMode?: boolean;
  lastGoldSpot?: number;
  lastSilverSpot?: number;
}

export function SpotCards({
  goldSpot,
  goldBid,
  goldAsk,
  goldMid,
  silverSpot,
  silverBid,
  silverAsk,
  silverMid,
  usdToAED,
  isTVMode = false,
  lastGoldSpot,
  lastSilverSpot,
}: SpotCardsProps) {
  return (
    <div className="space-y-5">
      <SpotCard
        metal="gold"
        spot={goldSpot}
        bid={goldBid}
        ask={goldAsk}
        mid={goldMid}
        isTVMode={isTVMode}
        lastSpot={lastGoldSpot}
      />
      <SpotCard
        metal="silver"
        spot={silverSpot}
        bid={silverBid}
        ask={silverAsk}
        mid={silverMid}
        isTVMode={isTVMode}
        lastSpot={lastSilverSpot}
      />
    </div>
  );
}
