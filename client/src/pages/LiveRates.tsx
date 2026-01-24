import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef, useMemo } from "react";
import { Clock, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";

// Custom Gold Colors from Zoom Mala Logo
const GOLD = {
  light: '#F8DB67',      // Light highlight gold
  main: '#E1B245',       // Primary metallic gold
  deep: '#C9A24D',       // Deep gold / shadow
  dark: '#9E7A2F',       // Dark antique gold
  glow: 'rgba(225, 178, 69, 0.35)',
  glowSubtle: 'rgba(225, 178, 69, 0.15)',
};

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

// Format number with proper precision and thousand separators
function formatPrice(value: number, decimals: number = 2): string {
  return value.toLocaleString('en-US', { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  });
}

// Animated Price Component with color flash on change
function AnimatedPrice({ 
  value, 
  previousValue, 
  decimals = 2,
  className = ""
}: { 
  value: number; 
  previousValue?: number; 
  decimals?: number;
  className?: string;
}) {
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const prevRef = useRef(previousValue);

  useEffect(() => {
    if (prevRef.current !== undefined && prevRef.current !== value) {
      if (value > prevRef.current) {
        setFlash('up');
      } else if (value < prevRef.current) {
        setFlash('down');
      }
      const timer = setTimeout(() => setFlash(null), 800);
      return () => clearTimeout(timer);
    }
    prevRef.current = value;
  }, [value]);

  const flashClass = flash === 'up' 
    ? 'text-emerald-400 animate-pulse' 
    : flash === 'down' 
    ? 'text-red-400 animate-pulse' 
    : 'text-white';

  return (
    <span className={`transition-colors duration-300 ${flashClass} ${className} text-white`}>
      {formatPrice(value, decimals)}
    </span>
  );
}

// Header Bar Component
function HeaderBar({ currentTime }: { currentTime: Date }) {
  return (
    <header 
      className="backdrop-blur-sm sticky top-0 z-50"
      style={{ 
        background: 'linear-gradient(to right, rgba(0,0,0,0.98), rgba(0,0,0,0.95))',
        borderBottom: `1px solid ${GOLD.deep}40`
      }}
    >
      <div className="max-w-[1920px] mx-auto px-4 lg:px-8 py-3 lg:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo + Brand Name */}
          <div className="flex items-center gap-4 min-w-0">
            <img 
              src="/zoom-mala-logo.png" 
              alt="Zoom Mala Gold & Diamond L.L.C" 
              className="h-14 lg:h-16 xl:h-20 w-auto object-contain flex-shrink-0"
            />
            <div className="hidden md:block">
              <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold">
                <span className="text-white">ZOOM</span>
                <span style={{ color: GOLD.main }}> MALA</span>
              </h1>
              <p className="text-xs lg:text-sm tracking-wider" style={{ color: GOLD.deep }}>GOLD & DIAMONDS L.L.C</p>
            </div>
          </div>

          {/* Right Section: Clock + Status */}
          <div className="flex items-center gap-3 lg:gap-6 flex-shrink-0">
            {/* Real-time Clock */}
            <div 
              className="hidden sm:flex items-center gap-3 rounded-2xl px-4 lg:px-6 py-2 lg:py-3"
              style={{ 
                background: 'rgba(0,0,0,0.5)',
                border: `1px solid ${GOLD.dark}40`
              }}
            >
              <Clock className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: GOLD.main }} />
              <div>
                <div 
                  className="font-mono text-lg lg:text-xl xl:text-2xl font-semibold tabular-nums whitespace-nowrap"
                  style={{ color: GOLD.main }}
                >
                  {currentTime.toLocaleTimeString('en-US', { hour12: true })}
                </div>
                <div className="text-[10px] lg:text-xs whitespace-nowrap" style={{ color: `${GOLD.deep}99` }}>
                  {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Live Status Badge */}
            <div 
              className="flex items-center gap-2 rounded-full px-4 py-2"
              style={{ 
                background: `${GOLD.main}15`,
                border: `1px solid ${GOLD.main}50`
              }}
            >
              <span className="relative flex h-3 w-3">
                <span 
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: GOLD.main }}
                ></span>
                <span 
                  className="relative inline-flex rounded-full h-3 w-3"
                  style={{ background: GOLD.main }}
                ></span>
              </span>
              <span className="font-semibold text-sm uppercase tracking-wider" style={{ color: GOLD.main }}>Live</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Spot Card Component
