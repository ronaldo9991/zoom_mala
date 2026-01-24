import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { images, COMPANY, TRUST_CHIPS } from "@/lib/assets";
import { useTheme } from "./ThemeProvider";
import { ChevronDown, Shield, Award, Globe, Gem } from "lucide-react";

const trustIcons = [Shield, Award, Globe, Gem];

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      pulse: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.pulse += 0.02;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        const pulseOpacity = particle.opacity * (0.5 + Math.sin(particle.pulse) * 0.5);

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 162, 74, ${pulseOpacity})`;
        ctx.fill();

        const glow = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 4
        );
        glow.addColorStop(0, `rgba(200, 162, 74, ${pulseOpacity * 0.3})`);
        glow.addColorStop(1, "rgba(200, 162, 74, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10 pointer-events-none opacity-60"
    />
  );
}

function GoldLightSweep() {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute -inset-full h-[200%] w-[200%]"
        style={{
          background: "linear-gradient(90deg, transparent 0%, transparent 40%, rgba(200,162,74,0.08) 50%, transparent 60%, transparent 100%)",
        }}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 2,
        }}
      />
    </div>
  );
}

function DiamondSparkle({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-white rounded-full"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        boxShadow: "0 0 10px 2px rgba(255,255,255,0.8), 0 0 20px 4px rgba(200,162,74,0.4)",
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 4 + 2,
      }}
    />
  );
}

export function HeroSection() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      mouseX.set(x * 20);
      mouseY.set(y * 20);
    }
  };

  const heroImage = theme === "dark" ? images.hero.dark : images.hero.light;

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
      onMouseMove={handleMouseMove}
      data-testid="section-hero"
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: springY, scale: springScale }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.8) 100%)",
          }}
        />
      </motion.div>

      <ParticleField />
      <GoldLightSweep />

      {[...Array(8)].map((_, i) => (
        <DiamondSparkle key={i} delay={i * 0.8} />
      ))}

      <div
        className="absolute inset-0 z-5 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        className="relative z-20 h-full flex flex-col items-center justify-center px-4 text-center"
        style={{ y: textY, opacity }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-8"
        >
          <motion.div
            className="inline-block mb-6"
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          >
            <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          </motion.div>

          <motion.p
            className="text-gold/90 text-sm md:text-base tracking-[0.4em] uppercase font-light mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Established in Dubai Gold Souk
          </motion.p>

          <motion.h1
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white leading-[1.1] max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
          >
            <span className="block">Dubai's Trusted</span>
            <span className="block mt-2 md:mt-4">
              House of{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent animate-gold-sweep bg-[length:200%_100%]">
                  Gold
                </span>
              </span>
              {" & "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-white via-gold-light to-white bg-clip-text text-transparent">
                  Diamonds
                </span>
              </span>
            </span>
          </motion.h1>

          <motion.div
            className="mt-8 inline-block"
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
          >
            <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          </motion.div>
        </motion.div>

        <motion.p
          className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {COMPANY.description}
        </motion.p>

        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-3 md:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          {TRUST_CHIPS.map((chip, index) => {
            const Icon = trustIcons[index];
            return (
              <motion.div
                key={chip}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/90 text-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 + index * 0.1, duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(200, 162, 74, 0.1)",
                  borderColor: "rgba(200, 162, 74, 0.3)",
                }}
              >
                <Icon className="w-4 h-4 text-gold" />
                <span>{chip}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-white/50 cursor-pointer group"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => {
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
          }}
        >
          <span className="text-xs tracking-widest uppercase group-hover:text-gold transition-colors">
            Discover
          </span>
          <ChevronDown className="w-5 h-5 group-hover:text-gold transition-colors" />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-15" />
    </section>
  );
}
