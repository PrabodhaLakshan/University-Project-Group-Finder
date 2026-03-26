
'use client';

import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { Oxanium } from "next/font/google";
import { Sora } from "next/font/google";
import Navbar from "@/components/Navbar";
import { useEffect, useRef, useState } from "react";
import {
    BookOpen,
    Users,
    ShoppingCart,
    UserPlus,
    Briefcase,
    ShieldCheck,
    Handshake,
    Lightbulb,
    Globe,
    CheckCircle2,
    Github,
    Linkedin,
    ArrowRight,
} from "lucide-react";

const offerItems = [
    {
        title: "Group Finder",
        description: "Find perfect teammates based on skills, interests, and availability.",
        icon: UserPlus,
        color: "from-fuchsia-500 to-pink-500",
    },
    {
        title: "Marketplace",
        description: "Buy and sell second-hand project items at affordable prices safely.",
        icon: ShoppingCart,
        color: "from-violet-500 to-purple-500",
    },
    {
        title: "Peer Tutoring",
        description: "Teach or learn from peers through a structured and friendly tutoring system.",
        icon: Users,
        color: "from-indigo-500 to-blue-500",
    },
    {
        title: "Freelance Hiring",
        description: "Get hired for real-world projects or find skilled students for your work.",
        icon: Briefcase,
        color: "from-emerald-500 to-teal-400",
    },
    {
        title: "Notes Sharing",
        description: "Upload and access notes, past papers, and study materials effortlessly.",
        icon: BookOpen,
        color: "from-blue-500 to-cyan-400",
    },
];

const keyFeatures = [
    "Secure campus-only access",
    "Intuitive & modern interface",
    "Real-time instant messaging",
    "Transparent rating & reviews",
    "Smart search & filtering",
];

const values = [
    {
        title: "Collaboration",
        description: "Fostering teamwork and peer-to-peer growth.",
        icon: Handshake,
    },
    {
        title: "Innovation",
        description: "Leveraging tech to simplify student life.",
        icon: Lightbulb,
    },
    {
        title: "Accessibility",
        description: "Making resources available to everyone easily.",
        icon: Globe,
    },
    {
        title: "Trust & Safety",
        description: "Maintaining a secure, verified environment.",
        icon: ShieldCheck,
    },
];

const stats = [
    { value: 1000, suffix: "+", label: "Active Students" },
    { value: 500, suffix: "+", label: "Resources Shared" },
    { value: 200, suffix: "+", label: "Projects Completed" },
    { value: 150, suffix: "+", label: "Items Traded" },
];

const team = [
    {
        role: "Project Lead & System Design",
        name: "Member 1",
        image: "/images/aboutus/member1.png",
        github: "https://github.com/member1",
        linkedin: "https://www.linkedin.com/in/member1",
    },
    {
        role: "Marketplace Module",
        name: "Member 2",
        image: "/images/aboutus/member4.png",
        github: "https://github.com/member2",
        linkedin: "https://www.linkedin.com/in/member2",
    },
    {
        role: "Group Finder Module",
        name: "Member 3",
        image: "/images/aboutus/member3.png",
        github: "https://github.com/member3",
        linkedin: "https://www.linkedin.com/in/member3",
    },
    {
        role: "Tutoring & Freelance",
        name: "Member 4",
        image: "/images/aboutus/member2.png",
        github: "https://github.com/member4",
        linkedin: "https://www.linkedin.com/in/member4",
    },
];

const whyWeBuiltItems = [
    {
        id: "01",
        title: "Project Group Finder",
        problem:
            "Students often struggle to find the right teammates with matching skills, commitment levels, and project goals.",
        solution:
            "Our Project Group Finder helps students discover compatible team members faster, leading to stronger collaboration and better project outcomes.",
        icon: UserPlus,
        accent: "from-blue-500 to-cyan-400",
        chip: "Project Group Finder",
    },
    {
        id: "02",
        title: "Campus Marketplace",
        problem:
            "Specialized project equipment like Arduino kits, sensors, and textbooks can be prohibitively expensive for a single semester of use.",
        solution:
            "Our Marketplace enables a sustainable circular economy, helping students buy and sell verified second-hand gear and reduce project costs.",
        icon: ShoppingCart,
        accent: "from-orange-500 to-amber-400",
        chip: "Campus Marketplace",
    },
    {
        id: "03",
        title: "Tutor Connect Learn Modules",
        problem:
            "Many students need personalized help to close learning gaps, but finding reliable peer support at the right time is difficult.",
        solution:
            "Tutor Connect Learn Modules make peer tutoring easier to access, helping students learn faster and build confidence in key subjects.",
        icon: BookOpen,
        accent: "from-indigo-500 to-violet-400",
        chip: "Tutor Connect",
    },
    {
        id: "04",
        title: "Startup GIG for Freelancing",
        problem:
            "Theoretical knowledge alone is not enough for the modern workforce, yet many students lack a professional space to apply their skills and earn.",
        solution:
            "Startup GIG for Freelancing creates real project opportunities where students can monetize their skills and build strong portfolios before graduation.",
        icon: Briefcase,
        accent: "from-emerald-500 to-teal-400",
        chip: "Startup GIG",
    },
];

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
});

