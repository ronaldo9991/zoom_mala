import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { HeaderBar } from "@/components/live-rates/HeaderBar";
import { CommodityTable } from "@/components/live-rates/CommodityTable";
import { SpotCards } from "@/components/live-rates/SpotCards";
import { MarketPulse } from "@/components/live-rates/MarketPulse";
import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";

interface LiveRatesData {
  gold: {
    spot: number;
    aedPerOz: { bid: number; ask: number; mid: number };
    aedPerGram: { bid: number; ask: number; mid: number };
    aedPerKg: { bid: number; ask: number; mid: number };
    aed1Gm: { bid: number; ask: number; mid: number };
    aed10Gm: { bid: number; ask: number; mid: number };
    aedTTB: { bid: number; ask: number; mid: number };
  };
  silver: {
    spot: number;
    aedPerOz: { bid: number; ask: number; mid: number };
    aedPerKg: { bid: number; ask: number; mid: number };
  };
  usdToAED: number;
  timestamp: number;
  isDelayed: boolean;
  isDemo: boolean;
  provider?: string;
}

async function fetchLiveRates(): Promise<LiveRatesData> {
  const response = await fetch("/api/live-rates");
  if (!response.ok) {
    throw new Error("Failed to fetch live rates");
  }
  return response.json();
}

export default function LiveRates() {
  const [location] = useLocation();
  const isTVMode = useMemo(() => {
    const parts = location.split("?");
    if (parts.length < 2) return false;
    const params = new URLSearchParams(parts[1]);
    return params.get("mode") === "tv";
  }, [location]);
  const [previousData, setPreviousData] = useState<LiveRatesData | null>(null);

  // Poll every 5-10 seconds (5s for TV mode, 10s for regular)
  const pollInterval = isTVMode ? 5000 : 10000;

  const { data, isLoading, error } = useQuery({
    queryKey: ["live-rates"],
    queryFn: fetchLiveRates,
    refetchInterval: pollInterval,
    refetchIntervalInBackground: true,
    staleTime: 0,
  });

  useEffect(() => {
    if (data) {
      setPreviousData(data);
    }
  }, [data]);

  // Prevent scrolling in TV mode
  useEffect(() => {
    if (isTVMode) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isTVMode]);

  if (isLoading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4" />
          <p className="text-muted-foreground">Loading live rates...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive text-lg mb-2">Failed to load rates</p>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  // Prepare commodity table data
  const commodityData = [
    {
      commodity: "GOLD 999.9",
      weight: "1 KG",
      bid: data.gold.aedPerKg.bid,
      ask: data.gold.aedPerKg.ask,
      lastBid: previousData?.gold.aedPerKg.bid,
      lastAsk: previousData?.gold.aedPerKg.ask,
    },
    {
      commodity: "GOLD TTB",
      weight: "1 TTB",
      bid: data.gold.aedTTB.bid,
      ask: data.gold.aedTTB.ask,
      lastBid: previousData?.gold.aedTTB.bid,
      lastAsk: previousData?.gold.aedTTB.ask,
    },
    {
      commodity: "GOLD 995",
      weight: "1 GM",
      bid: data.gold.aed1Gm.bid,
      ask: data.gold.aed1Gm.ask,
      lastBid: previousData?.gold.aed1Gm.bid,
      lastAsk: previousData?.gold.aed1Gm.ask,
    },
    {
      commodity: "GOLD",
      weight: "10 GM",
      bid: data.gold.aed10Gm.bid,
      ask: data.gold.aed10Gm.ask,
      lastBid: previousData?.gold.aed10Gm.bid,
      lastAsk: previousData?.gold.aed10Gm.ask,
    },
    {
      commodity: "SILVER",
      weight: "1 KG",
      bid: data.silver.aedPerKg.bid,
      ask: data.silver.aedPerKg.ask,
      lastBid: previousData?.silver.aedPerKg.bid,
      lastAsk: previousData?.silver.aedPerKg.ask,
    },
  ];

  // Calculate market pulse (simplified: derive from price movements)
  // In a real implementation, this would come from actual trade data
  const buyersPercentage = 55; // Placeholder - would calculate from last 10 ticks
  const sellersPercentage = 45;

  // Status determination
  let status = "LIVE";
  if (data.isDemo) {
    status = "DEMO";
  } else if (data.isDelayed) {
    status = "DELAYED";
  }

  const lastUpdated = new Date(data.timestamp);
  const delaySeconds = Math.floor((Date.now() - data.timestamp) / 1000);

  return (
    <div
      className={cn(
        "min-h-screen bg-background",
        isTVMode && "h-screen overflow-hidden"
      )}
    >
      {/* TV Mode Watermark */}
      {isTVMode && (
        <div className="fixed bottom-4 left-4 z-50 pointer-events-none">
          <div className="text-muted-foreground/30 font-serif text-lg">
            Zoom Mala Live Rates
          </div>
        </div>
      )}

      {/* Status Pill */}
      <div className="fixed top-4 right-4 z-50">
        <div
          className={cn(
            "px-4 py-2 rounded-full font-semibold text-sm",
            status === "LIVE" && "bg-green-500/20 text-green-400 border border-green-500/30",
            status === "DELAYED" && "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
            status === "DEMO" && "bg-blue-500/20 text-blue-400 border border-blue-500/30",
            isTVMode && "px-6 py-3 text-base"
          )}
        >
          {status}
        </div>
      </div>

      {/* Header */}
      <HeaderBar isTVMode={isTVMode} />

      {/* Main Content */}
      <main
        className={cn(
          "max-w-7xl mx-auto",
          isTVMode ? "p-8 h-[calc(100vh-120px)] overflow-auto" : "p-6 py-8"
        )}
      >
        <div
          className={cn(
            "grid gap-6",
            isTVMode ? "grid-cols-1 gap-8" : "lg:grid-cols-3"
          )}
        >
          {/* Left Column: Commodity Table */}
          <div className={isTVMode ? "" : "lg:col-span-2"}>
            <CommodityTable data={commodityData} isTVMode={isTVMode} />
          </div>

          {/* Right Column: Spot Cards & Market Pulse */}
          <div className={isTVMode ? "mt-8" : "space-y-6"}>
            <SpotCards
              goldSpot={data.gold.spot}
              goldBid={data.gold.aedPerOz.bid}
              goldAsk={data.gold.aedPerOz.ask}
              silverSpot={data.silver.spot}
              silverBid={data.silver.aedPerOz.bid}
              silverAsk={data.silver.aedPerOz.ask}
              isTVMode={isTVMode}
              lastGoldSpot={previousData?.gold.spot}
              lastSilverSpot={previousData?.silver.spot}
            />

            <MarketPulse
              buyersPercentage={buyersPercentage}
              sellersPercentage={sellersPercentage}
              isTVMode={isTVMode}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div
          className={cn(
            "mt-8 pt-6 border-t border-border text-center text-muted-foreground",
            isTVMode ? "text-lg" : "text-sm"
          )}
        >
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
            {data.provider && <span>• Source: {data.provider}</span>}
            {data.isDelayed && (
              <span>• Delay: {delaySeconds}s</span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

