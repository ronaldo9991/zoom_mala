import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { useMemo } from "react";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Collections from "@/pages/Collections";
import GoldTrading from "@/pages/GoldTrading";
import DiamondsStones from "@/pages/DiamondsStones";
import Watches from "@/pages/Watches";
import Contact from "@/pages/Contact";
import LiveRates from "@/pages/LiveRates";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/collections" component={Collections} />
      <Route path="/gold-trading" component={GoldTrading} />
      <Route path="/diamonds-stones" component={DiamondsStones} />
      <Route path="/watches" component={Watches} />
      <Route path="/contact" component={Contact} />
      <Route path="/live-rates" component={LiveRates} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isTVMode = useMemo(() => {
    const params = new URLSearchParams(location.split("?")[1] || "");
    return params.get("mode") === "tv";
  }, [location]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {!isTVMode && <Navbar />}
      <Router />
      {!isTVMode && <Footer />}
      {!isTVMode && <WhatsAppFloat />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
