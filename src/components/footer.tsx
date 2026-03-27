// // 'use client';

// // import Link from "next/link";
// // import { Poppins, Oxanium, Sora } from "next/font/google";
// // import { 
// //     Facebook, 
// //     Instagram, 
// //     Linkedin, 
// //     Mail, 
// //     MessageCircle, 
// //     Send, 
// //     ShieldCheck, 
// //     ChevronRight,
// //     MapPin,
// //     GraduationCap
// // } from "lucide-react";

// // const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
// // const oxanium = Oxanium({ subsets: ["latin"], weight: ["500", "600", "700"] });
// // const sora = Sora({ subsets: ["latin"], weight: ["500", "600", "700"] });

// // export default function Footer() {
// //     return (
// //         <footer className="relative mt-20 overflow-hidden bg-[#0f172a] pt-20 pb-8 text-slate-300 font-sans selection:bg-blue-500/30 selection:text-white border-t border-white/10">
            
// //             {/* Background Glow Effects */}
// //             <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]"></div>
// //             <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-600/20 blur-[100px]"></div>
// //             <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]"></div>

// //             <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-14">
                
// //                 <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 border-b border-white/10 pb-16">
                    
// //                     {/* 1. Brand Info & Trust Badge (Spans 4 columns) */}
// //                     <div className="lg:col-span-4 space-y-6">
// //                         <Link href="/" className="inline-block">
// //                             {/* ඔයාගේ Logo Image එක මෙතනට දාන්න පුළුවන්. දැනට Text Logo එකක් දාලා තියෙන්නේ */}
// //                             <h2 className={`${oxanium.className} text-3xl font-extrabold text-white tracking-wide flex items-center gap-2`}>
// //                                 Uni<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Nexus</span>
// //                             </h2>
// //                         </Link>
                        
// //                         <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
// //                             Experience a smarter way to learn, connect, and grow. The ultimate digital hub built exclusively for our campus community.
// //                         </p>

// //                         {/* Campus Trust Badge */}
// //                         <div className="inline-flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-md">
// //                             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
// //                                 <ShieldCheck size={18} />
// //                             </div>
// //                             <div>
// //                                 <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Secure Network</p>
// //                                 <p className="text-[11px] text-slate-400 font-medium">Verified Students Only</p>
// //                             </div>
// //                         </div>
// //                     </div>

// //                     {/* 2. Quick Links (Spans 2 columns) */}
// //                     <div className="lg:col-span-2 space-y-6">
// //                         <h4 className={`${sora.className} text-lg font-bold text-white`}>Platform</h4>
// //                         <ul className="space-y-3.5">
// //                             {['Campus Marketplace', 'Project Groups', 'Notes Sharing', 'Tutor Sessions'].map((item) => (
// //                                 <li key={item}>
// //                                     <Link href="#" className="group flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-blue-400">
// //                                         <ChevronRight size={14} className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-blue-500" />
// //                                         <span className="-ml-4 transition-all group-hover:ml-0">{item}</span>
// //                                     </Link>
// //                                 </li>
// //                             ))}
// //                         </ul>
// //                     </div>

// //                     {/* 3. Legal & Policies (Spans 3 columns) */}
// //                     <div className="lg:col-span-3 space-y-6">
// //                         <h4 className={`${sora.className} text-lg font-bold text-white`}>Support & Legal</h4>
// //                         <ul className="space-y-3.5">
// //                             {['About Us', 'Contact Support', 'Terms & Conditions', 'Privacy Policy', 'Safety Guidelines'].map((item) => (
// //                                 <li key={item}>
// //                                     <Link href="#" className="group flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-blue-400">
// //                                         <ChevronRight size={14} className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-blue-500" />
// //                                         <span className="-ml-4 transition-all group-hover:ml-0">{item}</span>
// //                                     </Link>
// //                                 </li>
// //                             ))}
// //                         </ul>
// //                     </div>

// //                     {/* 4. Contact & Social (Spans 3 columns) */}
// //                     <div className="lg:col-span-3 space-y-6">
// //                         <h4 className={`${sora.className} text-lg font-bold text-white`}>Get in Touch</h4>
                        
// //                         <div className="space-y-4">
// //                             <a href="mailto:support@uninexus.com" className="flex items-center gap-3 text-sm font-medium text-slate-400 transition-colors hover:text-white">
// //                                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-blue-400">
// //                                     <Mail size={16} />
// //                                 </div>
// //                                 support@uninexus.com
// //                             </a>
// //                             <div className="flex items-center gap-3 text-sm font-medium text-slate-400">
// //                                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-blue-400">
// //                                     <MapPin size={16} />
// //                                 </div>
// //                                 Colombo, Sri Lanka
// //                             </div>
// //                         </div>

