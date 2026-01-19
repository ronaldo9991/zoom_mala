import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
    const duration = 500;
    const steps = 30;
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

  return (
    <div
      className={cn(
        "border border-border rounded-lg p-6 bg-card",
        isTVMode && "p-8 border-2"
      )}
    >
      <h3
        className={cn(
          "font-semibold text-foreground mb-4 uppercase",
          isTVMode ? "text-2xl" : "text-lg"
        )}
      >
        Market Pulse
      </h3>

      <div className="space-y-4">
        {/* Buyers vs Sellers Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span
              className={cn(
                "font-medium text-green-400",
                isTVMode ? "text-lg" : "text-sm"
              )}
            >
              Buyers
            </span>
            <span
              className={cn(
                "font-medium text-red-400",
                isTVMode ? "text-lg" : "text-sm"
              )}
            >
              Sellers
            </span>
          </div>
          <div className="relative h-8 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-green-500/30 transition-all duration-300 ease-out"
              style={{ width: `${animatedBuyers}%` }}
            >
              <div className="h-full w-full bg-gradient-to-r from-green-500/50 to-green-500/20" />
            </div>
            <div
              className="absolute right-0 top-0 h-full bg-red-500/30 transition-all duration-300 ease-out"
              style={{ width: `${animatedSellers}%` }}
            >
              <div className="h-full w-full bg-gradient-to-l from-red-500/50 to-red-500/20" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={cn(
                  "font-mono tabular-nums text-foreground font-bold",
                  isTVMode ? "text-base" : "text-xs"
                )}
              >
                {animatedBuyers.toFixed(1)}% / {animatedSellers.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Activity Indicator */}
        <div className="flex items-center gap-2 pt-2">
          <div className="relative w-2 h-2">
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
            <div className="relative w-2 h-2 bg-green-400 rounded-full" />
          </div>
          <span
            className={cn(
              "text-muted-foreground",
              isTVMode ? "text-base" : "text-xs"
            )}
          >
            Active Trading
          </span>
        </div>
      </div>
    </div>
  );
}

