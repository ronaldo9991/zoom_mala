import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { images, COMPANY, ADDRESS } from "@/lib/assets";
import { Gem, Shield, Eye, Scale, MapPin } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Authenticity",
    description: "Every piece is verified and certified to the highest international standards.",
  },
  {
    icon: Eye,
    title: "Discretion",
    description: "Private, confidential service for our distinguished clientele.",
  },
  {
    icon: Scale,
    title: "Precision",
    description: "Meticulous attention to detail in every transaction and assessment.",
  },
  {
    icon: Gem,
    title: "Transparency",
    description: "Clear, honest pricing and complete documentation for every deal.",
  },
];

const tradeCategories = [
  { title: "Gold Bullion & Jewelry", image: images.gold.bars },
  { title: "Certified Diamonds", image: images.diamonds.loose },
  { title: "Precious Gemstones", image: images.diamonds.emerald },
  { title: "Luxury Timepieces", image: images.watches.luxury1 },
];

export default function About() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const storyRef = useRef(null);
  const storyInView = useInView(storyRef, { once: true, margin: "-100px" });

  const tradeRef = useRef(null);
  const tradeInView = useInView(tradeRef, { once: true, margin: "-100px" });

  const valuesRef = useRef(null);
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" });

  const galleryRef = useRef(null);
  const galleryInView = useInView(galleryRef, { once: true, margin: "-100px" });

  return (
    <main className="min-h-screen pt-20" data-testid="page-about">
      <section ref={heroRef} className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={heroInView ? { scale: 1 } : { scale: 1.1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${images.about.heritage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </motion.div>

        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="text-gold text-sm tracking-[0.4em] uppercase mb-4">Our Heritage</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              About Our House
            </h1>
          </motion.div>
        </div>
      </section>

      <section ref={storyRef} className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={storyInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Our Story</p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-8">
            {COMPANY.name}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto mb-8">
            Nestled in the historic heart of Dubai's legendary Gold Souk, our house has built 
            a reputation for excellence in the trade of precious metals, certified diamonds, 
            and rare gemstones. We serve a distinguished global clientele who value authenticity, 
            discretion, and uncompromising quality.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
            Our expertise spans generations, combining traditional knowledge with modern 
            certification standards to deliver an experience that honors the heritage of 
            Dubai's gold trading legacy while meeting the demands of today's discerning buyers.
          </p>
        </motion.div>
      </section>

      <section ref={tradeRef} className="py-24 bg-card border-y border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={tradeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Specialization</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
              What We Trade
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tradeCategories.map((category, index) => (
              <motion.div
                key={category.title}
                className="group relative aspect-[3/4] overflow-hidden rounded-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={tradeInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-lg font-medium text-white text-center">
                    {category.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={valuesRef} className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={valuesInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Our Principles</p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
            Values We Live By
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                className="text-center p-6"
                initial={{ opacity: 0, y: 30 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-serif text-xl font-medium text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section ref={galleryRef} className="py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            images.about.craftsmanship,
            images.about.diamondSelection,
            images.about.expertise,
            images.about.precision,
          ].map((image, index) => (
            <motion.div
              key={index}
              className="aspect-square overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={galleryInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div
                className="w-full h-full bg-cover bg-center hover:scale-110 transition-transform duration-700"
                style={{ backgroundImage: `url(${image})` }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-card border-t border-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Visit Us</p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-8">
            Our Location
          </h2>
          <div className="inline-flex items-start gap-4 p-6 bg-muted/30 rounded-lg">
            <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="font-medium text-foreground">{ADDRESS.line1}</p>
              <p className="text-muted-foreground">{ADDRESS.line2}</p>
              <p className="text-muted-foreground">{ADDRESS.city}, {ADDRESS.country}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