// //                         {/* Social Icons */}
// //                         <div className="flex gap-3 pt-2">
// //                             <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 transition-all hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] hover:-translate-y-1">
// //                                 <Facebook size={18} />
// //                             </a>
// //                             <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 transition-all hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:border-transparent hover:-translate-y-1">
// //                                 <Instagram size={18} />
// //                             </a>
// //                             <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 transition-all hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] hover:-translate-y-1">
// //                                 <Linkedin size={18} />
// //                             </a>
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {/* 5. Bottom Bar (Copyright & Developer Credit) */}
// //                 <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
// //                     <p className="text-xs font-medium text-slate-500">
// //                         &copy; {new Date().getFullYear()} Uni Nexus. All rights reserved.
// //                     </p>
                    
// //                     <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
// //                         Powered by 
// //                         <a 
// //                             href="#" 
// //                             target="_blank" 
// //                             rel="noopener noreferrer" 
// //                             className={`${oxanium.className} font-bold text-slate-300 transition-colors hover:text-blue-400`}
// //                         >
// //                             Easymaster IT Solutions
// //                         </a>
// //                     </p>
// //                 </div>
// //             </div>
// //         </footer>
// //     );
// // }




// 'use client';

// import Link from "next/link";
// import Image from "next/image";
// import { useState } from "react";
// import { Poppins, Oxanium, Sora } from "next/font/google";
// import { 
//     Facebook, 
//     Instagram, 
//     Linkedin, 
//     Mail, 
//     MessageCircle, 
//     Send, 
//     ShieldCheck, 
//     ChevronRight,
//     MapPin,
//     GraduationCap
// } from "lucide-react";

// const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
// const oxanium = Oxanium({ subsets: ["latin"], weight: ["500", "600", "700"] });
// const sora = Sora({ subsets: ["latin"], weight: ["500", "600", "700"] });

// export default function Footer() {
//     // --- Mouse Tracking Logic for Spotlight Effect ---
//     const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//     const [isHovering, setIsHovering] = useState(false);

//     const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
//         const rect = e.currentTarget.getBoundingClientRect();
//         setMousePosition({
//             x: e.clientX - rect.left,
//             y: e.clientY - rect.top,
//         });
//     };

//     return (
//         <footer 
//             onMouseMove={handleMouseMove}
//             onMouseEnter={() => setIsHovering(true)}
//             onMouseLeave={() => setIsHovering(false)}
//             className="relative mt-20 overflow-hidden bg-[#0f172a] pt-20 pb-8 text-slate-300 font-sans selection:bg-blue-500/30 selection:text-white border-t border-white/10"
//         >
            
//             {/* Interactive Spotlight Glow Effect */}
//             <div 
//                 className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500 ease-in-out"
//                 style={{
//                     opacity: isHovering ? 1 : 0,
//                     background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.12), transparent 40%)`
//                 }}
//             />

//             {/* Static Background Glow Effects */}
//             <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px] z-0"></div>
//             <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-600/10 blur-[100px] z-0"></div>
//             <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-blue-500/5 blur-[100px] z-0"></div>

//             {/* Main Content (Needs z-10 to stay above glows) */}
//             <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-14">
                
//                 <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 border-b border-white/10 pb-16">
                    
//                     {/* 1. Brand Info & Trust Badge (Spans 4 columns) */}
//                     <div className="lg:col-span-4 space-y-6">
//                         <Link href="/" className="inline-block transition-transform hover:scale-105 duration-300">
//                             {/* Updated Logo using Image component */}
//                             <Image 
//                                 src="/images/footer/UniNexus_Logo_darkT.png"
//                                 alt="Uni Nexus"
//                                 width={200}
//                                 height={50}
//                                 className="h-10 w-auto object-contain"
//                                 priority
//                             />
//                         </Link>
                        
//                         <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
//                             Experience a smarter way to learn, connect, and grow. The ultimate digital hub built exclusively for our campus community.
//                         </p>

