import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sun, Smartphone, Wallet, Settings, Shield, BarChart3,
  Zap, Home, ArrowRight, Star, Play, Check, ChevronRight,
  CloudSun, Bell, MessageCircle, Users, TreePine, BatteryCharging,
  Wrench, Phone, Mail, MapPin, Send, Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ceejayLogo from "@/assets/ceejay-logo.jpeg";
import ceejayFlier from "@/assets/ceejay-flier.jpeg";
import heroHome from "@/assets/hero-home-solar.jpg";
import appMockup from "@/assets/ceesol-app-mockup.png";
import solarPanelsImg from "@/assets/solar-panels-showcase.jpg";
import inverterImg from "@/assets/inverter-showcase.jpg";
import batteryImg from "@/assets/battery-showcase.jpg";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.jpg";
import testimonial3 from "@/assets/testimonial-3.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

const Landing = () => {
  const { toast } = useToast();
  const [activeScreen, setActiveScreen] = useState(0);
  const [contactForm, setContactForm] = useState({ full_name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const appScreens = [
    { title: "Live Energy Flow", desc: "Real-time sun → panels → home → grid visualization", icon: Zap },
    { title: "Savings Dashboard", desc: "Monthly bill comparison & lifetime savings counter", icon: Wallet },
    { title: "Smart Controls", desc: "Battery storage slider & grid export settings", icon: Settings },
    { title: "Maintenance Alerts", desc: "System health status & one-tap service requests", icon: Bell },
  ];

  const features = [
    {
      icon: Sun,
      title: "Smart Installation",
      desc: "Custom-designed systems with premium Tier-1 panels and 25-year performance guarantee",
    },
    {
      icon: Smartphone,
      title: "Ceesol Control",
      desc: "Real-time monitoring, AI-powered optimization, and instant alerts in one intuitive app",
    },
    {
      icon: Wallet,
      title: "Maximum Savings",
      desc: "Track production, consumption, and bill savings with predictive analytics",
    },
  ];

  const steps = [
    { num: "01", title: "Consult", desc: "Free home assessment and custom design" },
    { num: "02", title: "Install", desc: "Professional 1-2 day installation with Ceesol hardware" },
    { num: "03", title: "Connect", desc: "Download app and activate system instantly" },
    { num: "04", title: "Optimize", desc: "AI learns your patterns to maximize returns" },
  ];

  const testimonials = [
    {
      name: "The Adeyemi Family",
      location: "Lagos, Nigeria",
      quote: "CeeJay Solar transformed our home. The Ceesol app lets us track every watt — we've cut our energy bills by 70%!",
      rating: 5,
      img: testimonial1,
    },
    {
      name: "Mr. Chukwuma Obi",
      location: "Abuja, Nigeria",
      quote: "The installation was seamless and the app is incredible. I monitor my office solar from anywhere. Best investment I've made.",
      rating: 5,
      img: testimonial2,
    },
    {
      name: "Mrs. Funke Adesanya",
      location: "Ibadan, Nigeria",
      quote: "Managing solar across my 3 rental properties is effortless with Ceesol. The ROI alerts help me plan perfectly.",
      rating: 5,
      img: testimonial3,
    },
  ];

  const packages = [
    {
      name: "Starter",
      price: "₦1.2M",
      desc: "Essential monitoring",
      features: ["3.5kVA System", "4 Solar Panels", "Basic Ceesol Monitoring", "1-Year Warranty", "Email Support"],
      highlight: false,
    },
    {
      name: "Pro",
      price: "₦2.8M",
      desc: "Full Ceesol features + battery ready",
      features: ["5kVA System", "8 Solar Panels", "Full Ceesol Suite", "Battery Storage Ready", "5-Year Warranty", "Priority Support"],
      highlight: true,
    },
    {
      name: "Complete",
      price: "₦5.5M",
      desc: "Premium panels + storage + advanced AI",
      features: ["10kVA System", "16 Solar Panels", "Ceesol AI Optimization", "10kWh Battery Storage", "25-Year Panel Warranty", "24/7 Dedicated Support"],
      highlight: false,
    },
  ];

  const bulletPoints = [
    "Real-time production & consumption tracking",
    "AI bill prediction and usage optimization tips",
    "Carbon offset tracker (trees planted equivalent, CO₂ saved)",
    "Weather-based production forecasting",
    "24/7 instant support chat integration",
    "Multi-home support for property managers",
  ];

  return (
    <div className="min-h-screen bg-navy text-foreground overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 bg-navy/80 backdrop-blur-lg border-b border-cyan-electric/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <Link to="/" className="flex items-center gap-2">
            <img src={ceejayLogo} alt="CeeJay Solar" className="h-10 w-auto rounded-lg" />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-foreground/70">
            <a href="#features" className="hover:text-cyan-electric transition-colors">Features</a>
            <a href="#ceesol" className="hover:text-cyan-electric transition-colors">Ceesol App</a>
            <a href="#pricing" className="hover:text-cyan-electric transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-cyan-electric transition-colors">Reviews</a>
            <a href="#contact" className="hover:text-cyan-electric transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/calculator">
              <Button variant="ghost" size="sm" className="text-cyan-electric hover:bg-cyan-electric/10">
                Solar Calculator
              </Button>
            </Link>
            <a href="#cta">
              <Button size="sm" className="bg-cyan-electric text-navy hover:bg-cyan-electric/90 font-semibold">
                Get Free Quote
              </Button>
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-16 min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy opacity-90" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-electric/20 blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gold-solar/15 blur-[100px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-8">
              <div className="space-y-3">
                <motion.h2
                  className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {"CeeJay Solar".split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
                      className={char === " " ? "" : i < 6 ? "text-cyan-electric" : "text-gold-solar"}
                      style={{ display: "inline-block", minWidth: char === " " ? "0.3em" : undefined }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.h2>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                  className="h-[2px] max-w-xs bg-gradient-to-r from-cyan-electric via-gold-solar to-transparent"
                />
              </div>
              <Badge className="bg-cyan-electric/10 text-cyan-electric border-cyan-electric/20 text-sm px-4 py-1">
                🌞 Nigeria's #1 Smart Solar Provider
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Power Your Home.{" "}
                <span className="text-cyan-electric">Control Your Energy.</span>{" "}
                <span className="text-gold-solar">Save Your Future.</span>
              </h1>
              <p className="text-lg text-foreground/70 max-w-xl leading-relaxed">
                CeeJay Solar installs premium solar systems you control with{" "}
                <strong className="text-cyan-electric">Ceesol</strong> — the intelligent app that puts
                real-time energy management in your hands.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#cta">
                  <Button size="lg" className="bg-cyan-electric text-navy hover:bg-cyan-electric/90 font-bold text-base px-8 shadow-[0_0_30px_hsl(166_100%_70%/0.3)] hover:shadow-[0_0_50px_hsl(166_100%_70%/0.5)] transition-shadow">
                    Get Free Quote <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </a>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" variant="outline" className="border-foreground/20 text-foreground hover:bg-foreground/5 text-base">
                      <Play className="mr-2 w-5 h-5 text-gold-solar" /> Watch Ceesol Demo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl bg-navy border-cyan-electric/20 p-2">
                    <div className="aspect-video bg-navy-light rounded-lg flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <Play className="w-16 h-16 text-cyan-electric mx-auto" />
                        <p className="text-foreground/60">Ceesol App Demo Video</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex items-center gap-6 text-sm text-foreground/50">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-gold-solar fill-gold-solar" /> 4.8★ App Rating</span>
                <span>500+ Installations</span>
                <span>25yr Warranty</span>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img src={heroHome} alt="Modern home with solar panels" className="w-full object-cover rounded-2xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute -bottom-8 -left-8 w-48"
              >
                <img src={appMockup} alt="Ceesol app dashboard" className="w-full drop-shadow-2xl" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-navy relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <Badge className="bg-gold-solar/10 text-gold-solar border-gold-solar/20 mb-4">Why CeeJay Solar</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">Everything You Need for <span className="text-cyan-electric">Solar Freedom</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <Card className="bg-navy-light/50 border-cyan-electric/10 hover:border-cyan-electric/30 transition-all group h-full">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-electric/10 flex items-center justify-center mx-auto group-hover:bg-cyan-electric/20 transition-colors">
                      <f.icon className="w-8 h-8 text-cyan-electric" />
                    </div>
                    <h3 className="text-xl font-bold">{f.title}</h3>
                    <p className="text-foreground/60 leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPMENT SHOWCASE */}
      <section className="py-24 bg-gradient-to-b from-navy to-navy-light/80 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-electric rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-solar rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <Badge className="bg-cyan-electric/10 text-cyan-electric border-cyan-electric/20 mb-4">Premium Equipment</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">Built With <span className="text-gold-solar">The Best</span></h2>
            <p className="text-foreground/50 mt-4 max-w-2xl mx-auto">We use only Tier-1 certified equipment for maximum efficiency, durability, and long-term savings.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                img: solarPanelsImg,
                title: "Solar Panels",
                subtitle: "Monocrystalline Tier-1",
                specs: ["545W per panel", "20–22% efficiency", "25-year warranty", "Anti-reflective coating"],
                icon: Sun,
              },
              {
                img: inverterImg,
                title: "Hybrid Inverters",
                subtitle: "Smart Grid-Tie Ready",
                specs: ["3.5–10kVA capacity", "MPPT charge controller", "WiFi monitoring built-in", "Surge protection"],
                icon: Zap,
              },
              {
                img: batteryImg,
                title: "Battery Storage",
                subtitle: "LiFePO4 Lithium",
                specs: ["5–20kWh capacity", "6000+ cycle life", "80% depth of discharge", "10-year warranty"],
                icon: BatteryCharging,
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="group"
              >
                <Card className="bg-navy-light/40 border-cyan-electric/10 hover:border-cyan-electric/30 transition-all overflow-hidden h-full">
                  <div className="relative overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-cyan-electric/20 backdrop-blur-sm flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-cyan-electric" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{item.title}</h3>
                        <p className="text-xs text-cyan-electric">{item.subtitle}</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-3">
                    {item.specs.map((spec) => (
                      <div key={spec} className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-cyan-electric shrink-0" />
                        <span className="text-sm text-foreground/70">{spec}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CEESOL APP SHOWCASE */}
      <section id="ceesol" className="py-24 bg-gradient-to-b from-navy to-navy-light relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <Badge className="bg-cyan-electric/10 text-cyan-electric border-cyan-electric/20 mb-4">Ceesol App</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">Your Solar <span className="text-gold-solar">Command Center</span></h2>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-6">
              {/* Screen tabs */}
              <div className="grid grid-cols-2 gap-3">
                {appScreens.map((s, i) => (
                  <button
                    key={s.title}
                    onClick={() => setActiveScreen(i)}
                    className={`p-4 rounded-xl text-left transition-all border ${
                      activeScreen === i
                        ? "bg-cyan-electric/10 border-cyan-electric/40 shadow-[0_0_20px_hsl(166_100%_70%/0.1)]"
                        : "bg-navy-light/30 border-transparent hover:border-cyan-electric/20"
                    }`}
                  >
                    <s.icon className={`w-5 h-5 mb-2 ${activeScreen === i ? "text-cyan-electric" : "text-foreground/40"}`} />
                    <h4 className="font-semibold text-sm">{s.title}</h4>
                    <p className="text-xs text-foreground/50 mt-1">{s.desc}</p>
                  </button>
                ))}
              </div>
              {/* Bullet points */}
              <div className="space-y-3 pt-4">
                {bulletPoints.map((bp) => (
                  <div key={bp} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-cyan-electric mt-0.5 shrink-0" />
                    <span className="text-foreground/70 text-sm">{bp}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-8 rounded-full bg-cyan-electric/5 blur-3xl" />
                <img src={appMockup} alt="Ceesol app screens" className="w-64 sm:w-72 relative z-10 drop-shadow-2xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CEESOL VIDEO DEMO */}
      <section className="py-24 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gold-solar rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <Badge className="bg-gold-solar/10 text-gold-solar border-gold-solar/20 mb-4">App Demo</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">See Ceesol <span className="text-cyan-electric">In Action</span></h2>
            <p className="text-foreground/50 mt-4 max-w-2xl mx-auto">Watch how the Ceesol app gives you full control over your solar system — from real-time monitoring to smart energy optimization.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden border border-cyan-electric/20 shadow-[0_0_60px_hsl(166_100%_70%/0.1)]">
              <div className="aspect-video bg-background/50">
                <video
                  src="/videos/ceesol-demo.mov"
                  title="Ceesol App Demo - How It Works"
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full rounded-2xl"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-6 mt-10">
              {[
                { icon: Smartphone, title: "Monitor Anywhere", desc: "Track your solar production and consumption in real-time from your phone" },
                { icon: BarChart3, title: "Smart Analytics", desc: "AI-powered insights show you exactly how much you're saving every day" },
                { icon: Shield, title: "System Health", desc: "Get instant alerts and schedule maintenance with one tap" },
              ].map((item, i) => (
                <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp} className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-electric/10 flex items-center justify-center mx-auto">
                    <item.icon className="w-6 h-6 text-cyan-electric" />
                  </div>
                  <h4 className="font-bold">{item.title}</h4>
                  <p className="text-sm text-foreground/50">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-navy relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <Badge className="bg-gold-solar/10 text-gold-solar border-gold-solar/20 mb-4">Simple Process</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">How It <span className="text-cyan-electric">Works</span></h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.num} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp} className="relative">
                <div className="text-center space-y-4">
                  <div className="text-5xl font-black text-cyan-electric/20">{s.num}</div>
                  <h3 className="text-xl font-bold text-cyan-electric">{s.title}</h3>
                  <p className="text-foreground/60 text-sm">{s.desc}</p>
                </div>
                {i < 3 && (
                  <ChevronRight className="hidden lg:block absolute top-8 -right-4 w-8 h-8 text-cyan-electric/20" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-navy to-navy-light">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <Badge className="bg-cyan-electric/10 text-cyan-electric border-cyan-electric/20 mb-4">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">Trusted by <span className="text-gold-solar">500+ Families</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <Card className="bg-navy-light/50 border-cyan-electric/10 h-full">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex gap-1">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-gold-solar fill-gold-solar" />
                      ))}
                    </div>
                    <p className="text-foreground/70 text-sm italic leading-relaxed">"{t.quote}"</p>
                    <div className="flex items-center gap-3 pt-2">
                      <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-foreground/50">{t.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-10">
            <Badge variant="outline" className="border-foreground/20 text-foreground/60 px-4 py-2">
              <Star className="w-4 h-4 text-gold-solar fill-gold-solar mr-1" /> 4.8 on App Store
            </Badge>
            <Badge variant="outline" className="border-foreground/20 text-foreground/60 px-4 py-2">
              <Star className="w-4 h-4 text-gold-solar fill-gold-solar mr-1" /> 4.8 on Google Play
            </Badge>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 bg-navy">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <Badge className="bg-gold-solar/10 text-gold-solar border-gold-solar/20 mb-4">Packages</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">Choose Your <span className="text-cyan-electric">Solar Package</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg, i) => (
              <motion.div key={pkg.name} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <Card className={`h-full relative ${
                  pkg.highlight
                    ? "bg-gradient-to-b from-cyan-electric/10 to-navy-light border-cyan-electric/40 shadow-[0_0_40px_hsl(166_100%_70%/0.15)]"
                    : "bg-navy-light/50 border-cyan-electric/10"
                }`}>
                  {pkg.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-cyan-electric text-navy font-bold">Most Popular</Badge>
                    </div>
                  )}
                  <CardContent className="p-8 space-y-6">
                    <div className="text-center">
                      <h3 className="text-xl font-bold">{pkg.name}</h3>
                      <p className="text-foreground/50 text-sm mt-1">{pkg.desc}</p>
                      <div className="mt-4">
                        <span className="text-3xl font-black text-cyan-electric">{pkg.price}</span>
                        <span className="text-foreground/40 text-sm"> starting</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {pkg.features.map((f) => (
                        <div key={f} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-cyan-electric shrink-0" />
                          <span className="text-foreground/70">{f}</span>
                        </div>
                      ))}
                    </div>
                    <Badge className="w-full justify-center bg-gold-solar/10 text-gold-solar border-gold-solar/20 py-1">
                      Includes Ceesol App
                    </Badge>
                    <a href="#cta" className="block">
                      <Button className={`w-full ${
                        pkg.highlight
                          ? "bg-cyan-electric text-navy hover:bg-cyan-electric/90 font-bold"
                          : "bg-navy border border-cyan-electric/30 text-cyan-electric hover:bg-cyan-electric/10"
                      }`}>
                        Get Started <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="contact" className="py-24 bg-gradient-to-b from-navy to-navy-light relative">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <Badge className="bg-cyan-electric/10 text-cyan-electric border-cyan-electric/20 mb-4">Get In Touch</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">Send Us a <span className="text-gold-solar">Message</span></h2>
            <p className="text-foreground/50 mt-4 max-w-xl mx-auto">Have questions about solar? Fill out the form and our engineer will get back to you shortly.</p>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.form
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              onSubmit={async (e) => {
                e.preventDefault();
                if (!contactForm.full_name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
                  toast({ title: "Please fill in all required fields", variant: "destructive" });
                  return;
                }
                setSubmitting(true);
                const formData = {
                  full_name: contactForm.full_name.trim(),
                  email: contactForm.email.trim(),
                  phone: contactForm.phone.trim() || null,
                  message: contactForm.message.trim(),
                };
                // Save to database
                const { error } = await supabase.from("contact_inquiries").insert(formData);
                // Send to Formspree so it emails asaoluemmanuel2k@gmail.com
                try {
                  await fetch("https://formspree.io/f/xbdzdvaj", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: formData.full_name, email: formData.email, phone: formData.phone, message: formData.message }),
                  });
                } catch (e) {
                  console.error("Formspree error:", e);
                }
                setSubmitting(false);
                if (error) {
                  toast({ title: "Something went wrong. Please try again.", variant: "destructive" });
                } else {
                  toast({ title: "✅ Message sent! Our engineer will contact you shortly." });
                  setContactForm({ full_name: "", email: "", phone: "", message: "" });
                }
              }}
              className="space-y-5"
            >
              <div>
                <Input
                  placeholder="Full Name *"
                  value={contactForm.full_name}
                  onChange={(e) => setContactForm((p) => ({ ...p, full_name: e.target.value }))}
                  className="bg-navy-light/50 border-cyan-electric/20 focus:border-cyan-electric placeholder:text-foreground/30 h-12"
                  maxLength={100}
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  type="email"
                  placeholder="Email Address *"
                  value={contactForm.email}
                  onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                  className="bg-navy-light/50 border-cyan-electric/20 focus:border-cyan-electric placeholder:text-foreground/30 h-12"
                  maxLength={255}
                  required
                />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm((p) => ({ ...p, phone: e.target.value }))}
                  className="bg-navy-light/50 border-cyan-electric/20 focus:border-cyan-electric placeholder:text-foreground/30 h-12"
                  maxLength={20}
                />
              </div>
              <Textarea
                placeholder="Your Message *"
                value={contactForm.message}
                onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                className="bg-navy-light/50 border-cyan-electric/20 focus:border-cyan-electric placeholder:text-foreground/30 min-h-[120px]"
                maxLength={1000}
                required
              />
              <Button
                type="submit"
                disabled={submitting}
                size="lg"
                className="w-full bg-cyan-electric text-navy hover:bg-cyan-electric/90 font-bold text-base shadow-[0_0_30px_hsl(166_100%_70%/0.2)] hover:shadow-[0_0_50px_hsl(166_100%_70%/0.4)] transition-shadow"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </motion.form>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp} className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Contact Information</h3>
                <div className="space-y-4">
                  <a href="tel:+2349050471379" className="flex items-center gap-4 text-foreground/70 hover:text-cyan-electric transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-cyan-electric/10 flex items-center justify-center shrink-0"><Phone className="w-5 h-5 text-cyan-electric" /></div>
                    <div><p className="text-sm text-foreground/40">Phone</p><p className="font-medium">+234 905 047 1379</p></div>
                  </a>
                  <a href="mailto:asaoluemmanuel2k@gmail.com" className="flex items-center gap-4 text-foreground/70 hover:text-cyan-electric transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-cyan-electric/10 flex items-center justify-center shrink-0"><Mail className="w-5 h-5 text-cyan-electric" /></div>
                    <div><p className="text-sm text-foreground/40">Email</p><p className="font-medium">asaoluemmanuel2k@gmail.com</p></div>
                  </a>
                  <a href="https://wa.me/2349166354417" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-foreground/70 hover:text-cyan-electric transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-cyan-electric/10 flex items-center justify-center shrink-0"><MessageCircle className="w-5 h-5 text-cyan-electric" /></div>
                    <div><p className="text-sm text-foreground/40">WhatsApp</p><p className="font-medium">Chat with us</p></div>
                  </a>
                  <a href="https://www.tiktok.com/@ceejay_solar" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-foreground/70 hover:text-cyan-electric transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-cyan-electric/10 flex items-center justify-center shrink-0"><Play className="w-5 h-5 text-cyan-electric" /></div>
                    <div><p className="text-sm text-foreground/40">TikTok</p><p className="font-medium">@ceejay_solar</p></div>
                  </a>
                  <div className="flex items-center gap-4 text-foreground/70">
                    <div className="w-12 h-12 rounded-xl bg-cyan-electric/10 flex items-center justify-center shrink-0"><MapPin className="w-5 h-5 text-cyan-electric" /></div>
                    <div><p className="text-sm text-foreground/40">Location</p><p className="font-medium">6 Ahmed Tijani Street, Ahmaddiya, Lagos State</p></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVICES FLIER */}
      <section className="py-24 bg-navy relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-6">
              <Badge className="bg-gold-solar/10 text-gold-solar border-gold-solar/20 mb-4">Our Services</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold">
                One-Stop Solution for All Your <span className="text-cyan-electric">Solar Power</span> Needs
              </h2>
              <div className="space-y-4 text-foreground/70">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-electric mt-0.5 shrink-0" />
                  <span>End-to-end solar panel installation</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-electric mt-0.5 shrink-0" />
                  <span>Solar system maintenance and repair</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-electric mt-0.5 shrink-0" />
                  <span>Solar energy consultation and planning</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-electric mt-0.5 shrink-0" />
                  <span>Free planning & consultation</span>
                </div>
              </div>
              <div className="bg-navy-light/50 border border-gold-solar/20 rounded-xl p-5">
                <p className="text-foreground/60 text-sm leading-relaxed">
                  <strong className="text-gold-solar">Why Choose Us?</strong> CEEJAY SOLAR specializes in delivering top-notch solar installation and comprehensive energy solutions tailored to illuminate your path to sustainable living.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-gold-solar/20 text-gold-solar border-gold-solar/30 text-sm px-4 py-2">
                  ⭐ Best Price & Services
                </Badge>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-cyan-electric/20 to-gold-solar/10 rounded-2xl blur-xl" />
                <img
                  src={ceejayFlier}
                  alt="CeeJay Solar Services Flier"
                  className="relative rounded-2xl shadow-2xl border border-cyan-electric/10 max-w-sm w-full"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="cta" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-light via-navy to-navy-light" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-electric/10 blur-[150px]" />
        </div>
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center space-y-8">
            <h2 className="text-3xl sm:text-5xl font-black">
              Ready to <span className="text-gold-solar">Own</span> Your Energy?
            </h2>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
              Join 500+ Nigerian homes already saving with CeeJay Solar and the Ceesol app. Get a free assessment today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/calculator">
                <Button size="lg" className="bg-cyan-electric text-navy hover:bg-cyan-electric/90 font-bold text-lg px-10 shadow-[0_0_40px_hsl(166_100%_70%/0.3)] hover:shadow-[0_0_60px_hsl(166_100%_70%/0.5)] transition-shadow">
                  Schedule Free Assessment <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-gold-solar/30 text-gold-solar hover:bg-gold-solar/10 font-bold text-lg px-10">
                Download Ceesol
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-foreground/40 pt-4">
              <a href="tel:+2349050471379" className="flex items-center gap-2 hover:text-cyan-electric transition-colors"><Phone className="w-4 h-4" /> +234 905 047 1379</a>
              <a href="mailto:asaoluemmanuel2k@gmail.com" className="flex items-center gap-2 hover:text-cyan-electric transition-colors"><Mail className="w-4 h-4" /> asaoluemmanuel2k@gmail.com</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-navy border-t border-cyan-electric/10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src={ceejayLogo} alt="CeeJay Solar" className="h-12 w-auto rounded-lg" />
              </div>
              <p className="text-foreground/50 text-sm">Premium solar installations powered by the Ceesol intelligent energy platform.</p>
              <p className="text-foreground/40 text-xs">Let the Sun Work for You</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-foreground/50">
                <li><a href="#features" className="hover:text-cyan-electric transition-colors">About Us</a></li>
                <li><a href="#testimonials" className="hover:text-cyan-electric transition-colors">Reviews</a></li>
                <li><a href="#pricing" className="hover:text-cyan-electric transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-foreground/50">
                <li><a href="#ceesol" className="hover:text-cyan-electric transition-colors">Ceesol App</a></li>
                <li><Link to="/calculator" className="hover:text-cyan-electric transition-colors">Solar Calculator</Link></li>
                <li><a href="#cta" className="hover:text-cyan-electric transition-colors">Get Quote</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Contact</h4>
              <ul className="space-y-2 text-sm text-foreground/50">
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 6 Ahmed Tijani Street, Ahmaddiya, Lagos</li>
                <li><a href="tel:+2349050471379" className="flex items-center gap-2 hover:text-cyan-electric transition-colors"><Phone className="w-4 h-4" /> +234 905 047 1379</a></li>
                <li><a href="mailto:asaoluemmanuel2k@gmail.com" className="flex items-center gap-2 hover:text-cyan-electric transition-colors"><Mail className="w-4 h-4" /> asaoluemmanuel2k@gmail.com</a></li>
                <li><a href="https://wa.me/2349166354417" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-cyan-electric transition-colors"><MessageCircle className="w-4 h-4" /> WhatsApp</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-cyan-electric/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-foreground/40">
            <p>© 2026 CeeJay Solar. All rights reserved.</p>
            <p>Engineer: Engr Asaolu Emmanuel | Powered by CeeSol</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