function SpotCard({ 
  metal, 
  symbol, 
  spotUSD, 
  spotAED, 
  previousSpotUSD,
  isGold = true 
}: { 
  metal: string;
  symbol: string;
  spotUSD: number;
  spotAED: number;
  previousSpotUSD?: number;
  isGold?: boolean;
}) {
  // Gold theme: custom gold colors | Silver theme: slate/silver colors
  const goldGradient = `linear-gradient(135deg, ${GOLD.dark}20, ${GOLD.deep}15, transparent)`;
  const silverGradient = 'linear-gradient(135deg, rgba(100,116,139,0.2), rgba(71,85,105,0.15), transparent)';
  
  const borderColor = isGold ? `${GOLD.main}60` : 'rgba(148,163,184,0.4)';
  const textColor = isGold ? GOLD.main : '#cbd5e1';
  const subTextColor = isGold ? `${GOLD.deep}99` : 'rgba(148,163,184,0.6)';
  const dotColor = isGold ? GOLD.main : '#94a3b8';
  const glowStyle = isGold 
    ? { boxShadow: `0 0 40px ${GOLD.glowSubtle}` }
    : { boxShadow: '0 0 40px rgba(148,163,184,0.1)' };

  return (
    <div 
      className="rounded-2xl p-5 lg:p-6 xl:p-8 backdrop-blur-sm transition-all duration-300 hover:scale-[1.01]"
      style={{ 
        background: isGold ? goldGradient : silverGradient,
        border: `1px solid ${borderColor}`,
        ...glowStyle
      }}
    >
      <div className="flex items-center justify-between gap-4 min-w-0">
        <div className="min-w-0 flex-shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ background: dotColor }}></div>
            <h3 className="font-bold text-lg lg:text-xl xl:text-2xl" style={{ color: textColor }}>{metal}</h3>
          </div>
          <p className="text-xs lg:text-sm" style={{ color: subTextColor }}>{symbol} / troy oz</p>
        </div>
        <div className="text-right min-w-0 flex-1">
          <div 
            className="font-bold tabular-nums tracking-tight text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl whitespace-nowrap text-white"
          >
            $<AnimatedPrice value={spotUSD} previousValue={previousSpotUSD} />
          </div>
          <div 
            className="text-sm lg:text-base xl:text-lg mt-2 tabular-nums whitespace-nowrap text-white"
          >
            AED {formatPrice(spotAED)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Rate Row Component
function ProductRateRow({ 
  label, 
  bid, 
  ask, 
  previousBid,
  previousAsk,
  isAlternate = false,
  isGold = true
}: { 
  label: string;
  bid: number;
  ask: number;
  previousBid?: number;
  previousAsk?: number;
  isAlternate?: boolean;
  isGold?: boolean;
}) {
  // Gold theme: custom gold colors | Silver theme: slate colors
  const bgColor = isAlternate 
    ? (isGold ? `${GOLD.dark}08` : 'rgba(100,116,139,0.03)') 
    : 'transparent';
  const borderColor = isGold ? `${GOLD.dark}20` : 'rgba(100,116,139,0.1)';
  const textColor = isGold ? GOLD.main : '#cbd5e1';
  
  return (
    <tr 
      className="transition-all duration-200"
      style={{ 
        background: bgColor,
        borderBottom: `1px solid ${borderColor}`
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = isGold ? `${GOLD.dark}15` : 'rgba(100,116,139,0.05)'}
      onMouseLeave={(e) => e.currentTarget.style.background = bgColor}
    >
      <td className="px-4 lg:px-6 xl:px-8 py-4 lg:py-5">
        <span className="font-medium text-sm lg:text-base xl:text-lg whitespace-nowrap" style={{ color: textColor }}>{label}</span>
      </td>
      <td className="px-4 lg:px-6 xl:px-8 py-4 lg:py-5 text-right">
        <AnimatedPrice 
          value={bid} 
          previousValue={previousBid}
          className="font-bold text-lg lg:text-xl xl:text-2xl tabular-nums text-white"
        />
      </td>
      <td className="px-4 lg:px-6 xl:px-8 py-4 lg:py-5 text-right">
        <AnimatedPrice 
          value={ask} 
          previousValue={previousAsk}
          className="font-bold text-lg lg:text-xl xl:text-2xl tabular-nums text-white"
        />
      </td>
    </tr>
  );
}

// Product Rates Table Component
function ProductRatesTable({ 
  title, 
  rates, 
  previousRates,
  isGold = true 
}: { 
  title: string;
  rates: Array<{ label: string; bid: number; ask: number }>;
  previousRates?: Array<{ label: string; bid: number; ask: number }>;
  isGold?: boolean;
}) {
  // Gold theme: custom gold colors | Silver theme: slate colors
  const borderColor = isGold ? `${GOLD.deep}50` : 'rgba(148,163,184,0.3)';
  const headerBg = isGold 
    ? `linear-gradient(to right, ${GOLD.dark}40, ${GOLD.deep}25, transparent)` 
    : 'linear-gradient(to right, rgba(71,85,105,0.3), rgba(51,65,85,0.2), transparent)';
  const textColor = isGold ? GOLD.main : '#cbd5e1';
  const headerTextColor = isGold ? `${GOLD.deep}` : 'rgba(148,163,184,0.6)';
  const accentColor = isGold ? GOLD.main : '#94a3b8';
  const glowStyle = isGold 
    ? { boxShadow: `0 0 50px ${GOLD.glowSubtle}` }
    : { boxShadow: '0 0 50px rgba(148,163,184,0.08)' };

  return (
    <div 
      className="rounded-2xl overflow-hidden backdrop-blur-sm"
      style={{ 
        border: `1px solid ${borderColor}`,
        background: 'rgba(0,0,0,0.5)',
        ...glowStyle
      }}
    >
      <div 
        className="px-4 lg:px-6 xl:px-8 py-4 lg:py-5"
        style={{ 
          background: headerBg,
          borderBottom: `1px solid ${borderColor}`
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-2 h-8 rounded-full"
            style={{ background: `linear-gradient(to bottom, ${isGold ? GOLD.light : '#e2e8f0'}, ${accentColor})` }}
          ></div>
          <h3 className="font-bold text-base lg:text-lg xl:text-xl tracking-wide uppercase" style={{ color: textColor }}>{title}</h3>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px]">
          <thead>
            <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
              <th className="text-left font-semibold text-xs uppercase tracking-widest px-4 lg:px-6 xl:px-8 py-3 lg:py-4" style={{ color: headerTextColor }}>
                Product
              </th>
              <th className="text-right font-semibold text-xs uppercase tracking-widest px-4 lg:px-6 xl:px-8 py-3 lg:py-4" style={{ color: headerTextColor }}>
                <span className="flex items-center justify-end gap-1">
                  <TrendingDown className="w-3 h-3" />
                  Bid (We Buy)
                </span>
              </th>
              <th className="text-right font-semibold text-xs uppercase tracking-widest px-4 lg:px-6 xl:px-8 py-3 lg:py-4" style={{ color: headerTextColor }}>
                <span className="flex items-center justify-end gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Ask (We Sell)
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rates.map((rate, index) => {
              const prevRate = previousRates?.find(p => p.label === rate.label);
              return (
                <ProductRateRow 
                  key={rate.label}
                  label={rate.label}
                  bid={rate.bid}
                  ask={rate.ask}
                  previousBid={prevRate?.bid}
                  previousAsk={prevRate?.ask}
                  isAlternate={index % 2 === 0}
                  isGold={isGold}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Stat Row Component
function StatRow({ label, value, isNumeric = false }: { label: string; value: string; isNumeric?: boolean }) {
  return (
    <div 
      className="flex items-center justify-between gap-4 py-3 last:border-b-0"
      style={{ borderBottom: `1px solid ${GOLD.dark}20` }}
    >
      <span className="text-xs uppercase tracking-widest" style={{ color: `${GOLD.deep}99` }}>{label}</span>
      <span className={`font-semibold text-base lg:text-lg ${isNumeric ? 'tabular-nums' : ''} text-white`}>
        {value}
      </span>
    </div>
  );
}

// Right Panel Component
function RightPanel({ 
  usdToAED, 
  lastUpdate, 
  provider 
}: { 
  usdToAED: number;
  lastUpdate: Date;
  provider: string;
}) {
  return (
    <div className="space-y-4 lg:space-y-6 xl:pt-10">
      {/* Gold & Silver Visual Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Gold Card */}
        <div 
          className="relative rounded-2xl p-4 lg:p-5 overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${GOLD.dark}40, ${GOLD.deep}20, transparent)`,
            border: `1px solid ${GOLD.main}50`
          }}
        >
          <div 
            className="absolute inset-0"
            style={{ background: `radial-gradient(ellipse at top right, ${GOLD.main}20, transparent, transparent)` }}
          ></div>
          <div className="relative z-10 text-center">
            <div 
              className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-2 rounded-full"
              style={{ 
                background: `linear-gradient(135deg, ${GOLD.light}, ${GOLD.main}, ${GOLD.deep})`,
                boxShadow: `0 4px 20px ${GOLD.glow}`
              }}
            ></div>
            <h3 className="font-bold text-sm lg:text-base" style={{ color: GOLD.main }}>GOLD</h3>
            <p className="text-[10px] lg:text-xs mt-0.5" style={{ color: `${GOLD.deep}99` }}>999.9 Fine</p>
          </div>
        </div>
        
        {/* Silver Card */}
        <div className="relative bg-gradient-to-br from-slate-700/30 via-slate-600/15 to-black border border-slate-400/30 rounded-2xl p-4 lg:p-5 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-400/15 via-transparent to-transparent"></div>
          <div className="relative z-10 text-center">
            <div className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 shadow-lg shadow-slate-400/30"></div>
            <h3 className="text-slate-300 font-bold text-sm lg:text-base">SILVER</h3>
            <p className="text-slate-400/50 text-[10px] lg:text-xs mt-0.5">999 Fine</p>
          </div>
        </div>
      </div>

      {/* Stats Card - aligned with Gold Rates */}
      <div 
        className="rounded-2xl p-4 lg:p-6 backdrop-blur-sm"
        style={{ 
          marginTop: '80px',
          background: `linear-gradient(135deg, ${GOLD.dark}15, rgba(0,0,0,0.5), rgba(71,85,105,0.1))`,
          border: `1px solid ${GOLD.deep}40`
        }}
      >
        <h4 className="text-xs uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: `${GOLD.deep}` }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD.main }}></div>
          Market Info
        </h4>
        <StatRow label="USD/AED" value={usdToAED.toFixed(4)} isNumeric />
        <StatRow label="Last Update" value={lastUpdate.toLocaleTimeString('en-US', { hour12: true })} isNumeric />
        <StatRow label="Source" value={provider} />
      </div>

      {/* Status Indicator */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/30 rounded-2xl p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Connected</span>
        </div>
        <p className="text-emerald-500/50 text-xs">Real-time MT5 Feed</p>
      </div>
    </div>
  );
}

export default function LiveRates() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [previousData, setPreviousData] = useState<LiveRatesData | null>(null);

  // Real-time clock update every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["live-rates"],
    queryFn: fetchLiveRates,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    staleTime: 0,
  });

  // Store previous data for comparison
  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => {
        setPreviousData(data);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [data?.timestamp]);

  // Memoized rate arrays
  const goldRates = useMemo(() => data ? [
    { label: "GOLD 999.9 / KG", bid: data.gold.aedPerKg.bid, ask: data.gold.aedPerKg.ask },
    { label: "GOLD TTB (116.64g)", bid: data.gold.aedTTB.bid, ask: data.gold.aedTTB.ask },
    { label: "GOLD 995 / GRAM", bid: data.gold.aed1Gm.bid, ask: data.gold.aed1Gm.ask },
    { label: "GOLD / 10 GRAMS", bid: data.gold.aed10Gm.bid, ask: data.gold.aed10Gm.ask },
  ] : [], [data]);

  const previousGoldRates = useMemo(() => previousData ? [
    { label: "GOLD 999.9 / KG", bid: previousData.gold.aedPerKg.bid, ask: previousData.gold.aedPerKg.ask },
    { label: "GOLD TTB (116.64g)", bid: previousData.gold.aedTTB.bid, ask: previousData.gold.aedTTB.ask },
    { label: "GOLD 995 / GRAM", bid: previousData.gold.aed1Gm.bid, ask: previousData.gold.aed1Gm.ask },
    { label: "GOLD / 10 GRAMS", bid: previousData.gold.aed10Gm.bid, ask: previousData.gold.aed10Gm.ask },
  ] : undefined, [previousData]);

  const silverRates = useMemo(() => data ? [
    { label: "SILVER / KG", bid: data.silver.aedPerKg.bid, ask: data.silver.aedPerKg.ask },
  ] : [], [data]);

  const previousSilverRates = useMemo(() => previousData ? [
    { label: "SILVER / KG", bid: previousData.silver.aedPerKg.bid, ask: previousData.silver.aedPerKg.ask },
  ] : undefined, [previousData]);

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 lg:w-16 lg:h-16 animate-spin mx-auto mb-4 lg:mb-6" style={{ color: GOLD.main }} />
          <p className="text-lg lg:text-xl font-semibold" style={{ color: GOLD.main }}>Loading Live Rates...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black flex items-center justify-center">
        <div 
          className="text-center rounded-2xl p-8 lg:p-10 backdrop-blur-sm"
          style={{ 
            background: 'rgba(0,0,0,0.5)',
            border: `1px solid ${GOLD.deep}50`
          }}
        >
          <p className="text-xl lg:text-2xl font-bold mb-3" style={{ color: GOLD.main }}>Connection Error</p>
          <p style={{ color: `${GOLD.deep}99` }}>Retrying automatically...</p>
        </div>
      </div>
    );
  }

  const lastUpdate = new Date(data.timestamp);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black">
      {/* Subtle noise texture overlay */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]"></div>

      {/* Header */}
      <HeaderBar currentTime={currentTime} />

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto px-4 lg:px-8 py-4 lg:py-6 xl:py-8">
        {/* 12-column grid: 8 left + 4 right on desktop */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6 xl:gap-8">
          
          {/* Left Column (8 cols) */}
          <div className="xl:col-span-8 space-y-4 lg:space-y-6">
            
            {/* Spot Prices Section */}
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest mb-3 lg:mb-4" style={{ color: GOLD.deep }}>
                Spot Prices (USD)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <SpotCard 
                  metal="GOLD"
                  symbol="XAU"
                  spotUSD={data.gold.spot}
                  spotAED={data.gold.aedPerOz.mid}
                  previousSpotUSD={previousData?.gold.spot}
                  isGold={true}
                />
                <SpotCard 
                  metal="SILVER"
                  symbol="XAG"
                  spotUSD={data.silver.spot}
                  spotAED={data.silver.aedPerOz.mid}
                  previousSpotUSD={previousData?.silver.spot}
                  isGold={false}
                />
              </div>
            </section>

            {/* Trading Rates Section */}
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest mb-3 lg:mb-4" style={{ color: GOLD.deep }}>
                Trading Rates (AED)
              </h2>
              <div className="space-y-4 lg:space-y-6">
                <ProductRatesTable 
                  title="Gold Rates" 
                  rates={goldRates}
                  previousRates={previousGoldRates}
                  isGold={true}
                />
                <ProductRatesTable 
                  title="Silver Rates" 
                  rates={silverRates}
                  previousRates={previousSilverRates}
                  isGold={false}
                />
              </div>
            </section>
          </div>

          {/* Right Column (4 cols) */}
          <div className="xl:col-span-4">
            <RightPanel 
              usdToAED={data.usdToAED}
              lastUpdate={lastUpdate}
              provider={data.provider || "MT5 Live"}
            />
          </div>
        </div>

        {/* Footer */}
        <footer 
          className="mt-8 lg:mt-12 pt-6 lg:pt-8 text-center"
          style={{ borderTop: `1px solid ${GOLD.dark}20` }}
        >
          <img 
            src="/zoom-mala-logo.png" 
            alt="Zoom Mala Gold & Diamond L.L.C" 
            className="h-16 lg:h-20 xl:h-24 w-auto object-contain mx-auto mb-3"
          />
          <p className="text-xs lg:text-sm" style={{ color: `${GOLD.deep}99` }}>Your Trusted Partner in Gold & Diamond Trading</p>
          <p className="text-[10px] lg:text-xs mt-2" style={{ color: `${GOLD.dark}99` }}>Rates are indicative and subject to change</p>
        </footer>
      </main>
    </div>
  );
}
