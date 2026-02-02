import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { images } from "@/lib/assets";
import { Watch, Settings, Award, Shield } from "lucide-react";

const features = [
  {
    icon: Watch,
    title: "Authentic Pieces",
    description: "Every timepiece verified for authenticity with complete documentation.",
  },
  {
    icon: Settings,
    title: "Swiss Precision",
    description: "Featuring world-renowned Swiss movements and craftsmanship.",
  },
  {
    icon: Award,
    title: "Collector's Grade",
    description: "Rare and limited edition pieces for discerning collectors.",
  },
  {
    icon: Shield,
    title: "Full Provenance",
    description: "Complete ownership history and authentication records.",
  },
];

const featuredWatches = [
  { title: "Featured Timepiece", image: images.watches.watch11 },
  { title: "New Arrival", image: images.watches.watch12 },
  { title: "Exclusive Piece", image: images.watches.watch13 },
];

const watchGallery = [
  { title: "Luxury Dress Watch", image: images.watches.watch1 },
  { title: "Classic Timepiece", image: images.watches.watch2 },
  { title: "Elegant Collection", image: images.watches.watch3 },
  { title: "Prestige Timepiece", image: images.watches.watch4 },
  { title: "Refined Design", image: images.watches.watch5 },
  { title: "Timeless Style", image: images.watches.watch6 },
  { title: "Collector's Choice", image: images.watches.watch7 },
  { title: "Swiss Craftsmanship", image: images.watches.watch8 },
  { title: "Statement Piece", image: images.watches.watch9 },
  { title: "Vintage Elegance", image: images.watches.watch10 },
];

export default function Watches() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const contentRef = useRef(null);
  const contentInView = useInView(contentRef, { once: true, margin: "-100px" });

  const galleryRef = useRef(null);
  const galleryInView = useInView(galleryRef, { once: true, margin: "-100px" });

  return (
    <main className="min-h-screen pt-20" data-testid="page-watches">
      <section ref={heroRef} className="relative h-[50vh] min-h-[350px] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={heroInView ? { scale: 1 } : { scale: 1.1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${images.watches.watch11})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </motion.div>

        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="text-gold text-sm tracking-[0.4em] uppercase mb-4">Horology</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Luxury Watches
            </h1>
          </motion.div>
        </div>
      </section>

      <section ref={contentRef} className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={contentInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Timeless Elegance</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-6">
              Prestigious Timepieces
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our curated collection of luxury watches represents the finest in horological 
              excellence. From iconic dress watches to rare collector's pieces, each timepiece 
              in our collection is authenticated and accompanied by complete documentation.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether you seek a statement piece for special occasions or a valuable addition 
              to your collection, our expertise ensures you acquire only the most exceptional 
              examples of watchmaking artistry.
            </p>
          </motion.div>

          <motion.div
            className="relative aspect-[4/3] rounded-lg overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            animate={contentInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${images.watches.watch2})` }}
            />
          </motion.div>
        </div>

        <div className="mb-24">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-2">New Arrivals</p>
            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
              Featured Timepieces
            </h3>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {featuredWatches.map((item, index) => (
              <motion.div
                key={index}
                className="group relative aspect-[4/5] overflow-hidden rounded-lg"
                initial={{ opacity: 0, y: 24 }}
                animate={contentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-medium">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="text-center p-6 bg-card rounded-lg border border-border/30"
                initial={{ opacity: 0, y: 30 }}
                animate={contentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-gold/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-serif text-lg font-medium text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section ref={galleryRef} className="py-24 bg-card border-y border-border/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={galleryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Gallery</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
              Horological Excellence
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {watchGallery.map((item, index) => (
              <motion.div
                key={index}
                className="group relative aspect-[3/4] overflow-hidden rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={galleryInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.06 }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs sm:text-sm font-medium">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
