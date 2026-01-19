import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { images } from "@/lib/assets";
import { Gem, Sparkles, Award, Eye } from "lucide-react";

const features = [
  {
    icon: Gem,
    title: "GIA Certified",
    description: "All diamonds accompanied by GIA certification for quality assurance.",
  },
  {
    icon: Sparkles,
    title: "Exceptional Clarity",
    description: "Hand-selected stones of exceptional clarity and brilliance.",
  },
  {
    icon: Award,
    title: "Rare Gemstones",
    description: "Access to rare emeralds, rubies, and sapphires from premier sources.",
  },
  {
    icon: Eye,
    title: "Expert Grading",
    description: "Professional gemological assessment for every piece.",
  },
];

const stoneGallery = [
  { title: "Brilliant Cut Diamonds", image: images.diamonds.loose },
  { title: "Princess Cut Collection", image: images.diamonds.cut },
  { title: "Diamond Close-up", image: images.diamonds.macro },
  { title: "Premium Selection", image: images.diamonds.collection },
  { title: "Colombian Emeralds", image: images.diamonds.emerald },
  { title: "Burmese Rubies", image: images.diamonds.ruby },
  { title: "Ceylon Sapphires", image: images.diamonds.sapphire },
  { title: "Diamond Brilliance", image: images.diamonds.brilliance },
];

export default function DiamondsStones() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const contentRef = useRef(null);
  const contentInView = useInView(contentRef, { once: true, margin: "-100px" });

  const galleryRef = useRef(null);
  const galleryInView = useInView(galleryRef, { once: true, margin: "-100px" });

  return (
    <main className="min-h-screen pt-20" data-testid="page-diamonds-stones">
      <section ref={heroRef} className="relative h-[50vh] min-h-[350px] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={heroInView ? { scale: 1 } : { scale: 1.1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${images.diamonds.loose})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </motion.div>

        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="text-gold text-sm tracking-[0.4em] uppercase mb-4">Precious Gems</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Diamonds & Stones
            </h1>
          </motion.div>
        </div>
      </section>

      <section ref={contentRef} className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            className="relative aspect-[4/3] rounded-lg overflow-hidden order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={contentInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${images.diamonds.macro})` }}
            />
          </motion.div>

          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            animate={contentInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Timeless Beauty</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-6">
              Certified Diamonds & Precious Gemstones
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our collection features only the finest certified diamonds and rare gemstones, 
              sourced from the world's most prestigious origins. Each stone is meticulously 
              selected for its exceptional quality, color, and brilliance.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From flawless diamonds to vibrant Colombian emeralds, Burmese rubies, and 
              Ceylon sapphires, we offer access to extraordinary gems that represent the 
              pinnacle of natural beauty and value.
            </p>
          </motion.div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={galleryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Gallery</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
              Exceptional Gemstones
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stoneGallery.map((item, index) => (
              <motion.div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={galleryInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.08 }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-medium">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
