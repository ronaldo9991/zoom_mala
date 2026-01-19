import { useEffect, useState } from "react";
import { COMPANY, ADDRESS } from "@/lib/assets";
import { cn } from "@/lib/utils";

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
        "w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isTVMode ? "py-6 px-8" : "py-4 px-6"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo and Address */}
        <div className="flex items-center gap-4">
          <div>
            <h1
              className={cn(
                "font-serif font-bold text-gold",
                isTVMode ? "text-3xl" : "text-xl"
              )}
            >
              {COMPANY.shortName}
            </h1>
            <p
              className={cn(
                "text-muted-foreground",
                isTVMode ? "text-lg mt-1" : "text-sm"
              )}
            >
              {ADDRESS.full}
            </p>
          </div>
        </div>

        {/* Center: Live Clock */}
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "font-mono font-bold tabular-nums",
              isTVMode
                ? "text-5xl text-foreground"
                : "text-2xl text-foreground"
            )}
          >
            {formatTime(time)}
          </div>
          <div
            className={cn(
              "text-muted-foreground mt-1",
              isTVMode ? "text-lg" : "text-xs"
            )}
          >
            LIVE
          </div>
        </div>

        {/* Right: Date */}
        <div
          className={cn(
            "text-right text-muted-foreground",
            isTVMode ? "text-lg" : "text-sm"
          )}
        >
          <div className="font-medium">{formatDate(date)}</div>
        </div>
      </div>
    </header>
  );
}

