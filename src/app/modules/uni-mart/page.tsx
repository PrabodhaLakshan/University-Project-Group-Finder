
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Oxanium, Inter, Poppins } from "next/font/google";
import Footer from "@/components/footer";
import { getAllProducts } from "./services/product.service";
import { Product } from "./types";
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  CreditCard,
  Headphones,
  Laptop,
  LayoutGrid,
  MessageCircle,
  Package,
  Phone,
  Plus,
  Receipt,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  User,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const CATEGORY_PRIORITY = [
  "Electronics",
  "Notes & Study Materials",
  "Laptops & Accessories",
  "Phones & Tablets",
];

type CategoryIcon = typeof Laptop;

const CATEGORY_ICONS: Record<string, CategoryIcon> = {
  Electronics: LayoutGrid,
  "Notes & Study Materials": BookOpen,
  "Laptops & Accessories": Laptop,
  "Phones & Tablets": Phone,
};

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "from", "your", "this", "that", "new", "used", "sale", "item",
]);

function formatPrice(value: number) {
  return `Rs. ${value.toLocaleString()}`;
}

function normalizeCategory(category?: string) {
  if (!category) return "Other";
  const value = category.trim().toLowerCase();

  if (value.includes("note") || value.includes("study")) {
    return "Notes & Study Materials";
  }
  if (value.includes("laptop") || value.includes("accessor")) {
    return "Laptops & Accessories";
  }
  if (value.includes("phone") || value.includes("tablet")) {
    return "Phones & Tablets";
  }
  if (value.includes("electronic")) {
    return "Electronics";
  }

  return category;
}

// Data for the rotating Hero Showcase Cards
const SHOWCASE_ITEMS = [
  { id: 1, title: "MacBook Air M1", price: "Rs. 185,000", badge: "BRAND NEW", icon: Laptop, color: "text-sky-600", bg: "bg-sky-100", badgeColor: "bg-sky-100 text-sky-700" },
  { id: 2, title: "Engineering Math Vol 2", price: "Rs. 2,500", badge: "USED", icon: BookOpen, color: "text-amber-500", bg: "bg-amber-100", badgeColor: "bg-amber-100 text-amber-700" },
  { id: 3, title: "Sony WH-1000XM4", price: "Rs. 65,000", badge: "LIKE NEW", icon: Headphones, color: "text-fuchsia-500", bg: "bg-fuchsia-100", badgeColor: "bg-fuchsia-100 text-fuchsia-700" },
  { id: 4, title: "iPhone 13 Pro", price: "Rs. 210,000", badge: "MINT", icon: Phone, color: "text-emerald-500", bg: "bg-emerald-100", badgeColor: "bg-emerald-100 text-emerald-700" },
  { id: 5, title: "Scientific Calculator", price: "Rs. 6,500", badge: "USED", icon: LayoutGrid, color: "text-indigo-500", bg: "bg-indigo-100", badgeColor: "bg-indigo-100 text-indigo-700" },
];

