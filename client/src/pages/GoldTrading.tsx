import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { images } from "@/lib/assets";
import { TrendingUp, Shield, Scale, Award } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Live Market Prices",
    description: "Real-time pricing aligned with international gold markets.",
  },
  {
    icon: Shield,
    title: "Certified Purity",
    description: "Every piece certified and hallmarked to international standards.",
  },
  {
    icon: Scale,
    title: "Transparent Weights",
    description: "Precision weighing with full documentation provided.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Only the finest quality gold from trusted sources worldwide.",
  },
];

const featuredGold = [
  { title: "Premium Bullion", image: images.gold.gold3 },
  { title: "Fine Craftsmanship", image: images.gold.gold4 },
  { title: "Certified Quality", image: images.gold.gold5 },
];

const goldGallery = [
  images.gold.gold1,
  images.gold.gold2,
  images.gold.gold3,
  images.gold.gold4,
  images.gold.gold5,
  images.gold.gold6,
  images.gold.gold7,
  images.gold.gold8,
  images.gold.gold9,
  images.gold.gold10,
];

export default function GoldTrading() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const contentRef = useRef(null);
  const contentInView = useInView(contentRef, { once: true, margin: "-100px" });

  const galleryRef = useRef(null);
  const galleryInView = useInView(galleryRef, { once: true, margin: "-100px" });

  return (
    <main className="min-h-screen pt-nav" data-testid="page-gold-trading">
      <section ref={heroRef} className="relative h-[45vh] min-h-[280px] sm:min-h-[320px] md:h-[50vh] md:min-h-[350px] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={heroInView ? { scale: 1 } : { scale: 1.1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${images.gold.gold1})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </motion.div>

        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="text-gold text-sm tracking-[0.4em] uppercase mb-4">Premium Trading</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Gold Trading
            </h1>
          </motion.div>
        </div>
      </section>

      <section ref={contentRef} className="py-12 sm:py-24 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center mb-12 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={contentInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Excellence in Gold</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-6">
              Dubai's Premier Gold Trading House
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              With decades of experience in the heart of Dubai's Gold Souk, we offer unparalleled 
              expertise in gold trading. Whether you're looking to invest in gold bullion, trade 
              jewelry, or acquire premium gold pieces, our team provides transparent, competitive 
              pricing backed by international certifications.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our commitment to purity, authenticity, and customer satisfaction has made us a 
              trusted name among collectors, investors, and connoisseurs worldwide.
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
              style={{ backgroundImage: `url(${images.gold.gold2})` }}
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
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-2">Our Gold</p>
            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
              Pure Gold Excellence
            </h3>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {featuredGold.map((item, index) => (
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

      <section ref={galleryRef} className="py-12 sm:py-24 bg-card border-y border-border/30">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={galleryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Gallery</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
              Pure Gold Excellence
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {goldGallery.map((image, index) => (
              <motion.div
                key={index}
                className="group relative aspect-[3/4] overflow-hidden rounded-lg"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={galleryInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
