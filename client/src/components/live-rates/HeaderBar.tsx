import { useEffect, useState } from "react";
import { COMPANY, ADDRESS } from "@/lib/assets";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";

interface HeaderBarProps {
  isTVMode?: boolean;
}

export function HeaderBar({ isTVMode = false }: HeaderBarProps) {
  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now);
      setDate(now);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <header
      className={cn(
        "relative w-full border-b-2 border-gold/40 bg-black",
        "shadow-[0_8px_32px_rgba(0,0,0,0.8)]",
        isTVMode ? "py-8 px-12" : "py-6 px-8"
      )}
      style={{
        boxShadow: "0 8px 32px rgba(0,0,0,0.8), inset 0 1px 0 rgba(212,175,55,0.2)",
      }}
    >
      {/* Animated Gold Glow Line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent"
        animate={{
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <div className="max-w-[1920px] mx-auto relative z-10">
        {/* Main Row: Three Column Layout with Proper Spacing */}
        <div className="grid grid-cols-3 gap-8 items-center mb-5">
          {/* Left Column: Timestamp */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start min-w-0"
          >
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                className="p-2 rounded-lg bg-gold/10 border-2 border-gold/40"
                animate={{
                  boxShadow: [
                    "0 0 15px rgba(212,175,55,0.4)",
                    "0 0 25px rgba(212,175,55,0.6)",
                    "0 0 15px rgba(212,175,55,0.4)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Clock className={cn("text-gold", isTVMode ? "w-7 h-7" : "w-5 h-5")} />
              </motion.div>
              <div
                className={cn(
                  "font-mono font-bold tabular-nums text-gold",
                  "drop-shadow-[0_0_15px_rgba(212,175,55,0.7)]",
                  isTVMode ? "text-5xl" : "text-3xl"
                )}
              >
                {formatTime(time)}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-12">
              <motion.span
                className="relative flex h-2.5 w-2.5"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400 shadow-[0_0_15px_rgba(34,197,94,1)]"></span>
              </motion.span>
              <span
                className={cn(
                  "text-green-400 font-bold tracking-widest uppercase",
                  "drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]",
                  isTVMode ? "text-base" : "text-xs"
                )}
              >
                LIVE
              </span>
            </div>
          </motion.div>

          {/* Center Column: ZOOM MALA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center justify-center min-w-0"
          >
            <h1
              className={cn(
                "font-serif font-bold text-gold text-center",
                "drop-shadow-[0_0_25px_rgba(212,175,55,0.8)]",
                isTVMode ? "text-6xl mb-2" : "text-4xl mb-2"
              )}
            >
              {COMPANY.shortName}
            </h1>
            <p className={cn("text-gray-400 font-semibold tracking-wider uppercase text-center", isTVMode ? "text-xl" : "text-sm")}>
              Gold & Diamonds
            </p>
          </motion.div>

          {/* Right Column: Date - Full Width, No Overlap */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-end min-w-0"
          >
            <div
              className={cn(
                "text-gold font-bold text-right",
                "drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]",
                isTVMode ? "text-2xl" : "text-base"
              )}
            >
              {formatDate(date)}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row: Address - Centered */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-2 text-gray-400"
        >
          <MapPin className={cn("text-gold/70", isTVMode ? "w-5 h-5" : "w-4 h-4")} />
          <p className={cn("font-semibold", isTVMode ? "text-lg" : "text-sm")}>
            {ADDRESS.full}
          </p>
        </motion.div>
      </div>
    </header>
  );
}