export default function UniMartHome() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // States for animations
  const [currentShowcaseIndex, setCurrentShowcaseIndex] = useState(0);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  useEffect(() => {
    const showcaseInterval = setInterval(() => {
      setCurrentShowcaseIndex((prev) => (prev + 1) % SHOWCASE_ITEMS.length);
    }, 3000);

    const workflowInterval = setInterval(() => {
      setActiveWorkflowStep((prev) => (prev + 1) % 3);
    }, 2500);

    return () => {
      clearInterval(showcaseInterval);
      clearInterval(workflowInterval);
    };
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const result = await getAllProducts({ limit: "all" });
        const normalized = result.items.map((item) => ({
          ...item,
          category: normalizeCategory(item.category),
        }));
        setProducts(normalized);
      } catch (error) {
        console.error("Failed to load Uni-Mart home data", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const availableProducts = useMemo(
    () => products.filter((item) => item.status === "AVAILABLE"),
    [products]
  );

  const recentProducts = useMemo(
    () =>
      [...products]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 8),
    [products]
  );

  const trendingTerms = useMemo(() => {
    const words = products
      .flatMap((item) => item.title.toLowerCase().split(/[^a-z0-9]+/))
      .filter((word) => word.length > 2 && !STOP_WORDS.has(word));

    const frequencies = words.reduce<Record<string, number>>((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    const fromTitles = Object.entries(frequencies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));

    if (fromTitles.length > 0) {
      return fromTitles;
    }

    return ["Laptop", "Calculator", "Textbook", "Headset", "iPad", "Chair"];
  }, [products]);

  const categoryData = useMemo(() => {
    return CATEGORY_PRIORITY.map((category) => {
      const items = availableProducts
        .filter((item) => normalizeCategory(item.category) === category)
        .slice(0, 4);
      return { category, items };
    });
  }, [availableProducts]);

  const activeSellers = useMemo(() => {
    const ids = new Set(availableProducts.map((item) => item.sellerId));
    return ids.size;
  }, [availableProducts]);

   const averagePrice = useMemo(() => {
    if (availableProducts.length === 0) return 0;
    // Number() දමා price එක අනිවාර්යයෙන්ම ඉලක්කමක් බවට හරවන්න
    const total = availableProducts.reduce((acc, item) => acc + Number(item.price), 0);    return Math.round(total / availableProducts.length);
  }, [availableProducts]);

  const listedCategories = useMemo(() => {
    const names = new Set(products.map((item) => normalizeCategory(item.category)));
    return names.size;
  }, [products]);

  // Update Action Cards: Removed 2 items, added unique border & bg colors for each
  const actionCards = [
    { title: "Browse Products", subtitle: "Explore trending student listings", icon: Package, href: "/modules/uni-mart/products", borderColor: "border-blue-400", iconBg: "bg-blue-500" },
    { title: "Post an Item", subtitle: "Start selling your items in minutes", icon: Plus, href: "/modules/uni-mart/new", borderColor: "border-emerald-400", iconBg: "bg-emerald-500" },
    { title: "My Purchases", subtitle: "Track and review your orders", icon: ShoppingBag, href: "/modules/uni-mart/purchase-history", borderColor: "border-purple-400", iconBg: "bg-purple-500" },
    { title: "My Sales", subtitle: "Review your sales and payments", icon: Receipt, href: "/modules/uni-mart/orders/seller", borderColor: "border-orange-400", iconBg: "bg-orange-500" },
    { title: "Messages", subtitle: "Chat directly with buyers or sellers", icon: MessageCircle, href: "/modules/uni-mart/messages", borderColor: "border-pink-400", iconBg: "bg-pink-500" },
    { title: "My Items", subtitle: "Manage your listed inventory", icon: ShoppingCart, href: "/modules/uni-mart/my-items", borderColor: "border-cyan-400", iconBg: "bg-cyan-500" },
    { title: "Sales History", subtitle: "See all your completed deals", icon: TrendingUp, href: "/modules/uni-mart/sales-history", borderColor: "border-amber-400", iconBg: "bg-amber-500" },
  ];

  const countCards = [
    { label: "Live Listings", value: availableProducts.length, icon: Package, helper: "Currently available" },
    { label: "Active Sellers", value: activeSellers, icon: Users, helper: "Selling right now" },
    { label: "Avg Item Price", value: formatPrice(averagePrice), icon: Wallet, helper: "Across available items" },
    { label: "Categories", value: listedCategories, icon: LayoutGrid, helper: "With live products" },
  ];

  const handleSearch = () => {
    router.push(
      `/modules/uni-mart/products${searchTerm.trim() ? `?query=${encodeURIComponent(searchTerm.trim())}` : ""}`
    );
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  const whyUseUniMart = [
    {
      title: "Students-Only Community",
      description: "Buy and sell inside a trusted campus network with verified student profiles.",
      icon: Users,
      accent: "from-cyan-400 to-blue-500",
    },
    {
      title: "Faster Deals, Better Prices",
      description: "Discover affordable listings and close deals quickly through direct in-app chat.",
      icon: Wallet,
      accent: "from-amber-400 to-orange-500",
    },
    {
      title: "Simple and Safe Workflow",
      description: "Post, chat, and meet in public campus spots with clear safety guidance.",
      icon: ShieldCheck,
      accent: "from-emerald-400 to-teal-500",
    },
  ];

return (
    // -mt-2 md:-mt-4 use karala mulu page ekama udin thiyena Navbar eka gawatama pull karanawa.
    <div className={`${inter.className} relative pb-0 min-h-screen -mt-2 md:-mt-10`}>
      
      {/* Background Layer */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-[radial-gradient(circle_at_top_right,#dbeafe,transparent_42%),radial-gradient(circle_at_bottom_left,#fef3c7,transparent_35%),linear-gradient(165deg,#fffdf8_0%,#eef7ff_45%,#ecfeff_100%)]">
      </div>

      {/* ================= FULL WIDTH HERO SECTION ================= */}
      {/* pt-6 wenuwata pt-2 damma athule his ida adu karanna */}
      <section className="relative z-10 mb-12 w-[100vw] relative left-1/2 -ml-[50vw] bg-white/60 border-b border-white/80 shadow-[0_20px_50px_rgba(14,116,144,0.08)] backdrop-blur-2xl overflow-hidden min-h-[75vh] flex flex-col pt-2 pb-12 mt-0">
        
        {/* Back Button Container inside Hero */}
        <div className="w-full max-w-[88rem] mx-auto px-3 sm:px-4 lg:px-6 mb-4 lg:mb-2">
          <button
            onClick={() => router.back()}
            className="relative z-10 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-white hover:shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
        {/* Animated Background Gradients */}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 right-10 lg:right-32 w-96 h-96 bg-cyan-400/20 rounded-full blur-[80px]"
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }} 
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-32 left-10 w-80 h-80 bg-blue-500/15 rounded-full blur-[80px]"
        />

        {/* Hero Content Wrapper */}
        <div className="relative z-10 w-full max-w-[88rem] mx-auto px-3 sm:px-4 lg:px-6 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 flex-1">
          
          {/* ----- LEFT SIDE: Content ----- */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="w-full lg:w-[50%] flex flex-col items-start text-left space-y-6"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 shadow-sm px-4 py-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className={`${oxanium.className} text-xs font-bold uppercase tracking-widest text-slate-700`}>
                Live Campus Trading
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className={`${poppins.className} text-5xl font-extrabold leading-tight tracking-tight md:text-7xl`}
              style={{
                backgroundImage:
                  "linear-gradient(115deg, #1d4ed8 0%, #38bdf8 24%, #facc15 46%, #f97316 68%, #6366f1 84%, #22d3ee 100%)",
                backgroundSize: "260% 260%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                filter: "drop-shadow(0 8px 22px rgba(29, 78, 216, 0.3))",
              }}
            >
              Buy. Sell. Swap.
              <br />
              Campus Smart.
            </motion.h1>

            <motion.p variants={itemVariants} className="typing-line max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
              Built by students, for students. Crafting one smart ecosystem for campus life.
            </motion.p>

            {/* Premium Search Bar */}
            <motion.div variants={itemVariants} className="w-full max-w-lg mt-4">
              <div className="relative group flex items-center bg-white border-2 border-slate-100 rounded-2xl p-1.5 shadow-lg transition-all duration-300 focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                <div className="pl-4 pr-2">
                  <Search className="w-6 h-6 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                </div>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Laptops, calculators, textbooks..." 
                  className="flex-1 bg-transparent outline-none text-slate-800 px-2 py-3 w-full text-base font-medium placeholder:text-slate-400"
                />
                <button 
                  onClick={handleSearch}
                  className={`${oxanium.className} bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl text-sm font-bold shadow-md transition-all hover:scale-[1.02] active:scale-95`}
                >
                  Search
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* ----- RIGHT SIDE: Carousel + Workflow ----- */}
          <div className="w-full lg:w-[45%] flex flex-col items-center justify-center space-y-8">
            
            {/* 1. 3D Swapping Carousel */}
            <div className="relative h-[320px] lg:h-[350px] w-full flex items-center justify-center perspective-[1000px]">
              
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.8, type: "spring" }}
                className="absolute w-48 h-48 bg-gradient-to-tr from-cyan-200 to-blue-100 rounded-full blur-2xl opacity-60"
              />

              <AnimatePresence mode="popLayout">
                {SHOWCASE_ITEMS.map((item, index) => {
                  const isActive = index === currentShowcaseIndex;
                  const isNext = index === (currentShowcaseIndex + 1) % SHOWCASE_ITEMS.length;
                  const isPrev = index === (currentShowcaseIndex - 1 + SHOWCASE_ITEMS.length) % SHOWCASE_ITEMS.length;

                  if (!isActive && !isNext && !isPrev) return null;

                  let xOffset = isActive ? 0 : isNext ? 90 : -90;
                  let yOffset = isActive ? 0 : isNext ? 20 : -20;
                  let scaleValue = isActive ? 1.15 : 0.85;
                  let zIndexValue = isActive ? 30 : 10;
                  let rotateValue = isActive ? 0 : isNext ? 8 : -8;
                  let opacityValue = isActive ? 1 : 0.5;

                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.5, x: isNext ? 100 : -100 }}
                      animate={{ opacity: opacityValue, x: xOffset, y: yOffset, scale: scaleValue, rotate: rotateValue, zIndex: zIndexValue }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
                      className="absolute bg-white p-4 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-slate-100 w-52 flex flex-col"
                    >
                      <div className={`w-full h-28 ${item.bg} rounded-2xl mb-3 flex items-center justify-center overflow-hidden`}>
                        <Icon size={46} className={`${item.color}`} />
                      </div>
                      <span className={`${item.badgeColor} text-[10px] font-bold px-2 py-1 rounded-md mb-1 self-start`}>
                        {item.badge}
                      </span>
                      <p className="text-sm font-bold text-slate-800 leading-tight mt-1">{item.title}</p>
                      <p className={`${oxanium.className} text-slate-900 font-black mt-2 text-lg`}>{item.price}</p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Floating Stat Pill */}
              <motion.div 
                animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-4 right-0 lg:-right-6 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 z-40"
              >
                <div className="bg-emerald-500/20 p-1.5 rounded-full">
                  <Zap size={18} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Live Activity</p>
                  <p className="text-sm font-bold">{availableProducts.length || "100+"} Available</p>
                </div>
              </motion.div>
            </div>

            {/* 2. Compact Workflow Steps (Animated with Zoom & Color Highlight) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="w-full max-w-sm bg-white/60 backdrop-blur-md border border-white/80 rounded-[2rem] p-2 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.04)] overflow-hidden"
            >
              {[
                { 
                  step: "Step 1", name: "Snap & Post", icon: Plus, 
                  activeBg: "#f0f9ff", iconActiveBg: "#0284c7", iconInactiveBg: "#e0f2fe", 
                  iconActiveText: "#ffffff", iconInactiveText: "#0284c7", titleActive: "#0369a1" 
                },
                { 
                  step: "Step 2", name: "Chat & Deal", icon: MessageCircle, 
                  activeBg: "#fffbeb", iconActiveBg: "#d97706", iconInactiveBg: "#fef3c7", 
                  iconActiveText: "#ffffff", iconInactiveText: "#d97706", titleActive: "#b45309" 
                },
                { 
                  step: "Step 3", name: "Meet & Swap", icon: ShieldCheck, 
                  activeBg: "#ecfdf5", iconActiveBg: "#059669", iconInactiveBg: "#d1fae5", 
                  iconActiveText: "#ffffff", iconInactiveText: "#059669", titleActive: "#047857" 
                }
              ].map((item, index) => {
                const isActive = activeWorkflowStep === index;
                const Icon = item.icon;
                
                return (
                  <React.Fragment key={item.step}>
                    <motion.div 
                      onClick={() => setActiveWorkflowStep(index)}
                      animate={{ 
                        scale: isActive ? 1.05 : 1,
                        backgroundColor: isActive ? item.activeBg : "rgba(255, 255, 255, 0)"
                      }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="flex flex-col items-center justify-center flex-1 py-2 rounded-2xl cursor-pointer"
                    >
                      <motion.div 
                        animate={{
                          backgroundColor: isActive ? item.iconActiveBg : item.iconInactiveBg,
                          color: isActive ? item.iconActiveText : item.iconInactiveText,
                          scale: isActive ? 1.15 : 1,
                        }}
                        transition={{ duration: 0.4, type: "spring" }}
                        className="w-10 h-10 rounded-full flex items-center justify-center mb-1.5 shadow-sm"
                      >
                        <Icon size={18} />
                      </motion.div>
                      <p className={`${oxanium.className} text-[9px] uppercase font-bold text-slate-400 tracking-wider transition-colors duration-300`}>
                        {item.step}
                      </p>
                      <motion.p 
                        animate={{ color: isActive ? item.titleActive : "#1e293b" }}
                        className="text-[11px] font-bold leading-none mt-0.5"
                      >
                        {item.name}
                      </motion.p>
                    </motion.div>

                    {index < 2 && (
                      <div className="h-8 w-[1px] bg-slate-200"></div>
                    )}
                  </React.Fragment>
                );
              })}
            </motion.div>

          </div>
        </div>
      </section>
      {/* ================= END FULL WIDTH HERO ================= */}

      {/* Trending Searches */}
      <section className="max-w-[88rem] mx-auto w-full px-3 sm:px-4 lg:px-6 relative z-10 mb-10">
        <h2 className={`${oxanium.className} mb-4 text-xl font-semibold text-slate-900`}>Trending Searches</h2>
        <div className="flex flex-wrap gap-3">
          {trendingTerms.map((term) => (
            <button
              key={term}
              onClick={() => router.push(`/modules/uni-mart/products?query=${encodeURIComponent(term)}`)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-700 hover:shadow-md"
            >
              {term}
            </button>
          ))}
        </div>
      </section>

      {/* Stats Cards */}
      <section className="max-w-[88rem] mx-auto w-full px-3 sm:px-4 lg:px-6 relative z-10 mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {countCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="group relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white/80 via-white/60 to-cyan-50/45 p-5 shadow-[0_14px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(14,116,144,0.18)]"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-300/30 blur-2xl" />
              <div className="pointer-events-none absolute -left-8 -bottom-8 h-20 w-20 rounded-full bg-blue-200/35 blur-xl" />
              <div className="relative mb-3 inline-flex rounded-2xl bg-slate-900 p-3 text-white transition-transform duration-300 group-hover:scale-110 group-hover:bg-cyan-600">
                <Icon size={20} />
              </div>
              <p className={`${oxanium.className} relative text-3xl font-black text-slate-900`}>{card.value}</p>
              <p className="relative mt-1 text-sm font-bold uppercase tracking-[0.08em] text-slate-700">{card.label}</p>
              <p className="relative mt-2 text-xs font-medium text-slate-500">{card.helper}</p>
            </div>
          );
        })}
      </section>

      {/* ================= QUICK NAVIGATION - UPDATED ================= */}
      <section className="max-w-[88rem] mx-auto w-full px-3 sm:px-4 lg:px-6 relative z-10 mb-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 className={`${oxanium.className} text-2xl font-bold text-slate-900`}>Quick Navigation</h2>
          <button
            onClick={() => router.push("/modules/uni-mart/products")}
            className="inline-flex items-center gap-1 text-sm font-bold text-[#00b4d8] hover:text-cyan-700 transition-colors"
          >
            Open Marketplace
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {actionCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.title}
                onClick={() => router.push(card.href)}
                className={`group rounded-xl border-2 ${card.borderColor} bg-white p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex min-h-[168px] flex-col items-start`}
              >
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${card.iconBg} text-white shadow-sm transition-transform duration-300 group-hover:scale-105`}>
                  <Icon size={18} strokeWidth={2} />
                </div>
                <h3 className={`${oxanium.className} text-[15px] font-bold leading-tight text-slate-900 tracking-tight`}>{card.title}</h3>
                <p className="mt-1 text-xs font-medium text-slate-500 leading-relaxed">{card.subtitle}</p>
              </button>
            );
          })}
        </div>
      </section>
      {/* ============================================================== */}
{/* ============================================================== */}

      {/* Category Feed */}
      <section className="max-w-[88rem] mx-auto w-full px-3 sm:px-4 lg:px-6 relative z-10 mb-12 space-y-8">
        <h2 className={`${oxanium.className} text-2xl font-bold text-slate-900`}>Browse By Category</h2>
        {categoryData.map((group) => {
          const Icon = CATEGORY_ICONS[group.category] || LayoutGrid;

          return (
            <div
              key={group.category}
              className="rounded-3xl border border-slate-100 bg-white/80 p-5 lg:p-7 shadow-sm backdrop-blur-sm"
            >
              <div className="mb-6 flex items-center justify-between border-b border-slate-200/60 pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-md">
                    <Icon size={22} />
                  </span>
                  <div>
                    <h3 className={`${oxanium.className} text-xl font-bold text-slate-900`}>{group.category}</h3>
                    <p className="text-sm font-medium text-slate-500">
                      {group.items.length > 0
                        ? `${group.items.length} items highlighted`
                        : "No live listings yet"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    router.push(
                      `/modules/uni-mart/products?category=${encodeURIComponent(group.category)}`
                    )
                  }
                  className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-5 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-cyan-400 hover:text-cyan-700"
                >
                  View All
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {group.items.length === 0 &&
                  [1, 2, 3, 4].map((placeholder) => (
                    <div
                      key={placeholder}
                      className="h-56 rounded-2xl border-2 border-dashed border-slate-200/60 bg-slate-50/50"
                    />
                  ))}

                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => router.push(`/modules/uni-mart/products/${item.id}`)}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.08)]"
                  >
                    <div className="relative h-40 w-full bg-slate-50 overflow-hidden">
                      {item.images[0] ? (
                        <Image
                          src={item.images[0]}
                          alt={item.title}
                          fill
                          className="object-cover transition duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-xs text-slate-400">No Image Available</div>
                      )}
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-slate-700 shadow-sm">
                        {item.condition.toUpperCase()}
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 p-4">
                      <p className="line-clamp-1 text-sm font-bold text-slate-800 group-hover:text-cyan-700 transition-colors">{item.title}</p>
                      <p className="mt-1 text-xs text-slate-500 mb-2">{item.category}</p>
                      <p className={`${oxanium.className} mt-auto text-lg font-black text-slate-900`}>
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Recently Added */}
      <section className="max-w-[88rem] mx-auto w-full px-3 sm:px-4 lg:px-6 relative z-10 mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className={`${oxanium.className} text-2xl font-bold text-slate-900`}>Recently Added</h2>
          <button
            onClick={() => router.push("/modules/uni-mart/products")}
            className="text-sm font-bold text-[#00b4d8] hover:text-cyan-700 transition-colors"
          >
            See all listings
          </button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {isLoading &&
            [1, 2, 3, 4, 5, 6, 7, 8].map((loader) => (
              <div key={loader} className="h-60 animate-pulse rounded-2xl bg-white/70" />
            ))}

          {!isLoading &&
            recentProducts.map((item) => (
              <button
                key={item.id}
                onClick={() => router.push(`/modules/uni-mart/products/${item.id}`)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.08)]"
              >
                <div className="relative h-40 w-full bg-slate-50 overflow-hidden">
                  {item.images[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-xs text-slate-400">No Image Available</div>
                  )}
                </div>
                <div className="flex flex-col flex-1 p-4">
                  <p className="line-clamp-1 text-sm font-bold text-slate-800 group-hover:text-cyan-700 transition-colors">{item.title}</p>
                  <p className="line-clamp-1 text-xs text-slate-500 mb-2">{item.category}</p>
                  <p className={`${oxanium.className} mt-auto text-lg font-black text-slate-900`}>
                    {formatPrice(item.price)}
                  </p>
                </div>
              </button>
            ))}
        </div>
      </section>

      {/* Trust & Safety Banner */}
      <section className="relative z-10 mb-0 w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden bg-slate-900 text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(34,211,238,0.15),transparent_50%)]" />
        <div className="relative z-10 mx-auto flex w-full max-w-[88rem] flex-col justify-between gap-8 px-6 py-8 sm:px-8 lg:px-16 md:flex-row md:items-center md:py-10">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300 backdrop-blur-md">
              <ShieldCheck size={14} /> Trust & Safety
            </div>
            <h3 className={`${oxanium.className} text-3xl font-black leading-tight text-white`}>
              Trade with confidence.
            </h3>
            <p className="mt-3 text-slate-300 font-medium leading-relaxed">
              Uni-Mart is built exclusively for our campus network. Always meet in well-lit public areas like the cafeteria or library, and inspect items before making any payments.
            </p>
          </div>
          
          <div className="grid gap-4 text-sm text-slate-200">
            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
              <MessageCircle className="text-cyan-400" size={20} />
              <span className="font-medium">Keep communications inside Uni-Mart</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
              <CreditCard className="text-emerald-400" size={20} />
              <span className="font-medium">Avoid blind advance payments</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Use Uni-Mart */}
      <section className="relative z-10 mb-0 w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden bg-white border-t border-slate-200/70">
        <div className="mx-auto w-full max-w-[88rem] px-6 py-12 sm:px-8 lg:px-16">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className={`${oxanium.className} text-xs font-bold uppercase tracking-[0.18em] text-cyan-700`}>Why Use Uni-Mart</p>
              <h3 className={`${oxanium.className} mt-2 text-3xl font-black text-slate-900`}>Built for smarter campus trading</h3>
            </div>
            <p className="max-w-xl text-sm font-medium leading-relaxed text-slate-600">
              Uni-Mart combines trusted student profiles, instant communication, and simple deal flow so you can trade confidently.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {whyUseUniMart.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-slate-100 blur-2xl" />
                  <div className={`relative mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${item.accent} text-white shadow-md`}>
                    <Icon size={20} />
                  </div>
                  <h4 className={`${oxanium.className} relative text-lg font-bold text-slate-900`}>{item.title}</h4>
                  <p className="relative mt-2 text-sm font-medium leading-relaxed text-slate-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Standard Footer Section - Placed at the very end properly */}
      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white">
        <Footer />
      </div>

      <style jsx>{`
        .typing-line {
          display: block;
          overflow: hidden;
          clip-path: inset(0 100% 0 0);
          animation: typingReveal 3.8s steps(80, end) 0.35s forwards;
        }

        @media (max-width: 768px) {
          .typing-line {
            animation: fadeIn 0.8s ease-out 0.2s both;
            clip-path: none;
          }
        }

        @keyframes typingReveal {
          to {
            clip-path: inset(0 0 0 0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}