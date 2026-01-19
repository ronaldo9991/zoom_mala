import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { formatAED } from "@/lib/rates/convert";

interface CommodityRow {
  commodity: string;
  weight: string;
  bid: number;
  ask: number;
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

  return (
    <span
      className={cn(
        "font-mono tabular-nums transition-colors duration-200",
        isTVMode ? "text-2xl" : "text-lg",
        flash === "up" && "text-green-400 bg-green-400/10",
        flash === "down" && "text-red-400 bg-red-400/10"
      )}
    >
      {formatAED(value, 2)}
    </span>
  );
}

export function CommodityTable({ data, isTVMode = false }: CommodityTableProps) {
  const [lastData, setLastData] = useState<CommodityRow[]>([]);

  useEffect(() => {
    setLastData(data);
  }, [data]);

  return (
    <div className="w-full">
      <div
        className={cn(
          "border border-border rounded-lg overflow-hidden bg-card",
          isTVMode && "border-2"
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th
                  className={cn(
                    "text-left font-semibold text-foreground",
                    isTVMode ? "p-6 text-xl" : "p-4 text-sm"
                  )}
                >
                  Commodity
                </th>
                <th
                  className={cn(
                    "text-left font-semibold text-foreground",
                    isTVMode ? "p-6 text-xl" : "p-4 text-sm"
                  )}
                >
                  Weight
                </th>
                <th
                  className={cn(
                    "text-right font-semibold text-foreground",
                    isTVMode ? "p-6 text-xl" : "p-4 text-sm"
                  )}
                >
                  Bid (AED)
                </th>
                <th
                  className={cn(
                    "text-right font-semibold text-foreground",
                    isTVMode ? "p-6 text-xl" : "p-4 text-sm"
                  )}
                >
                  Ask (AED)
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => {
                const lastRow = lastData[idx];
                return (
                  <tr
                    key={idx}
                    className={cn(
                      "border-b border-border/50 last:border-0 transition-colors",
                      "hover:bg-muted/20"
                    )}
                  >
                    <td
                      className={cn(
                        "font-medium",
                        isTVMode ? "p-6 text-xl" : "p-4"
                      )}
                    >
                      {row.commodity}
                    </td>
                    <td
                      className={cn(
                        "text-muted-foreground",
                        isTVMode ? "p-6 text-xl" : "p-4"
                      )}
                    >
                      {row.weight}
                    </td>
                    <td
                      className={cn(
                        "text-right font-mono",
                        isTVMode ? "p-6" : "p-4"
                      )}
                    >
                      <AnimatedPrice
                        value={row.bid}
                        lastValue={lastRow?.bid}
                        isTVMode={isTVMode}
                      />
                    </td>
                    <td
                      className={cn(
                        "text-right font-mono",
                        isTVMode ? "p-6" : "p-4"
                      )}
                    >
                      <AnimatedPrice
                        value={row.ask}
                        lastValue={lastRow?.ask}
                        isTVMode={isTVMode}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

