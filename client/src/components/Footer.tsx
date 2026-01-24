import { Link } from "wouter";
import { motion } from "framer-motion";
import { COMPANY, ADDRESS, NAV_LINKS, FOOTER_LINKS } from "@/lib/assets";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-serif text-2xl font-semibold tracking-wide text-foreground mb-4">
                {COMPANY.name}
              </h3>
              <p className="text-muted-foreground max-w-md leading-relaxed mb-6">
                {COMPANY.description}
              </p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>{ADDRESS.line1}</p>
                <p>{ADDRESS.line2}</p>
                <p>{ADDRESS.city}, {ADDRESS.country}</p>
              </div>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="font-serif text-lg font-medium tracking-wide text-foreground mb-6">
                Navigate
              </h4>
              <nav className="space-y-3">
                {NAV_LINKS.slice(0, 4).map((link) => (
                  <Link key={link.href} href={link.href}>
                    <span className="block text-sm text-muted-foreground hover:text-gold transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </nav>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-serif text-lg font-medium tracking-wide text-foreground mb-6">
                Services
              </h4>
              <nav className="space-y-3">
                {FOOTER_LINKS.slice(4).map((link) => (
                  <Link key={link.href} href={link.href}>
                    <span className="block text-sm text-muted-foreground hover:text-gold transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                ))}
                <Link href="/">
                  <span className="block text-sm text-muted-foreground hover:text-gold transition-colors cursor-pointer">
                    Home
                  </span>
                </Link>
              </nav>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="mt-16 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <span className="hover:text-gold transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gold transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
