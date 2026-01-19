import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { formatSpot } from "@/lib/rates/convert";
import { TrendingUp, TrendingDown } from "lucide-react";

interface SpotCardProps {
  metal: "gold" | "silver";
  spot: number;
  bid: number;
  ask: number;
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

  useEffect(() => {
    if (lastValue === undefined) return;
    
    if (value > lastValue) {
      setFlash("up");
    } else if (value < lastValue) {
      setFlash("down");
    }

    const timer = setTimeout(() => setFlash(null), 300);
    return () => clearTimeout(timer);
  }, [value, lastValue]);

  const decimals = value > 100 ? 2 : 3;

  return (
    <span
      className={cn(
        "font-mono tabular-nums transition-colors duration-200",
        isTVMode ? "text-4xl font-bold" : "text-2xl font-bold",
        flash === "up" && "text-green-400 bg-green-400/10 rounded px-2",
        flash === "down" && "text-red-400 bg-red-400/10 rounded px-2"
      )}
    >
      {formatSpot(value, decimals)}
    </span>
  );
}

export function SpotCard({
  metal,
  spot,
  bid,
  ask,
  change = 0,
  changePercent = 0,
  isTVMode = false,
  lastSpot,
}: SpotCardProps) {
  const isPositive = change >= 0;
  const decimals = spot > 100 ? 2 : 3;

  return (
    <div
      className={cn(
        "border border-border rounded-lg p-6 bg-card",
        isTVMode && "p-8 border-2"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className={cn(
            "font-semibold text-foreground uppercase",
            isTVMode ? "text-2xl" : "text-lg"
          )}
        >
          {metal === "gold" ? "Gold" : "Silver"} Spot (USD/OZ)
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <div
            className={cn(
              "text-muted-foreground mb-2",
              isTVMode ? "text-lg" : "text-sm"
            )}
          >
            Spot Price
          </div>
          <AnimatedSpot
            value={spot}
            lastValue={lastSpot}
            isTVMode={isTVMode}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div>
            <div
              className={cn(
                "text-muted-foreground mb-1",
                isTVMode ? "text-base" : "text-xs"
              )}
            >
              Bid
            </div>
            <div
              className={cn(
                "font-mono tabular-nums text-gold",
                isTVMode ? "text-xl" : "text-base"
              )}
            >
              {formatSpot(bid, decimals)}
            </div>
          </div>
          <div>
            <div
              className={cn(
                "text-muted-foreground mb-1",
                isTVMode ? "text-base" : "text-xs"
              )}
            >
              Ask
            </div>
            <div
              className={cn(
                "font-mono tabular-nums text-gold",
                isTVMode ? "text-xl" : "text-base"
              )}
            >
              {formatSpot(ask, decimals)}
            </div>
          </div>
        </div>

        {(change !== 0 || changePercent !== 0) && (
          <div className="flex items-center gap-2 pt-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span
              className={cn(
                "font-mono tabular-nums",
                isPositive ? "text-green-400" : "text-red-400",
                isTVMode ? "text-lg" : "text-sm"
              )}
            >
              {isPositive ? "+" : ""}
              {change.toFixed(decimals)} ({isPositive ? "+" : ""}
              {changePercent.toFixed(2)}%)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

interface SpotCardsProps {
  goldSpot: number;
  goldBid: number;
  goldAsk: number;
  silverSpot: number;
  silverBid: number;
  silverAsk: number;
  isTVMode?: boolean;
  lastGoldSpot?: number;
  lastSilverSpot?: number;
}

export function SpotCards({
  goldSpot,
  goldBid,
  goldAsk,
  silverSpot,
  silverBid,
  silverAsk,
  isTVMode = false,
  lastGoldSpot,
  lastSilverSpot,
}: SpotCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SpotCard
        metal="gold"
        spot={goldSpot}
        bid={goldBid}
        ask={goldAsk}
        isTVMode={isTVMode}
        lastSpot={lastGoldSpot}
      />
      <SpotCard
        metal="silver"
        spot={silverSpot}
        bid={silverBid}
        ask={silverAsk}
        isTVMode={isTVMode}
        lastSpot={lastSilverSpot}
      />
    </div>
  );
}

