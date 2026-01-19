import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";
import { HeroSection } from "@/components/HeroSection";
import { images, ADDRESS } from "@/lib/assets";
import { Gem, Sparkles, Crown, Watch, MapPin, ArrowRight } from "lucide-react";

const expertiseItems = [
  {
    icon: Gem,
    title: "Fine Diamonds",
    description: "Expertly sourced, certified diamonds of exceptional clarity and brilliance.",
    image: images.diamonds.loose,
  },
  {
    icon: Sparkles,
    title: "Pure Gold",
    description: "Premium gold trading with transparent pricing and certified purity.",
    image: images.gold.bars,
  },
  {
    icon: Crown,
    title: "Precious Stones",
    description: "Rare emeralds, rubies, and sapphires from the world's finest sources.",
    image: images.diamonds.emerald,
  },
  {
    icon: Watch,
    title: "Luxury Watches",
    description: "Curated collection of prestigious timepieces and horological masterpieces.",
    image: images.watches.luxury1,
  },
];

const featuredCollections = [
  { title: "Diamond Necklaces", image: images.collections.diamondNecklace },
  { title: "Gold Bracelets", image: images.collections.goldBracelet },
  { title: "Pearl Earrings", image: images.collections.pearlEarrings },
  { title: "Emerald Rings", image: images.collections.emeraldRing },
  { title: "Sapphire Collection", image: images.collections.sapphireNecklace },
  { title: "Gold Chains", image: images.collections.goldChain },
];

function SectionDivider() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="flex items-center justify-center py-16">
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
        initial={{ width: 0 }}
        animate={isInView ? { width: "200px" } : { width: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </div>
  );
}

function ExpertiseSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Our Expertise</p>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
          Mastery in Precious Metals & Gems
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {expertiseItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              className="group relative overflow-hidden rounded-lg aspect-[4/3] cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              data-testid={`card-expertise-${index}`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 border-2 border-gold/30 rounded-lg" />

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gold/20 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl font-semibold text-white">
                    {item.title}
                  </h3>
                </div>
                <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-md">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function CraftsmanshipSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${images.hero.craftsmanship})` }}
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Craftsmanship</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-8">
            Where Tradition Meets Excellence
          </h2>
          <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
            Every piece that passes through our house carries the legacy of Dubai's Gold Souk — 
            a testament to generations of expertise, integrity, and an unwavering commitment 
            to quality that has earned the trust of clients worldwide.
          </p>

          <motion.div
            className="mt-12 inline-block"
            initial={{ width: 0 }}
            animate={isInView ? { width: "120px" } : { width: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          >
            <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturedCollectionsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        className="flex flex-col md:flex-row items-center justify-between mb-16 gap-4"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div>
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Featured</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
            Curated Collections
          </h2>
        </div>
        <Link href="/collections">
          <motion.div
            className="flex items-center gap-2 text-gold hover:text-gold/80 transition-colors cursor-pointer group"
            whileHover={{ x: 5 }}
          >
            <span className="text-sm tracking-wider uppercase">View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.div>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredCollections.map((item, index) => (
          <motion.div
            key={item.title}
            className="group relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            data-testid={`card-collection-${index}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${item.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-gold/30 rounded-lg" />

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="font-serif text-xl font-medium text-white group-hover:text-gold transition-colors">
                {item.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function LocationSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-card border-y border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Location</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-6">
              Heart of Dubai Gold Souk
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Visit our office in the legendary Gold Souk of Deira, Dubai — a destination 
              that has attracted traders and connoisseurs from around the world for generations.
            </p>

            <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
              <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">{ADDRESS.line1}</p>
                <p className="text-muted-foreground">{ADDRESS.line2}</p>
                <p className="text-muted-foreground">{ADDRESS.city}, {ADDRESS.country}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative aspect-[4/3] rounded-lg overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${images.contact.dubai})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen" data-testid="page-home">
      <HeroSection />
      <ExpertiseSection />
      <SectionDivider />
      <CraftsmanshipSection />
      <SectionDivider />
      <FeaturedCollectionsSection />
      <LocationSection />
    </main>
  );
}