//                         {/* Campus Trust Badge */}
//                         <div className="inline-flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-md">
//                             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
//                                 <ShieldCheck size={18} />
//                             </div>
//                             <div>
//                                 <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Secure Network</p>
//                                 <p className="text-[11px] text-slate-400 font-medium">Verified Students Only</p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* 2. Quick Links (Spans 2 columns) */}
//                     <div className="lg:col-span-2 space-y-6">
//                         <h4 className={`${sora.className} text-lg font-bold text-white`}>Platform</h4>
//                         <ul className="space-y-3.5">
//                             {['Campus Marketplace', 'Project Groups', 'Notes Sharing', 'Tutor Sessions'].map((item) => (
//                                 <li key={item}>
//                                     <Link href="#" className="group flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-blue-400">
//                                         <ChevronRight size={14} className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-blue-500" />
//                                         <span className="-ml-4 transition-all group-hover:ml-0">{item}</span>
//                                     </Link>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>

//                     {/* 3. Legal & Policies (Spans 3 columns) */}
//                     <div className="lg:col-span-3 space-y-6">
//                         <h4 className={`${sora.className} text-lg font-bold text-white`}>Support & Legal</h4>
//                         <ul className="space-y-3.5">
//                             {['About Us', 'Contact Support', 'Terms & Conditions', 'Privacy Policy', 'Safety Guidelines'].map((item) => (
//                                 <li key={item}>
//                                     <Link href="#" className="group flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-blue-400">
//                                         <ChevronRight size={14} className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-blue-500" />
//                                         <span className="-ml-4 transition-all group-hover:ml-0">{item}</span>
//                                     </Link>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>

//                     {/* 4. Contact & Social (Spans 3 columns) */}
//                     <div className="lg:col-span-3 space-y-6">
//                         <h4 className={`${sora.className} text-lg font-bold text-white`}>Get in Touch</h4>
                        
//                         <div className="space-y-4">
//                             <a href="mailto:support@uninexus.com" className="flex items-center gap-3 text-sm font-medium text-slate-400 transition-colors hover:text-white">
//                                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-blue-400 transition-colors hover:bg-blue-500/20">
//                                     <Mail size={16} />
//                                 </div>
//                                 support@uninexus.com
//                             </a>
//                             <div className="flex items-center gap-3 text-sm font-medium text-slate-400">
//                                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-blue-400">
//                                     <MapPin size={16} />
//                                 </div>
//                                 Colombo, Sri Lanka
//                             </div>
//                         </div>

//                         {/* Social Icons */}
//                         <div className="flex gap-3 pt-2">
//                             <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 transition-all hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] hover:-translate-y-1 hover:shadow-[0_4px_15px_rgba(24,119,242,0.4)]">
//                                 <Facebook size={18} />
//                             </a>
//                             <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 transition-all hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:border-transparent hover:-translate-y-1 hover:shadow-[0_4px_15px_rgba(220,39,67,0.4)]">
//                                 <Instagram size={18} />
//                             </a>
//                             <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 transition-all hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] hover:-translate-y-1 hover:shadow-[0_4px_15px_rgba(10,102,194,0.4)]">
//                                 <Linkedin size={18} />
//                             </a>
//                         </div>
//                     </div>
//                 </div>

//                 {/* 5. Bottom Bar (Copyright & Developer Credit) */}
//                 <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
//                     <p className="text-xs font-medium text-slate-500">
//                         &copy; {new Date().getFullYear()} Uni Nexus. All rights reserved.
//                     </p>
                    
//                     <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
//                         Powered by 
//                         <a 
//                             href="#" 
//                             target="_blank" 
//                             rel="noopener noreferrer" 
//                             className={`${oxanium.className} font-bold text-slate-300 transition-colors hover:text-blue-400`}
//                         >
//                             Easymaster IT Solutions
//                         </a>
//                     </p>
//                 </div>
//             </div>
//         </footer>
//     );
// }






'use client';

import Link from "next/link";
import Image from "next/image";
import { Oxanium } from "next/font/google";
import { 
    Facebook, 
    Instagram, 
    Linkedin, 
    Mail, 
    ShieldCheck, 
    ChevronRight,
    MapPin
} from "lucide-react";

const oxanium = Oxanium({ subsets: ["latin"], weight: ["500", "600", "700"] });

