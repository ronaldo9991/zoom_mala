import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { formatAED } from "@/lib/rates/convert";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CommodityRow {
  commodity: string;
  weight: string;
  bid: number;
  ask: number;
  mid: number;
  spread: number;
  lastBid?: number;
  lastAsk?: number;
}

interface CommodityTableProps {
  data: CommodityRow[];
  isTVMode?: boolean;
}

function AnimatedPrice({
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

  const Icon = direction === "up" ? TrendingUp : TrendingDown;

  return (
    <motion.div
      className="flex items-center justify-end gap-3"
      initial={false}
      animate={{
        backgroundColor: flash === "up" 
          ? "rgba(34, 197, 94, 0.15)" 
          : flash === "down" 
          ? "rgba(239, 68, 68, 0.15)" 
          : "transparent",
      }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {flash && (
          <motion.div
            key={flash}
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 180 }}
            transition={{ duration: 0.2 }}
          >
            <Icon
              className={cn(
                flash === "up" && "text-green-400",
                flash === "down" && "text-red-400",
                isTVMode ? "w-6 h-6" : "w-4 h-4"
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <span
        className={cn(
          "font-mono tabular-nums font-bold transition-all duration-300",
          isTVMode ? "text-4xl" : "text-xl",
          flash === "up" && "text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]",
          flash === "down" && "text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]",
          !flash && "text-gray-100"
        )}
      >
        {formatAED(value, 2)}
      </span>
    </motion.div>
  );
}

export function CommodityTable({ data, isTVMode = false }: CommodityTableProps) {
  const [lastData, setLastData] = useState<CommodityRow[]>([]);

  useEffect(() => {
    setLastData(data);
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full flex flex-col"
    >
      {/* Table Header */}
      <div className="flex-none bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b-2 border-gold/30">
        <div className="grid grid-cols-5 gap-6 px-8 py-6">
          <div className={cn("font-bold text-gold uppercase tracking-[0.2em]", isTVMode ? "text-2xl" : "text-sm")}>
            Commodity
          </div>
          <div className={cn("font-bold text-gold uppercase tracking-[0.2em]", isTVMode ? "text-2xl" : "text-sm")}>
            Weight
          </div>
          <div className={cn("text-right font-bold text-gold uppercase tracking-[0.2em]", isTVMode ? "text-2xl" : "text-sm")}>
            Bid (AED)
          </div>
          <div className={cn("text-right font-bold text-gold uppercase tracking-[0.2em]", isTVMode ? "text-2xl" : "text-sm")}>
            Ask (AED)
          </div>
          <div className={cn("text-right font-bold text-gold uppercase tracking-[0.2em]", isTVMode ? "text-2xl" : "text-sm")}>
            Spread
          </div>
        </div>
      </div>

      {/* Table Body - Flex Grow to fill space */}
      <div className="flex-1 flex flex-col divide-y divide-gold/20 overflow-y-auto min-h-0">
        {data.map((row, idx) => {
          const lastRow = lastData[idx];
          const spreadPercent = ((row.spread / row.mid) * 100).toFixed(3);
          
          return (
            <motion.div
              key={`${row.commodity}-${idx}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                "flex-1 grid grid-cols-5 gap-6 px-8 items-center transition-all duration-300",
                "hover:bg-gold/5 hover:border-l-4 hover:border-l-gold",
                idx % 2 === 0 ? "bg-white/2" : "bg-transparent"
              )}
            >
              <div className={cn("font-bold text-white flex items-center tracking-wider", isTVMode ? "text-3xl" : "text-lg")}>
                {row.commodity}
              </div>
              <div className={cn("text-gray-400 font-medium flex items-center tracking-wide", isTVMode ? "text-3xl" : "text-lg")}>
                {row.weight}
              </div>
              <div className="text-right flex items-center justify-end">
                <AnimatedPrice
                  value={row.bid}
                  lastValue={lastRow?.bid}
                  isTVMode={isTVMode}
                />
              </div>
              <div className="text-right flex items-center justify-end">
                <AnimatedPrice
                  value={row.ask}
                  lastValue={lastRow?.ask}
                  isTVMode={isTVMode}
                />
              </div>
              <div className="text-right flex flex-col items-end justify-center">
                <div className={cn("font-mono tabular-nums font-bold text-gold", isTVMode ? "text-3xl" : "text-base")}>
                  {formatAED(row.spread, 2)}
                </div>
                <div className={cn("text-gray-500 mt-1", isTVMode ? "text-lg" : "text-xs")}>
                  ({spreadPercent}%)
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