const oxanium = Oxanium({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const sora = Sora({
    subsets: ["latin"],
    weight: ["500", "600", "700"],
});

export default function AboutPage() {
    const [countedStats, setCountedStats] = useState<number[]>(stats.map(() => 0));
    const [hasAnimatedStats, setHasAnimatedStats] = useState(false);
    const statsSectionRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!statsSectionRef.current || hasAnimatedStats) {
            return;
        }

        const sectionElement = statsSectionRef.current;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting || hasAnimatedStats) {
                    return;
                }

                setHasAnimatedStats(true);
                const duration = 1600;
                const startTime = performance.now();

                const animate = (currentTime: number) => {
                    const progress = Math.min((currentTime - startTime) / duration, 1);
                    const easedProgress = 1 - Math.pow(1 - progress, 3);

                    setCountedStats(stats.map((stat) => Math.floor(stat.value * easedProgress)));

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };

                requestAnimationFrame(animate);
                observer.disconnect();
            },
            { threshold: 0.35 }
        );

        observer.observe(sectionElement);

        return () => observer.disconnect();
    }, [hasAnimatedStats]);

    return (
        <>
        <Navbar />
        <main className="relative min-h-screen bg-[#f8fafc] text-slate-800 selection:bg-blue-200 selection:text-blue-900 overflow-hidden font-sans">
            {/* Soft Background Mesh Gradients */}
            <div className="absolute top-0 -left-40 w-[500px] h-[500px] bg-blue-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-40 w-[500px] h-[500px] bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-40 left-20 w-[600px] h-[600px] bg-purple-200/50 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-blob animation-delay-4000"></div>

            <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-0 md:px-8 md:pb-24 md:pt-0 space-y-24">
                
                {/* Hero Section */}
                <section className={`${oxanium.className} relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden border-y border-white/70 bg-gradient-to-r from-white/62 via-slate-50/55 to-blue-50/52 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.09)] backdrop-blur-xl md:p-10 lg:px-14`}>
                    <div className="pointer-events-none absolute inset-0 opacity-20">
                        <Image
                            src="/images/aboutus/aboutus_hero_BG.png"
                            alt=""
                            fill
                            aria-hidden="true"
                            className="object-cover object-center"
                        />
                    </div>
                    <div className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-blue-200/40 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl" />

                    <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
                        <div className="space-y-6">
                            <h1 className={`${poppins.className} hero-title-effect text-5xl font-extrabold leading-tight tracking-tight text-transparent bg-clip-text md:text-7xl`}>
                                Learn. Connect. Build. Earn.
                            </h1>

                            <Image
                                src="/images/aboutus/UniNexus_Logo_lightT.png"
                                alt="UniNexus"
                                width={280}
                                height={56}
                                className="-ml-2 h-12 w-auto md:-ml-4 md:h-14"
                                priority
                            />

                            <p className="typing-line max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
                                Built by students, for students. Crafting one smart ecosystem for campus life.
                            </p>

                            <div className="flex flex-wrap items-center gap-3 pt-1">
                                <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                                    Explore Platform
                                    <ArrowRight size={16} />
                                </Link>
                                <Link href="/modules/project-group-finder" className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700">
                                    Find Your Team
                                </Link>
                            </div>
                        </div>

                        <div className="relative -mb-6 min-h-[420px] md:-mb-10 md:min-h-[520px] lg:ml-auto lg:w-full lg:self-end lg:translate-x-10">
                            <div className="absolute inset-x-0 bottom-0 h-full overflow-hidden">
                                <Image
                                    src="/images/aboutus/aboutus_hero.png"
                                    alt="Students collaborating at Uni Nexus"
                                    fill
                                    priority
                                    className="origin-bottom object-contain object-bottom scale-105 md:scale-110 translate-y-6 md:translate-y-10"
                                />
                            </div>

                            <div className="hero-overlay-card hero-card-a absolute bottom-5 left-3 z-20 w-[68%] rounded-3xl p-5 md:left-5 md:w-[64%]">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Student Ecosystem</p>
                                <p className="mt-2 text-lg font-bold text-slate-900">All your campus essentials in one place.</p>
                                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                    <div className="hero-mini-pill text-blue-700">Resources</div>
                                    <div className="hero-mini-pill text-indigo-700">Tutoring</div>
                                    <div className="hero-mini-pill text-violet-700">Marketplace</div>
                                    <div className="hero-mini-pill text-emerald-700">Freelance</div>
                                </div>
                            </div>

                            <div className="hero-overlay-card hero-card-b absolute bottom-5 right-3 z-20 w-[60%] rounded-2xl p-4 md:right-5 md:w-[56%]">
                                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Live Growth</p>
                                <p className="mt-1 text-sm font-semibold text-slate-800">Students collaborating across modules</p>
                                <div className="mt-3 h-2 w-full rounded-full bg-blue-100">
                                    <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section ref={statsSectionRef} className="grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-4">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="group relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white/70 via-white/45 to-blue-50/35 p-6 text-center shadow-[0_14px_34px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(37,99,235,0.16)] md:p-8">
                            <div className="pointer-events-none absolute -right-6 -top-8 h-20 w-20 rounded-full bg-blue-200/35 blur-2xl" />
                            <div className="pointer-events-none absolute -left-8 -bottom-10 h-24 w-24 rounded-full bg-indigo-200/30 blur-2xl" />
                            <h3 className="relative text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 md:text-5xl">
                                {countedStats[idx].toLocaleString()}
                                {stat.suffix}
                            </h3>
                            <p className="relative mt-2 text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">{stat.label}</p>
                        </div>
                    ))}
                </section>

                {/* Vision Section */}
                <section className="grid items-center gap-10 lg:grid-cols-2">
                    <div className="space-y-5">
                        <div className="inline-flex items-center gap-3">
                            <span className="h-[2px] w-10 bg-gradient-to-r from-blue-500 to-cyan-500" />
                            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Where We’re Going</span>
                        </div>
                        <h2 className={`${sora.className} flex items-center gap-3 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-700 md:text-5xl`}>
                            <Lightbulb size={30} className="text-blue-600" />
                            The Vision
                        </h2>
                        <p className="text-base font-semibold uppercase tracking-[0.08em] text-blue-600">The Digital Campus of Tomorrow</p>
                        <p className="max-w-2xl text-lg leading-relaxed text-slate-600">
                            Uni Nexus envisions a future where the traditional university experience is enhanced by a borderless digital ecosystem. We believe that every student, regardless of their background, should have immediate access to the best study resources, financial opportunities, and a collaborative network.
                        </p>
                        <p className="max-w-2xl text-lg leading-relaxed text-slate-600">
                            Our vision is to transform campus life into a more interconnected, efficient, and empowered journey for the next generation of leaders.
                        </p>
                        <p className="max-w-2xl text-base leading-relaxed text-slate-500">
                            From lecture halls to startup teams, we imagine one seamless platform where students can learn faster, collaborate smarter, and grow with confidence.
                        </p>
                    </div>
                    <div className="relative min-h-[280px] md:min-h-[360px]">
                        <Image
                            src="/images/aboutus/aboutus_vision.png"
                            alt="Vision of Uni Nexus"
                            fill
                            className="object-contain object-center"
                        />
                    </div>
                </section>

                {/* Mission Section */}
                <section className="grid items-center gap-10 lg:grid-cols-2">
                    <div className="relative order-2 min-h-[280px] md:min-h-[360px] lg:order-1">
                        <Image
                            src="/images/aboutus/aboutus_mission.png"
                            alt="Mission of Uni Nexus"
                            fill
                            className="object-contain object-center"
                        />
                    </div>
                    <div className="order-1 space-y-5 lg:order-2">
                        <div className="inline-flex items-center gap-3">
                            <span className="h-[2px] w-10 bg-gradient-to-r from-indigo-500 to-violet-500" />
                            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">What We’re Building</span>
                        </div>
                        <h2 className={`${sora.className} flex items-center gap-3 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-800 to-violet-700 md:text-5xl`}>
                            <ShieldCheck size={30} className="text-indigo-600" />
                            Our Mission
                        </h2>
                        <p className="text-base font-semibold uppercase tracking-[0.08em] text-indigo-600">Empowering the Student Journey</p>
                        <p className="max-w-2xl text-lg leading-relaxed text-slate-600">
                            Our mission is to dismantle the barriers that limit student success by providing a secure, centralized hub. We are committed to:
                        </p>
                        <ul className="space-y-3 text-slate-600">
                            <li className="flex items-start gap-3 rounded-2xl bg-white/55 px-4 py-3 backdrop-blur-sm ring-1 ring-white/40">
                                <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-indigo-500" />
                                <span><strong>Democratizing Education:</strong> Making high-quality study materials, past papers, and practical learning resources accessible to every learner.</span>
                            </li>
                            <li className="flex items-start gap-3 rounded-2xl bg-white/55 px-4 py-3 backdrop-blur-sm ring-1 ring-white/40">
                                <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-indigo-500" />
                                <span><strong>Economic Opportunity:</strong> Enabling students to earn through peer tutoring and a sustainable marketplace for project gear, reducing waste and cost.</span>
                            </li>
                            <li className="flex items-start gap-3 rounded-2xl bg-white/55 px-4 py-3 backdrop-blur-sm ring-1 ring-white/40">
                                <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-indigo-500" />
                                <span><strong>Strategic Collaboration:</strong> Facilitating the right match for project groups and freelance roles to bridge the gap between academia and industry.</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Goal Section */}
                <section className="grid items-center gap-10 lg:grid-cols-2">
                    <div className="space-y-5">
                        <div className="flex items-center gap-3">
                            <span className="h-[2px] w-10 bg-gradient-to-r from-emerald-500 to-teal-500" />
                            <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">What We Aim To Achieve</span>
                        </div>
                        <h2 className={`${sora.className} flex items-center gap-3 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-700 md:text-5xl`}>
                            <Globe size={30} className="text-emerald-600" />
                            Our Goal
                        </h2>
                        <p className="text-base font-semibold uppercase tracking-[0.08em] text-emerald-600">Creating Measurable Impact</p>
                        <p className="max-w-2xl text-lg leading-relaxed text-slate-600">
                            Our immediate goal is to support over 10,000+ active students, fostering a culture where knowledge is shared rather than gate-kept.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-emerald-100/70 px-3 py-1 text-xs font-semibold text-emerald-700">10,000+ Active Students</span>
                            <span className="rounded-full bg-blue-100/70 px-3 py-1 text-xs font-semibold text-blue-700">40% Project Cost Reduction</span>
                            <span className="rounded-full bg-indigo-100/70 px-3 py-1 text-xs font-semibold text-indigo-700">Trusted Student Network</span>
                        </div>
                        <ul className="space-y-3 text-slate-600">
                            <li className="flex items-start gap-3 rounded-2xl bg-white/55 px-4 py-3 backdrop-blur-sm ring-1 ring-white/40">
                                <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                                <span><strong>Reduce project costs by 40%:</strong> Lower the financial burden of university projects through our marketplace.</span>
                            </li>
                            <li className="flex items-start gap-3 rounded-2xl bg-white/55 px-4 py-3 backdrop-blur-sm ring-1 ring-white/40">
                                <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                                <span><strong>Build a trusted network:</strong> Establish the most trusted student-verified freelance and tutoring network in the region.</span>
                            </li>
                            <li className="flex items-start gap-3 rounded-2xl bg-white/55 px-4 py-3 backdrop-blur-sm ring-1 ring-white/40">
                                <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                                <span><strong>Continuously innovate:</strong> Evolve the platform to remain the gold standard for campus management solutions.</span>
                            </li>
                        </ul>
                        <p className="max-w-2xl text-base leading-relaxed text-slate-500">
                            Every milestone is designed to create real value for students, universities, and the broader innovation ecosystem.
                        </p>
                    </div>
                    <div className="relative min-h-[280px] md:min-h-[360px]">
                        <Image
                            src="/images/aboutus/aboutus_goal.png"
                            alt="Goal of Uni Nexus"
                            fill
                            className="object-contain object-center"
                        />
                    </div>
                </section>

                {/* Why We Built Uni Nexus */}
                <section className="space-y-8">
                    <div className="max-w-4xl space-y-4">
                        <div className="inline-flex items-center gap-3">
                            <span className="h-[2px] w-10 bg-gradient-to-r from-blue-500 to-indigo-500" />
                            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Core Purpose</span>
                        </div>
                        <h2 className={`${sora.className} text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-800 to-blue-700 md:text-5xl`}>
                            Why We Built Uni Nexus
                        </h2>
                        <p className="max-w-3xl text-lg leading-relaxed text-slate-600">
                            University life is full of friction points. This platform is designed to remove complexity, unlock opportunity, and make student growth more accessible and practical.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {whyWeBuiltItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <article
                                    key={item.id}
                                    className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/60 p-7 shadow-[0_14px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_44px_rgba(15,23,42,0.12)]"
                                >
                                    <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-10`} />

                                    <div className="relative z-10 space-y-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-white shadow-lg`}>
                                                <Icon size={22} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-300">{item.id}</span>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                                            <p className="text-sm leading-relaxed text-slate-500">{item.problem}</p>
                                        </div>

                                        <div className="rounded-2xl border border-slate-200/80 bg-white/75 p-4">
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Our Solution</p>
                                            <p className="text-sm leading-relaxed text-slate-700">{item.solution}</p>
                                        </div>

                                        <div>
                                            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{item.chip}</span>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>

                {/* What We Offer */}
                <section className="space-y-10">
                    <div className="mx-auto max-w-3xl text-center space-y-4">
                        <div className="inline-flex items-center gap-3">
                            <span className="h-[2px] w-10 bg-gradient-to-r from-blue-500 to-indigo-500" />
                            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Student Solutions</span>
                            <span className="h-[2px] w-10 bg-gradient-to-r from-indigo-500 to-blue-500" />
                        </div>
                        <h2 className={`${oxanium.className} text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-800 to-blue-700 md:text-5xl`}>
                            What We Offer
                        </h2>
                        <p className="text-lg leading-relaxed text-slate-600">
                            Everything you need to succeed in one connected platform, designed for learning, collaboration, and growth.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
                        {offerItems.map((item, idx) => {
                            const Icon = item.icon;
                            const cardPositionClass =
                                idx === 3
                                    ? "lg:col-span-2 lg:col-start-2"
                                    : idx === 4
                                      ? "lg:col-span-2 lg:col-start-4"
                                      : "lg:col-span-2";

                            return (
                                <article key={idx} className={`${cardPositionClass} group relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white/80 via-white/65 to-slate-50/60 p-7 shadow-[0_14px_34px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_48px_rgba(15,23,42,0.14)]`}>
                                    <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.color} opacity-10 transition-opacity duration-300 group-hover:opacity-20`} />
                                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.65),rgba(255,255,255,0)_48%)]" />
                                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0)_36%,rgba(255,255,255,0.16)_72%,rgba(255,255,255,0)_100%)] opacity-80" />
                                    <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-200/35 blur-2xl" />
                                    <div className="pointer-events-none absolute -left-10 -bottom-12 h-28 w-28 rounded-full bg-indigo-200/30 blur-2xl" />
                                    <div className="pointer-events-none absolute right-8 top-7 h-10 w-10 rounded-full border border-white/50 bg-white/30" />
                                    <div className="pointer-events-none absolute left-8 bottom-8 h-8 w-8 rounded-full border border-white/45 bg-white/25" />

                                    <div className={`relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                                        <Icon size={24} strokeWidth={2} />
                                    </div>

                                    <h3 className={`${oxanium.className} relative z-10 mb-3 text-2xl font-bold text-slate-900`}>{item.title}</h3>
                                    <p className="relative z-10 text-base leading-relaxed text-slate-600">{item.description}</p>

                                    <div className="relative z-10 mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors group-hover:text-blue-700">
                                        Learn more
                                        <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>

                {/* Values & Features */}
                <section className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-7">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-3">
                                <span className="h-[2px] w-10 bg-gradient-to-r from-indigo-500 to-blue-500" />
                                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Foundation</span>
                            </div>
                            <h2 className={`${sora.className} text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-800 to-blue-700 md:text-5xl`}>
                                Core Values
                            </h2>
                            <p className="text-lg leading-relaxed text-slate-600">The principles that guide our product decisions and student-first ecosystem.</p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {values.map((value, idx) => {
                                const Icon = value.icon;
                                return (
                                    <article
                                        key={idx}
                                        className="group relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white/80 via-white/65 to-indigo-50/45 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(79,70,229,0.14)]"
                                    >
                                        <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-indigo-200/35 blur-2xl" />
                                        <div className="relative z-10">
                                            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg">
                                                <Icon size={20} />
                                            </div>
                                            <h3 className={`${oxanium.className} text-xl font-bold text-slate-900`}>{value.title}</h3>
                                            <p className="mt-2 text-sm leading-relaxed text-slate-600">{value.description}</p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-[2.2rem] border border-indigo-200/40 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-7 shadow-[0_22px_52px_rgba(15,23,42,0.30)] md:p-8">
                        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-300/25 blur-2xl" />
                        <div className="pointer-events-none absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-cyan-300/20 blur-2xl" />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_36%,rgba(99,102,241,0.14)_72%,rgba(255,255,255,0)_100%)]" />

                        <div className="relative z-10 space-y-6">
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-100">Experience Layer</p>
                                </div>
                                <h3 className={`${sora.className} text-2xl font-bold text-white md:text-3xl`}>Platform Features</h3>
                                <p className="text-sm leading-relaxed text-slate-300">Built to be fast, trusted, and intuitive across every student workflow.</p>
                            </div>

                            <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
                                <div className="h-2 w-[88%] rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400" />
                            </div>

                            <div className="space-y-3">
                                {keyFeatures.map((feature, idx) => (
                                    <div key={idx} className="group flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:border-cyan-300/40 hover:bg-white/15">
                                        <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-[11px] font-bold text-white">
                                            {idx + 1}
                                        </div>
                                        <span className="text-sm font-medium text-slate-100">{feature}</span>
                                        <div className="ml-auto rounded-full bg-white/20 p-1 text-white">
                                            <CheckCircle2 size={13} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="relative overflow-hidden rounded-[2.5rem] border border-white/65 bg-gradient-to-br from-white/80 via-white/60 to-indigo-50/50 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl md:p-10">
                    <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-blue-300/25 blur-3xl" />
                    <div className="pointer-events-none absolute -right-20 bottom-8 h-56 w-56 rounded-full bg-violet-300/25 blur-3xl" />

                    <div className="relative z-10 space-y-10">
                        <div className="mx-auto max-w-3xl text-center space-y-4">
                            <div className="inline-flex items-center gap-3">
                                <span className="h-[2px] w-12 bg-gradient-to-r from-blue-500 to-indigo-500" />
                                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">The Makers</span>
                                <span className="h-[2px] w-12 bg-gradient-to-r from-indigo-500 to-violet-500" />
                            </div>
                            <h2 className={`${sora.className} text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-800 to-blue-700 md:text-5xl`}>
                                Meet the Team
                            </h2>
                            <p className="text-lg leading-relaxed text-slate-600">
                                A multidisciplinary student team blending engineering, design, and product thinking to build campus-first digital experiences.
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                            {team.map((member, idx) => (
                                <article
                                    key={idx}
                                    className="group relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-[0_14px_34px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_28px_52px_rgba(37,99,235,0.18)]"
                                >
                                    <div className="pointer-events-none absolute -right-12 -top-10 h-24 w-24 rounded-full bg-blue-200/35 blur-2xl" />
                                    <div className="pointer-events-none absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-violet-200/25 blur-2xl" />

                                    <div className="relative z-10 space-y-4">
                                        <div className="relative h-56 overflow-hidden rounded-[1.4rem]">
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                fill
                                                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 via-transparent to-transparent" />
                                            <div className="absolute left-3 top-3 inline-flex rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-700">
                                                Member {String(idx + 1).padStart(2, "0")}
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-white/70 bg-white/75 p-4 backdrop-blur-sm">
                                            <h3 className={`${oxanium.className} text-2xl font-bold text-slate-900`}>{member.name}</h3>
                                            <p className="mt-2 text-sm leading-relaxed text-slate-600">{member.role}</p>
                                        </div>

                                        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                            Uni Nexus Team
                                        </div>

                                        <div className="flex items-center justify-center gap-2 pt-1">
                                            <a
                                                href={member.github}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                                            >
                                                <Github size={14} />
                                                GitHub
                                            </a>
                                            <a
                                                href={member.linkedin}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-100/70"
                                            >
                                                <Linkedin size={14} />
                                                LinkedIn
                                            </a>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-10 md:p-16 text-center shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>
                    <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>
                    
                    <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Ready to join the network?</h2>
                        <p className="text-xl text-slate-300">
                            Experience a smarter way to learn, connect, and grow within your campus.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link href="/register" className="group flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-slate-900 transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] w-full sm:w-auto">
                                Get Started Today
                                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link href="/contact" className="flex items-center justify-center rounded-full border border-slate-600 bg-slate-800/50 backdrop-blur-sm px-8 py-4 font-semibold text-white transition-all hover:bg-slate-800 w-full sm:w-auto">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </section>
                
                <style jsx>{`
                    .hero-mini-pill {
                        border: 1px solid rgba(255, 255, 255, 0.7);
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.42));
                        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75), 0 6px 16px rgba(15, 23, 42, 0.08);
                        backdrop-filter: blur(10px) saturate(150%);
                        -webkit-backdrop-filter: blur(10px) saturate(150%);
                        border-radius: 0.75rem;
                        padding: 0.5rem 0.75rem;
                        font-weight: 600;
                    }

                    .hero-title-effect {
                        background-image: linear-gradient(
                            115deg,
                            #1d4ed8 0%,
                            #38bdf8 24%,
                            #facc15 46%,
                            #f97316 68%,
                            #6366f1 84%,
                            #22d3ee 100%
                        );
                        background-size: 260% 260%;
                        animation: titleGradientFlow 4s ease-in-out infinite, titleGlowPulse 2.4s ease-in-out infinite;
                        filter: drop-shadow(0 8px 22px rgba(29, 78, 216, 0.3));
                    }

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

                    .hero-overlay-card {
                        will-change: opacity, transform;
                        animation-duration: 10s;
                        animation-timing-function: ease-in-out;
                        animation-iteration-count: infinite;
                        border: 1px solid rgba(255, 255, 255, 0.52);
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.58), rgba(255, 255, 255, 0.24));
                        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.65);
                        backdrop-filter: blur(22px) saturate(170%);
                        -webkit-backdrop-filter: blur(22px) saturate(170%);
                    }

                    .hero-card-a {
                        animation-name: swapCardA;
                    }

                    .hero-card-b {
                        animation-name: swapCardB;
                        border-color: rgba(147, 197, 253, 0.48);
                        background: linear-gradient(135deg, rgba(239, 246, 255, 0.62), rgba(224, 231, 255, 0.24));
                    }

                    @keyframes typingReveal {
                        from {
                            clip-path: inset(0 100% 0 0);
                        }
                        to {
                            clip-path: inset(0 0 0 0);
                        }
                    }

                    @keyframes titleGradientFlow {
                        0%,
                        100% {
                            background-position: 0% 50%;
                        }
                        50% {
                            background-position: 100% 50%;
                        }
                    }

                    @keyframes titleGlowPulse {
                        0%,
                        100% {
                            filter: drop-shadow(0 8px 22px rgba(29, 78, 216, 0.28));
                        }
                        50% {
                            filter: drop-shadow(0 12px 30px rgba(249, 115, 22, 0.35));
                        }
                    }

                    @keyframes swapCardA {
                        0%,
                        45% {
                            opacity: 1;
                            transform: translateY(0);
                            pointer-events: auto;
                        }
                        50%,
                        95% {
                            opacity: 0;
                            transform: translateY(8px);
                            pointer-events: none;
                        }
                        100% {
                            opacity: 1;
                            transform: translateY(0);
                            pointer-events: auto;
                        }
                    }

                    @keyframes swapCardB {
                        0%,
                        45% {
                            opacity: 0;
                            transform: translateY(8px);
                            pointer-events: none;
                        }
                        50%,
                        95% {
                            opacity: 1;
                            transform: translateY(0);
                            pointer-events: auto;
                        }
                        100% {
                            opacity: 0;
                            transform: translateY(8px);
                            pointer-events: none;
                        }
                    }

                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(4px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}</style>

            </div>
        </main>
        </>
    );
}