export default function Footer() {
    return (
        <footer 
            className={`${oxanium.className} relative mt-20 overflow-hidden border-t border-white/10 bg-gradient-to-br from-[#0b1227] via-[#111b3a] to-[#0c1f3a] pt-20 pb-8 text-slate-300 antialiased selection:bg-blue-500/30 selection:text-white`}
        >
            <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
                <Image
                    src="/images/footer/footer_BG.png"
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover object-center opacity-40"
                />
            </div>
            
            {/* Animated Background Effect */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl animate-[spin_28s_linear_infinite]" />
                <div className="absolute -bottom-40 right-[-120px] h-[28rem] w-[28rem] rounded-full bg-cyan-400/12 blur-3xl animate-[spin_38s_linear_infinite_reverse]" />
                <div className="absolute top-1/3 left-1/3 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />
            </div>

            {/* Static Background Glow Effects */}
            <div className="pointer-events-none absolute -top-40 left-1/2 z-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]"></div>
            <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-64 w-64 rounded-full bg-indigo-600/10 blur-[100px]"></div>
            <div className="pointer-events-none absolute bottom-0 right-0 z-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]"></div>

            {/* Main Content (Needs z-10 to stay above glows) */}
            <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-14">
                
                <div className="grid gap-12 border-b border-white/10 pb-16 lg:grid-cols-12 lg:gap-8">
                    
                    {/* 1. Brand Info & Trust Badge (Spans 4 columns) */}
                    <div className="space-y-6 lg:col-span-4">
                        <Link href="/" className="-ml-7 inline-flex w-full justify-start transition-transform duration-300 hover:scale-105 md:-ml-10">
                            {/* Updated Logo using Image component, dramatically enlarged */}
                            <Image 
                                src="/images/footer/UniNexus_Logo_darkT.png"
                                alt="Uni Nexus"
                                width={420}
                                height={120}
                                className="h-24 w-auto object-contain object-left"
                                priority
                            />
                        </Link>
                        
                        <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
                            Experience a smarter way to learn, connect, and grow. The ultimate digital hub built exclusively for our campus community.
                        </p>

                        {/* Campus Trust Badge */}
                        <div className="inline-flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-md">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                                <ShieldCheck size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Secure Network</p>
                                <p className="text-[11px] text-slate-400 font-medium">Verified Students Only</p>
                            </div>
                        </div>
                    </div>

                    {/* 2. Quick Links (Spans 2 columns) */}
                    <div className="space-y-6 lg:col-span-2">
                        <h4 className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-lg font-bold text-transparent">Platform</h4>
                        <ul className="space-y-3.5">
                            {['Campus Marketplace', 'Project Groups', 'Notes Sharing', 'Tutor Sessions'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="group flex items-center gap-2 text-sm font-medium text-slate-300 transition-all hover:translate-x-1 hover:text-cyan-300">
                                        <ChevronRight size={14} className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-blue-500" />
                                        <span className="-ml-4 transition-all group-hover:ml-0">{item}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3. Legal & Policies (Spans 3 columns) */}
                    <div className="space-y-6 lg:col-span-3">
                        <h4 className="bg-gradient-to-r from-violet-200 to-blue-200 bg-clip-text text-lg font-bold text-transparent">Support & Legal</h4>
                        <ul className="space-y-3.5">
                            {['About Us', 'Contact Support', 'Terms & Conditions', 'Privacy Policy', 'Safety Guidelines'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="group flex items-center gap-2 text-sm font-medium text-slate-300 transition-all hover:translate-x-1 hover:text-cyan-300">
                                        <ChevronRight size={14} className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-blue-500" />
                                        <span className="-ml-4 transition-all group-hover:ml-0">{item}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 4. Contact & Social (Spans 3 columns) */}
                    <div className="space-y-6 lg:col-span-3">
                        <h4 className="bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-lg font-bold text-transparent">Get in Touch</h4>
                        
                        <div className="space-y-4">
                            <a href="mailto:support@uninexus.com" className="flex items-center gap-3 text-sm font-medium text-slate-300 transition-colors hover:text-white">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-blue-400 transition-colors hover:bg-blue-500/20">
                                    <Mail size={16} />
                                </div>
                                support@uninexus.com
                            </a>
                            <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-blue-400">
                                    <MapPin size={16} />
                                </div>
                                SLIIT, New Kandy Road, Malabe.
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="flex gap-3 pt-2">
                            <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 transition-all hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] hover:-translate-y-1 hover:shadow-[0_4px_15px_rgba(24,119,242,0.4)]">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 transition-all hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:border-transparent hover:-translate-y-1 hover:shadow-[0_4px_15px_rgba(220,39,67,0.4)]">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 transition-all hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] hover:-translate-y-1 hover:shadow-[0_4px_15px_rgba(10,102,194,0.4)]">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* 5. Bottom Bar (Copyright & Developer Credit) */}
                <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
                    <p className="text-xs font-medium text-slate-400">
                        &copy; {new Date().getFullYear()} Uni Nexus. All rights reserved.
                    </p>
                    
                    <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                        Powered by 
                        <a 
                            href="#" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={`${oxanium.className} font-bold text-slate-300 transition-colors hover:text-blue-400`}
                        >
                            Easymaster IT Solutions
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}