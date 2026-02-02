import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { COMPANY, NAV_LINKS } from "@/lib/assets";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 safe-area-inset-top ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg"
          : "bg-background/90 backdrop-blur-md border-b border-border/30"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20 min-h-[56px]">
          <Link href="/">
            <motion.div
              className="flex items-center cursor-pointer group min-h-[44px] min-w-[44px] -ml-1 flex-shrink-0"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid="link-home"
            >
              <img
                src={COMPANY.logo}
                alt="Zoom Mala Gold & Diamond L.L.C"
                className="h-8 sm:h-9 md:h-12 w-auto object-contain flex-shrink-0 mr-2 sm:mr-3"
              />
              <span className="font-serif text-base sm:text-lg md:text-2xl font-semibold tracking-wider text-foreground group-hover:text-gold transition-colors truncate max-w-[140px] sm:max-w-none">
                {COMPANY.shortName}
              </span>
              <div className="hidden md:block ml-2 h-6 w-px bg-gold/30 flex-shrink-0" />
              <span className="hidden md:block ml-2 text-xs text-muted-foreground tracking-widest uppercase flex-shrink-0">
                Gold & Diamonds
              </span>
            </motion.div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.span
                  className={`px-3 py-2.5 text-sm tracking-wide cursor-pointer transition-colors relative group min-h-[44px] inline-flex items-center ${
                    location === link.href
                      ? "text-gold"
                      : "text-foreground/80 hover:text-foreground"
                  }`}
                  whileHover={{ y: -1 }}
                  data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-gold transition-all duration-300 ${
                      location === link.href ? "w-8" : "w-0 group-hover:w-4"
                    }`}
                  />
                </motion.span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-0.5 sm:gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-10 w-10 sm:h-11 sm:w-11 text-foreground/70 hover:text-foreground touch-manipulation"
              data-testid="button-theme-toggle"
            >
              <AnimatePresence mode="wait">
                {theme === "dark" ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-10 w-10 sm:h-11 sm:w-11 text-foreground touch-manipulation"
              onClick={() => setIsOpen(!isOpen)}
              data-testid="button-mobile-menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-2 pb-4 space-y-0 border-t border-border/30">
                {NAV_LINKS.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={link.href}>
                      <span
                        className={`block px-4 py-3.5 min-h-[48px] flex items-center text-[15px] tracking-wide cursor-pointer transition-colors active:bg-muted/50 ${
                          location === link.href
                            ? "text-gold bg-gold/10 font-medium"
                            : "text-foreground/90 hover:text-foreground hover:bg-muted/50"
                        }`}
                        data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
