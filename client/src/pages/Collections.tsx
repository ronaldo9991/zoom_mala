import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { images } from "@/lib/assets";

type Category = "all" | "gold" | "diamonds" | "pearls" | "watches";

const categories: { id: Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "gold", label: "Gold" },
  { id: "diamonds", label: "Diamonds" },
  { id: "pearls", label: "Pearls" },
  { id: "watches", label: "Watches" },
];

const collections = [
  { title: "22K Gold Necklace", category: "gold", image: images.collections.goldNecklace },
  { title: "Diamond Solitaire Ring", category: "diamonds", image: images.collections.diamondRing },
  { title: "South Sea Pearl Earrings", category: "pearls", image: images.collections.pearlEarrings },
  { title: "Gold Tennis Bracelet", category: "gold", image: images.collections.goldBracelet },
  { title: "Diamond Pendant Necklace", category: "diamonds", image: images.collections.diamondNecklace },
  { title: "Traditional Gold Earrings", category: "gold", image: images.collections.goldEarrings },
  { title: "Emerald Statement Ring", category: "diamonds", image: images.collections.emeraldRing },
  { title: "Sapphire Necklace Set", category: "diamonds", image: images.collections.sapphireNecklace },
  { title: "Ruby Drop Earrings", category: "diamonds", image: images.collections.rubyEarrings },
  { title: "Pure Gold Chain", category: "gold", image: images.collections.goldChain },
  { title: "Diamond Tennis Bracelet", category: "diamonds", image: images.collections.diamondBracelet },
  { title: "Freshwater Pearl Necklace", category: "pearls", image: images.collections.pearlNecklace },
  { title: "Luxury Gold Timepiece", category: "watches", image: images.watches.gold },
  { title: "Diamond Encrusted Watch", category: "watches", image: images.watches.diamond },
  { title: "Classic Dress Watch", category: "watches", image: images.watches.luxury1 },
  { title: "Vintage Collector Watch", category: "watches", image: images.watches.vintage },
];

export default function Collections() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-100px" });

  const filteredCollections = activeCategory === "all"
    ? collections
    : collections.filter((item) => item.category === activeCategory);

  return (
    <main className="min-h-screen pt-20" data-testid="page-collections">
      <section ref={heroRef} className="relative h-[50vh] min-h-[350px] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={heroInView ? { scale: 1 } : { scale: 1.1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${images.hero.diamondMacro})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </motion.div>

        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="text-gold text-sm tracking-[0.4em] uppercase mb-4">Our Collections</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Curated Excellence
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 text-sm tracking-wider uppercase transition-all duration-300 rounded-full border ${
                activeCategory === category.id
                  ? "bg-gold text-background border-gold"
                  : "bg-transparent text-foreground/70 border-border hover:border-gold/50 hover:text-foreground"
              }`}
              data-testid={`button-filter-${category.id}`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCollections.map((item, index) => (
              <motion.div
                key={item.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer"
                data-testid={`card-collection-${index}`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-gold/30 rounded-lg" />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-serif text-lg font-medium text-white group-hover:text-gold transition-colors">
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
