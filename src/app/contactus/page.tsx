// // // 'use client';

// // // import React, { useState } from 'react';
// // // import Link from 'next/link';
// // // import { 
// // //     Mail, 
// // //     Phone, 
// // //     MapPin, 
// // //     Clock, 
// // //     Send, 
// // //     MessageSquare, 
// // //     ChevronDown,
// // //     Facebook,
// // //     Instagram,
// // //     Linkedin,
// // //     MessageCircle, // Using MessageCircle for Discord as an alternative
// // //     ArrowRight,
// // //     Sparkles,
// // //     CheckCircle2
// // // } from 'lucide-react';

// // // const faqs = [
// // //     {
// // //         question: "Who can use Uni Nexus?",
// // //         answer: "Currently, Uni Nexus is an exclusive platform. Only verified university students with a valid student ID or university email can access the full features."
// // //     },
// // //     {
// // //         question: "Is the Campus Marketplace safe?",
// // //         answer: "Yes! Because access is restricted to verified students, you are dealing directly with your peers. However, we always recommend meeting on campus to exchange items."
// // //     },
// // //     {
// // //         question: "Are the services free to use?",
// // //         answer: "The core platform—including notes sharing and finding project groups—is completely free. Some premium freelance gigs or specialized tutor sessions may involve student-to-student payments."
// // //     },
// // //     {
// // //         question: "I found a bug on the website. How do I report it?",
// // //         answer: "Awesome, we love bug hunters! Please use the contact form above, select 'Technical Support & Bug Report', and give us a brief description of the issue."
// // //     }
// // // ];

// // // const contactReasons = [
// // //     "General inquiries about Uni Nexus",
// // //     "Technical support or reporting bugs",
// // //     "Marketplace disputes or safety concerns",
// // //     "Partnership or collaboration opportunities",
// // //     "Feedback and new feature suggestions"
// // // ];

// // // export default function ContactPage() {
// // //     const [activeFaq, setActiveFaq] = useState<number | null>(null);

// // //     const toggleFaq = (index: number) => {
// // //         setActiveFaq(activeFaq === index ? null : index);
// // //     };

// // //     return (
// // //         <main className="relative min-h-screen bg-[#f8fafc] text-slate-800 selection:bg-blue-200 selection:text-blue-900 overflow-hidden font-sans">
// // //             {/* Soft Background Mesh Gradients */}
// // //             <div className="absolute top-0 -left-40 w-[500px] h-[500px] bg-blue-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse transition-all duration-1000"></div>
// // //             <div className="absolute top-40 -right-40 w-[500px] h-[500px] bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse delay-700 transition-all duration-1000"></div>
// // //             <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-pulse delay-1000 transition-all duration-1000"></div>

// // //             <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-16 md:px-8 md:py-24 space-y-24">
                
// // //                 {/* Hero Section */}
// // //                 <section className="text-center max-w-3xl mx-auto space-y-6">
// // //                     <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
// // //                         <MessageSquare size={16} className="text-blue-500" />
// // //                         <span>Get in Touch</span>
// // //                     </div>
// // //                     <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 md:text-6xl pb-2">
// // //                         We're here to help.
// // //                     </h1>
// // //                     <p className="text-lg text-slate-600 leading-relaxed">
// // //                         Have questions, feedback, or a brilliant idea? Whether you need technical support, want to report an issue, or explore partnership opportunities, the Uni Nexus team is just a message away.
// // //                     </p>
// // //                 </section>

// // //                 {/* Main Contact Section (Grid) */}
// // //                 <section className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
                    
// // //                     {/* Left Column: Contact Info & Why Contact Us */}
// // //                     <div className="lg:col-span-2 space-y-8">
// // //                         {/* Contact Info Card */}
// // //                         <div className="rounded-3xl bg-white/60 backdrop-blur-xl border border-white/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
// // //                             <h3 className="text-2xl font-bold text-slate-900 mb-6">Direct Contact</h3>
// // //                             <div className="space-y-6">
// // //                                 <div className="flex items-start gap-4 group">
// // //                                     <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
// // //                                         <Mail size={20} />
// // //                                     </div>
// // //                                     <div>
// // //                                         <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Email</p>
// // //                                         <a href="mailto:support@uninexus.com" className="text-lg font-medium text-slate-900 hover:text-blue-600 transition-colors">support@uninexus.com</a>
// // //                                     </div>
// // //                                 </div>
// // //                                 <div className="flex items-start gap-4 group">
// // //                                     <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
// // //                                         <Phone size={20} />
// // //                                     </div>
// // //                                     <div>
// // //                                         <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Phone</p>
// // //                                         <p className="text-lg font-medium text-slate-900">+94 77 123 4567</p>
// // //                                     </div>
// // //                                 </div>
// // //                                 <div className="flex items-start gap-4 group">
// // //                                     <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
// // //                                         <MapPin size={20} />
// // //                                     </div>
// // //                                     <div>
// // //                                         <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Location</p>
// // //                                         <p className="text-base font-medium text-slate-900">Student Innovation Center,<br/>Colombo, Sri Lanka</p>
// // //                                     </div>
// // //                                 </div>
// // //                                 <div className="flex items-start gap-4 group">
// // //                                     <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
// // //                                         <Clock size={20} />
// // //                                     </div>
// // //                                     <div>
// // //                                         <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Working Hours</p>
// // //                                         <p className="text-base font-medium text-slate-900">Mon – Fri: 9:00 AM – 5:00 PM</p>
// // //                                     </div>
// // //                                 </div>
// // //                             </div>
// // //                         </div>

// // //                         {/* Why Contact Us */}
// // //                         <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-xl text-white">
// // //                             <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
// // //                                 <Sparkles size={20} className="text-blue-400" />
// // //                                 Why reach out?
// // //                             </h3>
// // //                             <ul className="space-y-4">
// // //                                 {contactReasons.map((reason, idx) => (
// // //                                     <li key={idx} className="flex items-center gap-3 text-slate-300 text-sm">
// // //                                         <CheckCircle2 size={16} className="text-blue-400 flex-shrink-0" />
// // //                                         <span>{reason}</span>
// // //                                     </li>
// // //                                 ))}
// // //                             </ul>
// // //                         </div>
// // //                     </div>

// // //                     {/* Right Column: Contact Form */}
// // //                     <div className="lg:col-span-3 rounded-[2.5rem] bg-white p-8 md:p-12 shadow-[0_20px_60px_rgba(15,23,42,0.08)] border border-slate-100 relative overflow-hidden">
// // //                         {/* Decorative blur inside form */}
// // //                         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full filter blur-[80px] opacity-70 pointer-events-none"></div>
                        
// // //                         <div className="relative z-10">
// // //                             <h2 className="text-3xl font-bold text-slate-900 mb-2">Send us a message</h2>
// // //                             <p className="text-slate-500 mb-8">Fill out the form below, and our team will get back to you within 24–48 hours.</p>

// // //                             <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
// // //                                 <div className="grid md:grid-cols-2 gap-6">
// // //                                     {/* Name */}
// // //                                     <div className="space-y-2">
// // //                                         <label htmlFor="name" className="text-sm font-semibold text-slate-700">Full Name</label>
// // //                                         <input 
// // //                                             type="text" 
// // //                                             id="name" 
// // //                                             className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-700 placeholder:text-slate-400"
// // //                                             placeholder="John Doe"
// // //                                         />
// // //                                     </div>
// // //                                     {/* Email */}
// // //                                     <div className="space-y-2">
// // //                                         <label htmlFor="email" className="text-sm font-semibold text-slate-700">University Email</label>
// // //                                         <input 
// // //                                             type="email" 
// // //                                             id="email" 
// // //                                             className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-700 placeholder:text-slate-400"
// // //                                             placeholder="yourname@std.uni.ac.lk"
// // //                                         />
// // //                                     </div>
// // //                                 </div>

// // //                                 {/* Category Dropdown */}
// // //                                 <div className="space-y-2">
// // //                                     <label htmlFor="category" className="text-sm font-semibold text-slate-700">What is this regarding?</label>
// // //                                     <div className="relative">
// // //                                         <select 
// // //                                             id="category" 
// // //                                             className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-700 appearance-none cursor-pointer"
// // //                                             defaultValue=""
// // //                                         >
// // //                                             <option value="" disabled>Select a category...</option>
// // //                                             <option value="general">General Inquiry</option>
// // //                                             <option value="marketplace">Marketplace Issue / Dispute</option>
// // //                                             <option value="technical">Technical Support & Bug Report</option>
// // //                                             <option value="partnership">Partnerships & Collaborations</option>
// // //                                         </select>
// // //                                         <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
// // //                                     </div>
// // //                                 </div>

// // //                                 {/* Subject */}
// // //                                 <div className="space-y-2">
// // //                                     <label htmlFor="subject" className="text-sm font-semibold text-slate-700">Subject</label>
// // //                                     <input 
// // //                                         type="text" 
// // //                                         id="subject" 
// // //                                         className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-700 placeholder:text-slate-400"
// // //                                         placeholder="How can we help you?"
// // //                                     />
// // //                                 </div>

// // //                                 {/* Message */}
// // //                                 <div className="space-y-2">
// // //                                     <label htmlFor="message" className="text-sm font-semibold text-slate-700">Message</label>
// // //                                     <textarea 
// // //                                         id="message" 
// // //                                         rows={5}
// // //                                         className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-700 placeholder:text-slate-400 resize-none"
// // //                                         placeholder="Write your message here..."
// // //                                     ></textarea>
// // //                                 </div>

// // //                                 {/* Submit Button */}
// // //                                 <button 
// // //                                     type="submit" 
// // //                                     className="w-full group relative flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-4 font-bold text-white transition-all hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5"
// // //                                 >
// // //                                     <span>Send Message</span>
// // //                                     <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
// // //                                 </button>
// // //                             </form>
// // //                         </div>
// // //                     </div>
// // //                 </section>

// // //                 {/* FAQ Section */}
// // //                 <section className="max-w-3xl mx-auto space-y-8">
// // //                     <div className="text-center">
// // //                         <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
// // //                         <p className="mt-4 text-slate-500">Quick answers to common questions about Uni Nexus.</p>
// // //                     </div>
                    
// // //                     <div className="space-y-4">
// // //                         {faqs.map((faq, index) => (
// // //                             <div 
// // //                                 key={index} 
// // //                                 className={`rounded-2xl border transition-all duration-300 overflow-hidden ${activeFaq === index ? 'bg-white border-blue-200 shadow-md' : 'bg-white/50 border-white/60 hover:bg-white hover:border-blue-100'}`}
// // //                             >
// // //                                 <button 
// // //                                     onClick={() => toggleFaq(index)}
// // //                                     className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
// // //                                 >
// // //                                     <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
// // //                                     <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeFaq === index ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
// // //                                         <ChevronDown size={18} className={`transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`} />
// // //                                     </div>
// // //                                 </button>
// // //                                 <div 
// // //                                     className={`px-6 transition-all duration-300 ease-in-out ${activeFaq === index ? 'pb-5 opacity-100 max-h-40' : 'max-h-0 opacity-0 overflow-hidden'}`}
// // //                                 >
// // //                                     <p className="text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">
// // //                                         {faq.answer}
// // //                                     </p>
// // //                                 </div>
// // //                             </div>
// // //                         ))}
// // //                     </div>
// // //                 </section>

// // //                 {/* Social & CTA Section */}
// // //                 <section className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-10 md:p-16 text-center shadow-2xl">
// // //                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
// // //                     <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>
// // //                     <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>
                    
// // //                     <div className="relative z-10 max-w-2xl mx-auto space-y-10">
                        
// // //                         {/* Socials */}
// // //                         <div className="space-y-4">
// // //                             <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">Stay Connected</p>
// // //                             <div className="flex justify-center gap-4">
// // //                                 {[Facebook, Instagram, Linkedin, MessageCircle].map((Icon, idx) => (
// // //                                     <a key={idx} href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all hover:scale-110">
// // //                                         <Icon size={20} />
// // //                                     </a>
// // //                                 ))}
// // //                             </div>
// // //                         </div>

// // //                         <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

// // //                         <div className="space-y-8">
// // //                             <div>
// // //                                 <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">Ready to explore Uni Nexus?</h2>
// // //                                 <p className="text-blue-200 font-medium tracking-widest uppercase text-sm">Learn. Connect. Build. Earn.</p>
// // //                             </div>
                            
// // //                             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
// // //                                 <Link href="/register" className="group flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-slate-900 transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] w-full sm:w-auto">
// // //                                     Join Now
// // //                                     <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
// // //                                 </Link>
// // //                                 <Link href="/" className="flex items-center justify-center rounded-full border border-slate-600 bg-slate-800/50 backdrop-blur-sm px-8 py-4 font-semibold text-white transition-all hover:bg-slate-800 w-full sm:w-auto">
// // //                                     Back to Home
// // //                                 </Link>
// // //                             </div>
// // //                         </div>
// // //                     </div>
// // //                 </section>

// // //             </div>
// // //         </main>
// // //     );
// // // }












// // 'use client';

// // import Link from "next/link";
// // import Image from "next/image";
// // import { Poppins, Oxanium, Sora } from "next/font/google";
// // import Navbar from "@/components/Navbar";
// // import { useState, useRef, useEffect } from "react";
// // import {
// //     Mail,
// //     Phone,
// //     MapPin,
// //     Send,
// //     MessageSquare,
// //     ChevronDown,
// //     Facebook,
// //     Instagram,
// //     Linkedin,
// //     ArrowRight,
// //     CheckCircle2,
// //     Clock,
// //     HelpCircle,
// //     AlertCircle
// // } from "lucide-react";

// // const poppins = Poppins({
// //     subsets: ["latin"],
// //     weight: ["400", "500", "600", "700", "800"],
// // });

// // const oxanium = Oxanium({
// //     subsets: ["latin"],
// //     weight: ["400", "500", "600", "700"],
// // });

// // const sora = Sora({
// //     subsets: ["latin"],
// //     weight: ["500", "600", "700"],
// // });

// // const faqs = [
// //     {
// //         question: "Who can use Uni Nexus?",
// //         answer: "Currently, Uni Nexus is an exclusive platform. Only verified university students with a valid student ID or university email can access the full features."
// //     },
// //     {
// //         question: "Is the Campus Marketplace safe?",
// //         answer: "Yes! Because access is restricted to verified students, you are dealing directly with your peers. However, we always recommend meeting on campus to exchange items."
// //     },
// //     {
// //         question: "Are the services free to use?",
// //         answer: "The core platform—including notes sharing and finding project groups—is completely free. Some premium freelance gigs or specialized tutor sessions may involve student-to-student payments."
// //     },
// //     {
// //         question: "How can I report a technical issue?",
// //         answer: "Please use the contact form above, select 'Technical Support & Bug Report', and give us a brief description of the issue. Our team will look into it within 24 hours."
// //     }
// // ];

// // export default function ContactPage() {
// //     const [activeFaq, setActiveFaq] = useState<number | null>(null);

// //     const toggleFaq = (index: number) => {
// //         setActiveFaq(activeFaq === index ? null : index);
// //     };

// //     // --- Form Validation & Dropdown States ---
// //     const [formData, setFormData] = useState({ name: "", email: "", category: "", message: "" });
// //     const [errors, setErrors] = useState({ name: "", email: "", category: "", message: "" });
// //     const [isSubmitting, setIsSubmitting] = useState(false);
    
// //     // Custom Dropdown Logic
// //     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
// //     const dropdownRef = useRef<HTMLDivElement>(null);
// //     const categoryOptions = ["General Inquiry", "Marketplace Issue", "Technical Support", "Partnership"];

// //     useEffect(() => {
// //         function handleClickOutside(event: MouseEvent) {
// //             if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
// //                 setIsDropdownOpen(false);
// //             }
// //         }
// //         document.addEventListener("mousedown", handleClickOutside);
// //         return () => document.removeEventListener("mousedown", handleClickOutside);
// //     }, []);

// //     const validateForm = () => {
// //         let newErrors = { name: "", email: "", category: "", message: "" };
// //         let isValid = true;

// //         if (!formData.name.trim()) {
// //             newErrors.name = "Full name is required";
// //             isValid = false;
// //         }

// //         if (!formData.email.trim()) {
// //             newErrors.email = "Email is required";
// //             isValid = false;
// //         } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
// //             newErrors.email = "Please enter a valid email format";
// //             isValid = false;
// //         }

// //         if (!formData.category) {
// //             newErrors.category = "Please select a subject category";
// //             isValid = false;
// //         }

// //         if (!formData.message.trim()) {
// //             newErrors.message = "Message cannot be empty";
// //             isValid = false;
// //         }

// //         setErrors(newErrors);
// //         return isValid;
// //     };

// //     const handleSubmit = (e: React.FormEvent) => {
// //         e.preventDefault();
// //         if (validateForm()) {
// //             setIsSubmitting(true);
// //             // Simulate Backend API Call
// //             setTimeout(() => {
// //                 alert("Message Sent Successfully!");
// //                 setIsSubmitting(false);
// //                 setFormData({ name: "", email: "", category: "", message: "" });
// //             }, 1500);
// //         }
// //     };

// //     return (
// //         <>
// //         <Navbar />
// //         <main className="relative min-h-screen bg-[#f8fafc] text-slate-800 selection:bg-blue-200 selection:text-blue-900 overflow-hidden font-sans">
// //             {/* Soft Background Mesh Gradients */}
// //             <div className="absolute top-0 -left-40 w-[500px] h-[500px] bg-blue-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob"></div>
// //             <div className="absolute top-0 -right-40 w-[500px] h-[500px] bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
// //             <div className="absolute -bottom-40 left-20 w-[600px] h-[600px] bg-purple-200/50 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-blob animation-delay-4000"></div>

// //             <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-0 md:px-8 md:pb-24 md:pt-0 space-y-24">
                
// //                 {/* 1. Hero Section (Reversed Layout) */}
// //                 <section className={`${oxanium.className} relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden border-y border-white/70 bg-gradient-to-r from-white/62 via-slate-50/55 to-blue-50/52 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.09)] backdrop-blur-xl md:p-10 lg:px-14`}>
// //                     <div className="pointer-events-none absolute inset-0 opacity-30">
// //                         <Image
// //                             src="/images/contactus/contactus_hero_BG.png" // Reusing your beautiful background
// //                             alt=""
// //                             fill
// //                             aria-hidden="true"
// //                             className="object-cover object-center"
// //                         />
// //                     </div>
// //                     <div className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-blue-200/40 blur-3xl" />
// //                     <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl" />

// //                     {/* Grid: Image Left (1.22fr), Text Right (0.78fr) */}
// //                     <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                        
// //                         {/* LEFT SIDE: Image & Floating Cards */}
// //                         <div className="order-2 lg:order-1 relative -mb-6 min-h-[420px] md:-mb-10 md:min-h-[520px] lg:-ml-6 lg:w-full lg:self-end">
        
// //                             {/* මෙතන තිබ්බ 'overflow-hidden' අයින් කළා, එතකොට image එක ලොකු වුණාම ඔළුව කැපෙන්නේ නෑ */}
// //                             <div className="absolute inset-x-0 bottom-0 h-full">
// //                                 <Image
// //                                     src="/images/contactus/contactus_hero.png" 
// //                                     alt="Contact Uni Nexus Support"
// //                                     fill
// //                                     priority
// //                                     // scale-[1.35] දීලා image එක 35% කින් zoom කරලා උඩට ගත්තා
// //                                     className="origin-bottom object-contain object-bottom scale-110 md:scale-125 lg:scale-[1.35] transition-all duration-300"
// //                                 />
// //                             </div>

// //                             {/* Overlay Card A */}
// //                             <div className="hero-overlay-card hero-card-a absolute bottom-5 left-3 z-20 w-[60%] rounded-3xl p-5 md:left-5 md:w-[56%]">
// //                                 <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Support Center</p>
// //                                 <p className="mt-2 text-lg font-bold text-slate-900">Always here to help.</p>
// //                                 <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-3 py-1.5 text-xs font-bold text-blue-800">
// //                                     <Clock size={14} /> Response in 24 hrs
// //                                 </div>
// //                             </div>

// //                             {/* Overlay Card B */}
// //                             <div className="hero-overlay-card hero-card-b absolute bottom-16 right-3 z-20 w-[55%] rounded-2xl p-4 md:right-5 md:w-[50%]">
// //                                 <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Status</p>
// //                                 <p className="mt-1 text-sm font-semibold text-slate-800 flex items-center gap-2">
// //                                     <span className="relative flex h-2.5 w-2.5">
// //                                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
// //                                         <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
// //                                     </span>
// //                                     All Systems Operational
// //                                 </p>
// //                             </div>
// //                         </div>

// //                         {/* RIGHT SIDE: Text Content */}
// //                         <div className="order-1 lg:order-2 space-y-6 lg:pl-10 lg:pb-12">
                            

// //                             <h1 className={`${poppins.className} hero-title-effect font-extrabold leading-tight tracking-tight text-transparent bg-clip-text`}>
// //                                 <span className="block text-5xl ">
// //                                     We're Here to Help,
// //                                 </span>
// //                                 <span className="block text-5xl md:text-7xl">
// //                                     Let's Connect.
// //                                 </span>
// //                             </h1>

// //                              <Image
// //                                 src="/images/contactus/UniNexus_Logo_lightT.png"
// //                                 alt="UniNexus"
// //                                 width={280}
// //                                 height={56}
// //                                 className="-ml-2 h-12 w-auto md:-ml-4 md:h-14"
// //                                 priority
// //                             />

// //                             <p className="typing-line max-w-xl text-base leading-relaxed text-slate-600 md:text-lg font-medium">
// //                                 Have questions, feedback, or need support? We’re just a message away.
// //                             </p>

// //                             <div className="flex flex-wrap items-center gap-3 pt-4">
// //                                 <a href="#contact-form" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-lg shadow-slate-900/20">
// //                                     Send a Message
// //                                     <ArrowRight size={16} />
// //                                 </a>
// //                                 <a href="#faq" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/60 px-6 py-3.5 text-sm font-semibold text-slate-700 backdrop-blur-md transition hover:border-blue-300 hover:text-blue-700">
// //                                     <HelpCircle size={16} />
// //                                     Read FAQs
// //                                 </a>
// //                             </div>
// //                         </div>

// //                     </div>
// //                 </section>

// //                 {/* 2. Contact Grid Section (Info + Form) */}
// //                 <section id="contact-form" className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
                    
// //                     {/* Left: Contact Info (Using About Us Card Styles) */}
// //                     <div className="space-y-6">
// //                         <div className="space-y-3 mb-8">
// //                             <div className="inline-flex items-center gap-3">
// //                                 <span className="h-[2px] w-10 bg-gradient-to-r from-blue-500 to-indigo-500" />
// //                                 <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Reach Out</span>
// //                             </div>
// //                             <h2 className={`${sora.className} text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-800 to-blue-700 md:text-4xl`}>
// //                                 Direct Contact
// //                             </h2>
// //                             <p className="text-slate-600 leading-relaxed">
// //                                 Prefer reaching out directly? Here are our official communication channels.
// //                             </p>
// //                         </div>

// //                         {/* Info Cards */}
// //                         <div className="group relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white/80 via-white/65 to-blue-50/45 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(37,99,235,0.14)]">
// //                             <div className="flex items-center gap-4">
// //                                 <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg">
// //                                     <Mail size={20} />
// //                                 </div>
// //                                 <div>
// //                                     <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Email Support</p>
// //                                     <a href="mailto:support@uninexus.com" className={`${oxanium.className} text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors`}>support@uninexus.com</a>
// //                                 </div>
// //                             </div>
// //                         </div>

// //                         <div className="group relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white/80 via-white/65 to-indigo-50/45 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(79,70,229,0.14)]">
// //                             <div className="flex items-center gap-4">
// //                                 <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg">
// //                                     <Phone size={20} />
// //                                 </div>
// //                                 <div>
// //                                     <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Phone</p>
// //                                     <p className={`${oxanium.className} text-lg font-bold text-slate-900`}>+94 77 123 4567</p>
// //                                 </div>
// //                             </div>
// //                         </div>

// //                         <div className="group relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white/80 via-white/65 to-emerald-50/45 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(16,185,129,0.14)]">
// //                             <div className="flex items-center gap-4">
// //                                 <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow-lg">
// //                                     <MapPin size={20} />
// //                                 </div>
// //                                 <div>
// //                                     <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Location</p>
// //                                     <p className={`${oxanium.className} text-lg font-bold text-slate-900`}>Colombo, Sri Lanka</p>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     </div>

// //                     {/* Right: Contact Form (Glassmorphism style) */}
// //                     <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/60 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl md:p-10">
// //                         <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-200/40 blur-3xl" />
// //                         <div className="pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-violet-200/30 blur-3xl" />

// //                         <div className="relative z-10 space-y-8">
// //                             <div>
// //                                 <h3 className={`${sora.className} text-2xl font-bold text-slate-900`}>Send us a message</h3>
// //                                 <p className="mt-2 text-sm text-slate-500">We'll get back to you within 24–48 hours.</p>
// //                             </div>

// //                             <form className="space-y-5" onSubmit={handleSubmit}>
// //                                 <div className="grid gap-5 md:grid-cols-2">
// //                                     {/* Name */}
// //                                     <div className="space-y-1.5">
// //                                         <label htmlFor="name" className="text-xs font-bold uppercase tracking-wide text-slate-600">Full Name</label>
// //                                         <input 
// //                                             type="text" id="name" value={formData.name}
// //                                             onChange={(e) => { setFormData({...formData, name: e.target.value}); if (errors.name) setErrors({...errors, name: ''}); }}
// //                                             className={`w-full rounded-xl border bg-white/70 px-4 py-3.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 ${errors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200/80 focus:border-blue-500 focus:ring-blue-500/10'}`}
// //                                             placeholder="John Doe"
// //                                         />
// //                                         {errors.name && <p className="flex items-center gap-1 text-xs font-medium text-red-500"><AlertCircle size={12}/> {errors.name}</p>}
// //                                     </div>

// //                                     {/* Email */}
// //                                     <div className="space-y-1.5">
// //                                         <label htmlFor="email" className="text-xs font-bold uppercase tracking-wide text-slate-600">University Email</label>
// //                                         <input 
// //                                             type="email" id="email" value={formData.email}
// //                                             onChange={(e) => { setFormData({...formData, email: e.target.value}); if (errors.email) setErrors({...errors, email: ''}); }}
// //                                             className={`w-full rounded-xl border bg-white/70 px-4 py-3.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200/80 focus:border-blue-500 focus:ring-blue-500/10'}`}
// //                                             placeholder="you@std.uni.ac.lk"
// //                                         />
// //                                         {errors.email && <p className="flex items-center gap-1 text-xs font-medium text-red-500"><AlertCircle size={12}/> {errors.email}</p>}
// //                                     </div>
// //                                 </div>

// //                                 {/* Category */}
// //                                 <div className="space-y-1.5" ref={dropdownRef}>
// //                                     <label className="text-xs font-bold uppercase tracking-wide text-slate-600">Subject Category</label>
// //                                     <div className="relative">
// //                                         <div 
// //                                             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
// //                                             className={`flex w-full cursor-pointer items-center justify-between rounded-xl border bg-white/70 px-4 py-3.5 text-sm outline-none transition-all focus:bg-white focus:ring-4 ${errors.category ? 'border-red-400 focus:ring-red-500/10' : 'border-slate-200/80 hover:border-blue-300'} ${isDropdownOpen ? 'border-blue-500 bg-white ring-4 ring-blue-500/10' : ''}`}
// //                                         >
// //                                             <span className={formData.category ? 'text-slate-800' : 'text-slate-400'}>
// //                                                 {formData.category || "Select an option..."}
// //                                             </span>
// //                                             <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-blue-500' : ''}`} />
// //                                         </div>
// //                                         <div className={`absolute left-0 top-full z-50 mt-2 w-full origin-top transform overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-200 ${isDropdownOpen ? 'scale-y-100 opacity-100' : 'scale-y-95 opacity-0 pointer-events-none'}`}>
// //                                             {categoryOptions.map((option, idx) => (
// //                                                 <div 
// //                                                     key={idx}
// //                                                     onClick={() => { setFormData({...formData, category: option}); setErrors({...errors, category: ''}); setIsDropdownOpen(false); }}
// //                                                     className={`cursor-pointer px-4 py-3 text-sm transition-colors hover:bg-blue-50 hover:text-blue-700 ${formData.category === option ? 'bg-blue-50/50 font-semibold text-blue-700' : 'text-slate-700'}`}
// //                                                 >
// //                                                     {option}
// //                                                 </div>
// //                                             ))}
// //                                         </div>
// //                                     </div>
// //                                     {errors.category && <p className="flex items-center gap-1 text-xs font-medium text-red-500"><AlertCircle size={12}/> {errors.category}</p>}
// //                                 </div>

// //                                 {/* Message */}
// //                                 <div className="space-y-1.5">
// //                                     <label htmlFor="message" className="text-xs font-bold uppercase tracking-wide text-slate-600">Message</label>
// //                                     <textarea 
// //                                         id="message" rows={4} value={formData.message}
// //                                         onChange={(e) => { setFormData({...formData, message: e.target.value}); if (errors.message) setErrors({...errors, message: ''}); }}
// //                                         className={`w-full resize-none rounded-xl border bg-white/70 px-4 py-3.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 ${errors.message ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200/80 focus:border-blue-500 focus:ring-blue-500/10'}`}
// //                                         placeholder="How can we help you today?"
// //                                     ></textarea>
// //                                     {errors.message && <p className="flex items-center gap-1 text-xs font-medium text-red-500"><AlertCircle size={12}/> {errors.message}</p>}
// //                                 </div>

// //                                 <button type="submit" disabled={isSubmitting} className="group relative w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] hover:shadow-blue-500/40 active:scale-95 disabled:opacity-70 disabled:hover:scale-100">
// //                                     {isSubmitting ? "Sending..." : "Send Message"}
// //                                     {!isSubmitting && <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
// //                                 </button>
// //                             </form>
// //                         </div>
// //                     </div>
// //                 </section>

// //                 {/* 4. CTA Section (Exact Match to About Us) */}
// //                 <section className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-10 md:p-16 text-center shadow-2xl mt-10">
// //                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
// //                     <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>
// //                     <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>
                    
// //                     <div className="relative z-10 max-w-2xl mx-auto space-y-10">
                        
// //                         <div className="space-y-4">
// //                             <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">Join the Community</p>
// //                             <div className="flex justify-center gap-4">
// //                                 {[Facebook, Instagram, Linkedin].map((Icon, idx) => (
// //                                     <a key={idx} href="#" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:scale-110 hover:bg-white hover:text-slate-900">
// //                                         <Icon size={20} />
// //                                     </a>
// //                                 ))}
// //                             </div>
// //                         </div>

// //                         <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

// //                         <div className="space-y-8">
// //                             <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Ready to join the network?</h2>
// //                             <p className="text-xl text-slate-300">
// //                                 Experience a smarter way to learn, connect, and grow within your campus.
// //                             </p>
// //                             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
// //                                 <Link href="/register" className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-slate-900 transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]">
// //                                     Get Started Today
// //                                     <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
// //                                 </Link>
// //                                 <Link href="/" className="flex w-full sm:w-auto items-center justify-center rounded-full border border-slate-600 bg-slate-800/50 backdrop-blur-sm px-8 py-4 font-semibold text-white transition-all hover:bg-slate-800">
// //                                     Back to Home
// //                                 </Link>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </section>
                
// //                 {/* Animations matching About Us */}
// //                 <style jsx>{`
// //                     .hero-mini-pill {
// //                         border: 1px solid rgba(255, 255, 255, 0.7);
// //                         background: linear-gradient(135deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.42));
// //                         box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75), 0 6px 16px rgba(15, 23, 42, 0.08);
// //                         backdrop-filter: blur(10px) saturate(150%);
// //                         -webkit-backdrop-filter: blur(10px) saturate(150%);
// //                         border-radius: 0.75rem;
// //                         padding: 0.5rem 0.75rem;
// //                         font-weight: 600;
// //                     }

// //                     .hero-title-effect {
// //                         background-image: linear-gradient(
// //                             115deg,
// //                             #1d4ed8 0%,
// //                             #38bdf8 24%,
// //                             #facc15 46%,
// //                             #f97316 68%,
// //                             #6366f1 84%,
// //                             #22d3ee 100%
// //                         );
// //                         background-size: 260% 260%;
// //                         animation: titleGradientFlow 4s ease-in-out infinite, titleGlowPulse 2.4s ease-in-out infinite;
// //                         filter: drop-shadow(0 8px 22px rgba(29, 78, 216, 0.3));
// //                     }

// //                     .typing-line {
// //                         display: block;
// //                         overflow: hidden;
// //                         clip-path: inset(0 100% 0 0);
// //                         animation: typingReveal 3.8s steps(80, end) 0.35s forwards;
// //                     }

// //                     @media (max-width: 768px) {
// //                         .typing-line {
// //                             animation: fadeIn 0.8s ease-out 0.2s both;
// //                             clip-path: none;
// //                         }
// //                     }

// //                     .hero-overlay-card {
// //                         will-change: opacity, transform;
// //                         animation-duration: 10s;
// //                         animation-timing-function: ease-in-out;
// //                         animation-iteration-count: infinite;
// //                         border: 1px solid rgba(255, 255, 255, 0.52);
// //                         background: linear-gradient(135deg, rgba(255, 255, 255, 0.58), rgba(255, 255, 255, 0.24));
// //                         box-shadow: 0 18px 40px rgba(15, 23, 42, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.65);
// //                         backdrop-filter: blur(22px) saturate(170%);
// //                         -webkit-backdrop-filter: blur(22px) saturate(170%);
// //                     }

// //                     .hero-card-a {
// //                         animation-name: swapCardA;
// //                     }

// //                     .hero-card-b {
// //                         animation-name: swapCardB;
// //                         border-color: rgba(52, 211, 153, 0.48);
// //                         background: linear-gradient(135deg, rgba(236, 253, 245, 0.62), rgba(209, 250, 229, 0.24));
// //                     }

// //                     @keyframes typingReveal {
// //                         from { clip-path: inset(0 100% 0 0); }
// //                         to { clip-path: inset(0 0 0 0); }
// //                     }

// //                     @keyframes titleGradientFlow {
// //                         0%, 100% { background-position: 0% 50%; }
// //                         50% { background-position: 100% 50%; }
// //                     }

// //                     @keyframes titleGlowPulse {
// //                         0%, 100% { filter: drop-shadow(0 8px 22px rgba(29, 78, 216, 0.28)); }
// //                         50% { filter: drop-shadow(0 12px 30px rgba(249, 115, 22, 0.35)); }
// //                     }

// //                     @keyframes swapCardA {
// //                         0%, 45% { opacity: 1; transform: translateY(0); pointer-events: auto; }
// //                         50%, 95% { opacity: 0; transform: translateY(8px); pointer-events: none; }
// //                         100% { opacity: 1; transform: translateY(0); pointer-events: auto; }
// //                     }

// //                     @keyframes swapCardB {
// //                         0%, 45% { opacity: 0; transform: translateY(8px); pointer-events: none; }
// //                         50%, 95% { opacity: 1; transform: translateY(0); pointer-events: auto; }
// //                         100% { opacity: 0; transform: translateY(8px); pointer-events: none; }
// //                     }

// //                     @keyframes fadeIn {
// //                         from { opacity: 0; transform: translateY(4px); }
// //                         to { opacity: 1; transform: translateY(0); }
// //                     }
// //                 `}</style>

// //             </div>
// //         </main>
// //         </>
// //     );
// // }











// 'use client';

// import Link from "next/link";
// import Image from "next/image";
// import { Poppins, Oxanium, Sora } from "next/font/google";
// import Navbar from "@/components/Navbar";
// import { useState, useRef, useEffect } from "react";
// import {
//     Mail,
//     Phone,
//     MapPin,
//     Send,
//     MessageSquare,
//     ChevronDown,
//     Facebook,
//     Instagram,
//     Linkedin,
//     ArrowRight,
//     CheckCircle2,
//     Clock,
//     HelpCircle,
//     AlertCircle,
//     User,
//     AtSign,
//     Loader2
// } from "lucide-react";

// const poppins = Poppins({
//     subsets: ["latin"],
//     weight: ["400", "500", "600", "700", "800"],
// });

// const oxanium = Oxanium({
//     subsets: ["latin"],
//     weight: ["400", "500", "600", "700"],
// });

// const sora = Sora({
//     subsets: ["latin"],
//     weight: ["500", "600", "700"],
// });

// const faqs = [
//     {
//         question: "Who can use Uni Nexus?",
//         answer: "Currently, Uni Nexus is an exclusive platform. Only verified university students with a valid student ID or university email can access the full features."
//     },
//     {
//         question: "Is the Campus Marketplace safe?",
//         answer: "Yes! Because access is restricted to verified students, you are dealing directly with your peers. However, we always recommend meeting on campus to exchange items."
//     },
//     {
//         question: "Are the services free to use?",
//         answer: "The core platform—including notes sharing and finding project groups—is completely free. Some premium freelance gigs or specialized tutor sessions may involve student-to-student payments."
//     },
//     {
//         question: "How can I report a technical issue?",
//         answer: "Please use the contact form above, select 'Technical Support & Bug Report', and give us a brief description of the issue. Our team will look into it within 24 hours."
//     }
// ];

// export default function ContactPage() {
//     const [activeFaq, setActiveFaq] = useState<number | null>(null);

//     const toggleFaq = (index: number) => {
//         setActiveFaq(activeFaq === index ? null : index);
//     };

//     // --- Form Validation & Dropdown States ---
//     const [formData, setFormData] = useState({ name: "", email: "", category: "", message: "" });
//     const [errors, setErrors] = useState({ name: "", email: "", category: "", message: "" });
//     const [touched, setTouched] = useState({ name: false, email: false, category: false, message: false });
//     const [isSubmitting, setIsSubmitting] = useState(false);
    
//     // Custom Dropdown Logic
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//     const dropdownRef = useRef<HTMLDivElement>(null);
//     const categoryOptions = ["General Inquiry", "Marketplace Issue", "Technical Support", "Partnership"];

//     useEffect(() => {
//         function handleClickOutside(event: MouseEvent) {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//                 setIsDropdownOpen(false);
//             }
//         }
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     // --- Live Validation Handlers ---
//     const handleNameChange = (val: string) => {
//         setFormData(prev => ({...prev, name: val}));
//         if (touched.name) {
//             if (!val.trim()) setErrors(prev => ({...prev, name: "Full name is required"}));
//             else setErrors(prev => ({...prev, name: ""}));
//         }
//     };

//     const handleEmailChange = (val: string) => {
//         setFormData(prev => ({...prev, email: val}));
//         if (touched.email) {
//             if (!val.trim()) setErrors(prev => ({...prev, email: "Email is required"}));
//             else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val)) setErrors(prev => ({...prev, email: "Please enter a valid email format"}));
//             else setErrors(prev => ({...prev, email: ""}));
//         }
//     };

//     const handleCategoryChange = (val: string) => {
//         setFormData(prev => ({...prev, category: val}));
//         setErrors(prev => ({...prev, category: ""}));
//         setIsDropdownOpen(false);
//     };

//     const handleMessageChange = (val: string) => {
//         setFormData(prev => ({...prev, message: val}));
//         if (touched.message) {
//             if (!val.trim()) setErrors(prev => ({...prev, message: "Message cannot be empty"}));
//             else setErrors(prev => ({...prev, message: ""}));
//         }
//     };

//     const handleBlur = (field: string) => {
//         setTouched(prev => ({ ...prev, [field]: true }));
//         // Trigger validation on blur to catch empty fields immediately after leaving
//         if (field === 'name' && !formData.name.trim()) setErrors(prev => ({...prev, name: "Full name is required"}));
//         if (field === 'email') {
//             if (!formData.email.trim()) setErrors(prev => ({...prev, email: "Email is required"}));
//             else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) setErrors(prev => ({...prev, email: "Please enter a valid email format"}));
//         }
//         if (field === 'message' && !formData.message.trim()) setErrors(prev => ({...prev, message: "Message cannot be empty"}));
//     };

//     const validateForm = () => {
//         let newErrors = { name: "", email: "", category: "", message: "" };
//         let isValid = true;

//         if (!formData.name.trim()) { newErrors.name = "Full name is required"; isValid = false; }
//         if (!formData.email.trim()) { newErrors.email = "Email is required"; isValid = false; } 
//         else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) { newErrors.email = "Please enter a valid email format"; isValid = false; }
//         if (!formData.category) { newErrors.category = "Please select a subject category"; isValid = false; }
//         if (!formData.message.trim()) { newErrors.message = "Message cannot be empty"; isValid = false; }

//         setErrors(newErrors);
//         setTouched({ name: true, email: true, category: true, message: true });
//         return isValid;
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (validateForm()) {
//             setIsSubmitting(true);
//             // Simulate Backend API Call
//             setTimeout(() => {
//                 alert("Message Sent Successfully!");
//                 setIsSubmitting(false);
//                 setFormData({ name: "", email: "", category: "", message: "" });
//                 setTouched({ name: false, email: false, category: false, message: false });
//             }, 1500);
//         }
//     };

//     return (
//         <>
//         <Navbar />
//         <main className="relative min-h-screen bg-[#f8fafc] text-slate-800 selection:bg-blue-200 selection:text-blue-900 overflow-hidden font-sans">
//             {/* Soft Background Mesh Gradients */}
//             <div className="absolute top-0 -left-40 w-[500px] h-[500px] bg-blue-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob"></div>
//             <div className="absolute top-0 -right-40 w-[500px] h-[500px] bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
//             <div className="absolute -bottom-40 left-20 w-[600px] h-[600px] bg-purple-200/50 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-blob animation-delay-4000"></div>

//             <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-0 md:px-8 md:pb-24 md:pt-0 space-y-24">
                
//                 {/* 1. Hero Section (Reversed Layout) */}
//                 <section className={`${oxanium.className} relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden border-y border-white/70 bg-gradient-to-r from-white/62 via-slate-50/55 to-blue-50/52 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.09)] backdrop-blur-xl md:p-10 lg:px-14`}>
//                     <div className="pointer-events-none absolute inset-0 opacity-30">
//                         <Image
//                             src="/images/contactus/contactus_hero_BG.png" 
//                             alt=""
//                             fill
//                             aria-hidden="true"
//                             className="object-cover object-center"
//                         />
//                     </div>
//                     <div className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-blue-200/40 blur-3xl" />
//                     <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl" />

//                     {/* Grid: Image Left (1.22fr), Text Right (0.78fr) */}
//                     <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                        
//                         {/* LEFT SIDE: Image & Floating Cards */}
//                         <div className="order-2 lg:order-1 relative -mb-6 min-h-[420px] md:-mb-10 md:min-h-[520px] lg:-ml-6 lg:w-full lg:self-end">
        
//                             <div className="absolute inset-x-0 bottom-0 h-full">
//                                 <Image
//                                     src="/images/contactus/contactus_hero.png" 
//                                     alt="Contact Uni Nexus Support"
//                                     fill
//                                     priority
//                                     className="origin-bottom object-contain object-bottom scale-110 md:scale-125 lg:scale-[1.35] transition-all duration-300"
//                                 />
//                             </div>

//                             {/* Overlay Card A */}
//                             <div className="hero-overlay-card hero-card-a absolute bottom-5 left-3 z-20 w-[60%] rounded-3xl p-5 md:left-5 md:w-[56%]">
//                                 <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Support Center</p>
//                                 <p className="mt-2 text-lg font-bold text-slate-900">Always here to help.</p>
//                                 <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-3 py-1.5 text-xs font-bold text-blue-800">
//                                     <Clock size={14} /> Response in 24 hrs
//                                 </div>
//                             </div>

//                             {/* Overlay Card B */}
//                             <div className="hero-overlay-card hero-card-b absolute bottom-16 right-3 z-20 w-[55%] rounded-2xl p-4 md:right-5 md:w-[50%]">
//                                 <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Status</p>
//                                 <p className="mt-1 text-sm font-semibold text-slate-800 flex items-center gap-2">
//                                     <span className="relative flex h-2.5 w-2.5">
//                                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//                                         <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
//                                     </span>
//                                     All Systems Operational
//                                 </p>
//                             </div>
//                         </div>

//                         {/* RIGHT SIDE: Text Content */}
//                         <div className="order-1 lg:order-2 space-y-6 lg:pl-10 lg:pb-12">
                            
//                             <h1 className={`${poppins.className} hero-title-effect font-extrabold leading-tight tracking-tight text-transparent bg-clip-text`}>
//                                 <span className="block text-5xl ">
//                                     We're Here to Help,
//                                 </span>
//                                 <span className="block text-5xl md:text-7xl">
//                                     Let's Connect.
//                                 </span>
//                             </h1>

//                              <Image
//                                 src="/images/contactus/UniNexus_Logo_lightT.png"
//                                 alt="UniNexus"
//                                 width={280}
//                                 height={56}
//                                 className="-ml-2 h-12 w-auto md:-ml-4 md:h-14"
//                                 priority
//                             />

//                             <p className="typing-line max-w-xl text-base leading-relaxed text-slate-600 md:text-lg font-medium">
//                                 Have questions, feedback, or need support? We’re just a message away.
//                             </p>

//                             <div className="flex flex-wrap items-center gap-3 pt-4">
//                                 <a href="#contact-form" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-lg shadow-slate-900/20">
//                                     Send a Message
//                                     <ArrowRight size={16} />
//                                 </a>
//                                 <a href="#faq" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/60 px-6 py-3.5 text-sm font-semibold text-slate-700 backdrop-blur-md transition hover:border-blue-300 hover:text-blue-700">
//                                     <HelpCircle size={16} />
//                                     Read FAQs
//                                 </a>
//                             </div>
//                         </div>

//                     </div>
//                 </section>

//                 {/* 2. Contact Grid Section (Info + Form) */}
//                 <section id="contact-form" className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
                    
//                     {/* Left: Contact Info */}
//                     <div className="space-y-6">
//                         <div className="space-y-3 mb-8">
//                             <div className="inline-flex items-center gap-3">
//                                 <span className="h-[2px] w-10 bg-gradient-to-r from-blue-500 to-indigo-500" />
//                                 <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Reach Out</span>
//                             </div>
//                             <h2 className={`${sora.className} text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-800 to-blue-700 md:text-4xl`}>
//                                 Direct Contact
//                             </h2>
//                             <p className="text-slate-600 leading-relaxed">
//                                 Prefer reaching out directly? Here are our official communication channels.
//                             </p>
//                         </div>

//                         {/* Info Cards */}
//                         <div className="group relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white/80 via-white/65 to-blue-50/45 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(37,99,235,0.14)]">
//                             <div className="flex items-center gap-4">
//                                 <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg">
//                                     <Mail size={20} />
//                                 </div>
//                                 <div>
//                                     <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Email Support</p>
//                                     <a href="mailto:support@uninexus.com" className={`${oxanium.className} text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors`}>support@uninexus.com</a>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="group relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white/80 via-white/65 to-indigo-50/45 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(79,70,229,0.14)]">
//                             <div className="flex items-center gap-4">
//                                 <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg">
//                                     <Phone size={20} />
//                                 </div>
//                                 <div>
//                                     <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Phone</p>
//                                     <p className={`${oxanium.className} text-lg font-bold text-slate-900`}>+94 77 123 4567</p>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="group relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white/80 via-white/65 to-emerald-50/45 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(16,185,129,0.14)]">
//                             <div className="flex items-center gap-4">
//                                 <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow-lg">
//                                     <MapPin size={20} />
//                                 </div>
//                                 <div>
//                                     <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Location</p>
//                                     <p className={`${oxanium.className} text-lg font-bold text-slate-900`}>Colombo, Sri Lanka</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Right: Modern Contact Form */}
//                     <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/60 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl md:p-10">
//                         <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-200/40 blur-3xl" />
//                         <div className="pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-violet-200/30 blur-3xl" />

//                         <div className="relative z-10 space-y-8">
//                             <div>
//                                 <h3 className={`${sora.className} text-2xl font-bold text-slate-900`}>Send us a message</h3>
//                                 <p className="mt-2 text-sm text-slate-500">We'll get back to you within 24–48 hours.</p>
//                             </div>

//                             <form className="space-y-6" onSubmit={handleSubmit}>
//                                 <div className="grid gap-6 md:grid-cols-2">
//                                     {/* Name Input */}
//                                     <div className="space-y-1.5 group">
//                                         <label htmlFor="name" className={`text-[11px] font-bold uppercase tracking-wider transition-colors ml-1 ${errors.name ? 'text-red-500' : 'text-slate-500 group-focus-within:text-blue-600'}`}>Full Name</label>
//                                         <div className="relative">
//                                             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                                                 <User size={18} className={`transition-colors ${errors.name ? 'text-red-400' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
//                                             </div>
//                                             <input 
//                                                 type="text" id="name" value={formData.name}
//                                                 onChange={(e) => handleNameChange(e.target.value)}
//                                                 onBlur={() => handleBlur('name')}
//                                                 className={`w-full rounded-2xl border bg-white/70 pl-11 pr-10 py-3.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:shadow-[0_8px_30px_rgba(37,99,235,0.08)] ring-4 ring-transparent ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200/80 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-500/10'}`}
//                                                 placeholder="John Doe"
//                                             />
//                                             {errors.name && (
//                                                 <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
//                                                     <AlertCircle size={18} className="text-red-500" />
//                                                 </div>
//                                             )}
//                                         </div>
//                                         {errors.name && <p className="text-xs font-semibold text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">{errors.name}</p>}
//                                     </div>

//                                     {/* Email Input */}
//                                     <div className="space-y-1.5 group">
//                                         <label htmlFor="email" className={`text-[11px] font-bold uppercase tracking-wider transition-colors ml-1 ${errors.email ? 'text-red-500' : 'text-slate-500 group-focus-within:text-blue-600'}`}>University Email</label>
//                                         <div className="relative">
//                                             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                                                 <AtSign size={18} className={`transition-colors ${errors.email ? 'text-red-400' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
//                                             </div>
//                                             <input 
//                                                 type="email" id="email" value={formData.email}
//                                                 onChange={(e) => handleEmailChange(e.target.value)}
//                                                 onBlur={() => handleBlur('email')}
//                                                 className={`w-full rounded-2xl border bg-white/70 pl-11 pr-10 py-3.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:shadow-[0_8px_30px_rgba(37,99,235,0.08)] ring-4 ring-transparent ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200/80 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-500/10'}`}
//                                                 placeholder="you@std.uni.ac.lk"
//                                             />
//                                             {errors.email && (
//                                                 <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
//                                                     <AlertCircle size={18} className="text-red-500" />
//                                                 </div>
//                                             )}
//                                         </div>
//                                         {errors.email && <p className="text-xs font-semibold text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">{errors.email}</p>}
//                                     </div>
//                                 </div>

//                                 {/* Category Dropdown */}
//                                 <div className="space-y-1.5 group" ref={dropdownRef}>
//                                     <label className={`text-[11px] font-bold uppercase tracking-wider transition-colors ml-1 ${errors.category ? 'text-red-500' : 'text-slate-500 group-focus-within:text-blue-600'}`}>Subject Category</label>
//                                     <div className="relative">
//                                         <div 
//                                             onClick={() => { setIsDropdownOpen(!isDropdownOpen); setTouched(prev => ({...prev, category: true})); }}
//                                             className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border bg-white/70 px-4 py-3.5 text-sm outline-none transition-all focus:bg-white focus:shadow-[0_8px_30px_rgba(37,99,235,0.08)] ring-4 ring-transparent ${errors.category ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200/80 hover:border-blue-300'} ${isDropdownOpen ? 'border-blue-500 bg-white ring-blue-500/10' : ''}`}
//                                         >
//                                             <div className="flex items-center gap-3">
//                                                 <HelpCircle size={18} className={`transition-colors ${errors.category ? 'text-red-400' : isDropdownOpen ? 'text-blue-500' : 'text-slate-400'}`} />
//                                                 <span className={formData.category ? 'text-slate-800 font-medium' : 'text-slate-400'}>
//                                                     {formData.category || "Select a topic..."}
//                                                 </span>
//                                             </div>
//                                             <div className="flex items-center gap-2">
//                                                 {errors.category && !isDropdownOpen && <AlertCircle size={18} className="text-red-500" />}
//                                                 <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-blue-500' : ''}`} />
//                                             </div>
//                                         </div>
//                                         <div className={`absolute left-0 top-[calc(100%+8px)] z-50 w-full origin-top transform overflow-hidden rounded-2xl border border-slate-100 bg-white/95 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-200 ease-out ${isDropdownOpen ? 'scale-y-100 opacity-100 translate-y-0' : 'scale-y-95 opacity-0 -translate-y-2 pointer-events-none'}`}>
//                                             <div className="p-2 space-y-1">
//                                                 {categoryOptions.map((option, idx) => (
//                                                     <div 
//                                                         key={idx}
//                                                         onClick={() => handleCategoryChange(option)}
//                                                         className={`cursor-pointer rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-blue-50 hover:text-blue-700 ${formData.category === option ? 'bg-blue-100/50 text-blue-700' : 'text-slate-600'}`}
//                                                     >
//                                                         {option}
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     </div>
//                                     {errors.category && <p className="text-xs font-semibold text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">{errors.category}</p>}
//                                 </div>

//                                 {/* Message Textarea */}
//                                 <div className="space-y-1.5 group">
//                                     <label htmlFor="message" className={`text-[11px] font-bold uppercase tracking-wider transition-colors ml-1 ${errors.message ? 'text-red-500' : 'text-slate-500 group-focus-within:text-blue-600'}`}>Message</label>
//                                     <div className="relative">
//                                         <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
//                                             <MessageSquare size={18} className={`transition-colors mt-0.5 ${errors.message ? 'text-red-400' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
//                                         </div>
//                                         <textarea 
//                                             id="message" rows={4} value={formData.message}
//                                             onChange={(e) => handleMessageChange(e.target.value)}
//                                             onBlur={() => handleBlur('message')}
//                                             className={`w-full resize-none rounded-2xl border bg-white/70 pl-11 pr-10 py-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:shadow-[0_8px_30px_rgba(37,99,235,0.08)] ring-4 ring-transparent ${errors.message ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200/80 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-500/10'}`}
//                                             placeholder="How can we help you today?"
//                                         ></textarea>
//                                         {errors.message && (
//                                             <div className="absolute top-4 right-0 pr-4 flex items-start pointer-events-none">
//                                                 <AlertCircle size={18} className="text-red-500 mt-0.5" />
//                                             </div>
//                                         )}
//                                     </div>
//                                     {errors.message && <p className="text-xs font-semibold text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">{errors.message}</p>}
//                                 </div>

//                                 <button type="submit" disabled={isSubmitting} className="group relative w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 font-bold text-white shadow-[0_10px_25px_rgba(37,99,235,0.25)] transition-all hover:shadow-[0_15px_35px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:scale-100 overflow-hidden">
//                                     {/* Button shine effect */}
//                                     <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                    
//                                     <span className="relative flex items-center gap-2">
//                                         {isSubmitting ? (
//                                             <>
//                                                 <Loader2 size={18} className="animate-spin" />
//                                                 Sending...
//                                             </>
//                                         ) : (
//                                             <>
//                                                 Send Message
//                                                 <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
//                                             </>
//                                         )}
//                                     </span>
//                                 </button>
//                             </form>
//                         </div>
//                     </div>
//                 </section>

//                 {/* FAQ Section */}
//                 <section id="faq" className="max-w-3xl mx-auto space-y-8 mt-12">
//                     <div className="text-center">
//                         <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
//                         <p className="mt-4 text-slate-500">Quick answers to common questions about Uni Nexus.</p>
//                     </div>
                    
//                     <div className="space-y-4">
//                         {faqs.map((faq, index) => (
//                             <div 
//                                 key={index} 
//                                 className={`rounded-2xl border transition-all duration-300 overflow-hidden ${activeFaq === index ? 'bg-white border-blue-200 shadow-md' : 'bg-white/50 border-white/60 hover:bg-white hover:border-blue-100'}`}
//                             >
//                                 <button 
//                                     onClick={() => toggleFaq(index)}
//                                     className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
//                                 >
//                                     <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
//                                     <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeFaq === index ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
//                                         <ChevronDown size={18} className={`transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`} />
//                                     </div>
//                                 </button>
//                                 <div 
//                                     className={`px-6 transition-all duration-300 ease-in-out ${activeFaq === index ? 'pb-5 opacity-100 max-h-40' : 'max-h-0 opacity-0 overflow-hidden'}`}
//                                 >
//                                     <p className="text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">
//                                         {faq.answer}
//                                     </p>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </section>

//                 {/* 4. CTA Section (Exact Match to About Us) */}
//                 <section className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-10 md:p-16 text-center shadow-2xl mt-10">
//                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
//                     <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>
//                     <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>
                    
//                     <div className="relative z-10 max-w-2xl mx-auto space-y-10">
                        
//                         <div className="space-y-4">
//                             <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">Join the Community</p>
//                             <div className="flex justify-center gap-4">
//                                 {[Facebook, Instagram, Linkedin].map((Icon, idx) => (
//                                     <a key={idx} href="#" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:scale-110 hover:bg-white hover:text-slate-900">
//                                         <Icon size={20} />
//                                     </a>
//                                 ))}
//                             </div>
//                         </div>

//                         <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

//                         <div className="space-y-8">
//                             <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Ready to join the network?</h2>
//                             <p className="text-xl text-slate-300">
//                                 Experience a smarter way to learn, connect, and grow within your campus.
//                             </p>
//                             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
//                                 <Link href="/register" className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-slate-900 transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]">
//                                     Get Started Today
//                                     <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
//                                 </Link>
//                                 <Link href="/" className="flex w-full sm:w-auto items-center justify-center rounded-full border border-slate-600 bg-slate-800/50 backdrop-blur-sm px-8 py-4 font-semibold text-white transition-all hover:bg-slate-800">
//                                     Back to Home
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
                
//                 {/* Animations matching About Us */}
//                 <style jsx>{`
//                     .hero-mini-pill {
//                         border: 1px solid rgba(255, 255, 255, 0.7);
//                         background: linear-gradient(135deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.42));
//                         box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75), 0 6px 16px rgba(15, 23, 42, 0.08);
//                         backdrop-filter: blur(10px) saturate(150%);
//                         -webkit-backdrop-filter: blur(10px) saturate(150%);
//                         border-radius: 0.75rem;
//                         padding: 0.5rem 0.75rem;
//                         font-weight: 600;
//                     }

//                     .hero-title-effect {
//                         background-image: linear-gradient(
//                             115deg,
//                             #1d4ed8 0%,
//                             #38bdf8 24%,
//                             #facc15 46%,
//                             #f97316 68%,
//                             #6366f1 84%,
//                             #22d3ee 100%
//                         );
//                         background-size: 260% 260%;
//                         animation: titleGradientFlow 4s ease-in-out infinite, titleGlowPulse 2.4s ease-in-out infinite;
//                         filter: drop-shadow(0 8px 22px rgba(29, 78, 216, 0.3));
//                     }

//                     .typing-line {
//                         display: block;
//                         overflow: hidden;
//                         clip-path: inset(0 100% 0 0);
//                         animation: typingReveal 3.8s steps(80, end) 0.35s forwards;
//                     }

//                     @media (max-width: 768px) {
//                         .typing-line {
//                             animation: fadeIn 0.8s ease-out 0.2s both;
//                             clip-path: none;
//                         }
//                     }

//                     .hero-overlay-card {
//                         will-change: opacity, transform;
//                         animation-duration: 10s;
//                         animation-timing-function: ease-in-out;
//                         animation-iteration-count: infinite;
//                         border: 1px solid rgba(255, 255, 255, 0.52);
//                         background: linear-gradient(135deg, rgba(255, 255, 255, 0.58), rgba(255, 255, 255, 0.24));
//                         box-shadow: 0 18px 40px rgba(15, 23, 42, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.65);
//                         backdrop-filter: blur(22px) saturate(170%);
//                         -webkit-backdrop-filter: blur(22px) saturate(170%);
//                     }

//                     .hero-card-a {
//                         animation-name: swapCardA;
//                     }

//                     .hero-card-b {
//                         animation-name: swapCardB;
//                         border-color: rgba(52, 211, 153, 0.48);
//                         background: linear-gradient(135deg, rgba(236, 253, 245, 0.62), rgba(209, 250, 229, 0.24));
//                     }

//                     @keyframes typingReveal {
//                         from { clip-path: inset(0 100% 0 0); }
//                         to { clip-path: inset(0 0 0 0); }
//                     }

//                     @keyframes titleGradientFlow {
//                         0%, 100% { background-position: 0% 50%; }
//                         50% { background-position: 100% 50%; }
//                     }

//                     @keyframes titleGlowPulse {
//                         0%, 100% { filter: drop-shadow(0 8px 22px rgba(29, 78, 216, 0.28)); }
//                         50% { filter: drop-shadow(0 12px 30px rgba(249, 115, 22, 0.35)); }
//                     }

//                     @keyframes swapCardA {
//                         0%, 45% { opacity: 1; transform: translateY(0); pointer-events: auto; }
//                         50%, 95% { opacity: 0; transform: translateY(8px); pointer-events: none; }
//                         100% { opacity: 1; transform: translateY(0); pointer-events: auto; }
//                     }

//                     @keyframes swapCardB {
//                         0%, 45% { opacity: 0; transform: translateY(8px); pointer-events: none; }
//                         50%, 95% { opacity: 1; transform: translateY(0); pointer-events: auto; }
//                         100% { opacity: 0; transform: translateY(8px); pointer-events: none; }
//                     }

//                     @keyframes fadeIn {
//                         from { opacity: 0; transform: translateY(4px); }
//                         to { opacity: 1; transform: translateY(0); }
//                     }

//                     @keyframes shimmer {
//                         100% { transform: translateX(100%); }
//                     }
//                 `}</style>

//             </div>
//         </main>
//         </>
//     );
// }













'use client';

import Link from "next/link";
import Image from "next/image";
import { Poppins, Oxanium, Sora } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import { useState, useRef, useEffect } from "react";
import {
    Mail,
    Phone,
    MapPin,
    Send,
    MessageSquare,
    ChevronDown,
    Facebook,
    Instagram,
    Linkedin,
    ArrowRight,
    CheckCircle2,
    Clock,
    HelpCircle,
    AlertCircle,
    User,
    Tag,
    MessageSquareText,
    MessageCircle,
    Users,
    BellRing
} from "lucide-react";

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

const faqs = [
    {
        question: "Who can use Uni Nexus?",
        answer: "Currently, Uni Nexus is an exclusive platform. Only verified university students with a valid student ID or university email can access the full features."
    },
    {
        question: "Is the Campus Marketplace safe?",
        answer: "Yes! Because access is restricted to verified students, you are dealing directly with your peers. However, we always recommend meeting on campus to exchange items."
    },
    {
        question: "Are the services free to use?",
        answer: "The core platform—including notes sharing and finding project groups—is completely free. Some premium freelance gigs or specialized tutor sessions may involve student-to-student payments."
    },
    {
        question: "How can I report a technical issue?",
        answer: "Please use the contact form above, select 'Technical Support & Bug Report', and give us a brief description of the issue. Our team will look into it within 24 hours."
    },
    {
        question: "How do I verify my account?",
        answer: "You will need to sign up using your official university email. A verification link will be sent to that address to activate your account securely."
    },
    {
        question: "Can I edit or delete a post after publishing?",
        answer: "Yes. You can manage your listings, posts, and shared resources from your profile dashboard, where editing or removing content is available anytime."
    }
];

export default function ContactPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(0); // Default open first FAQ

    const toggleFaq = (index: number) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    // --- Form Validation & Dropdown States ---
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", category: "", message: "" });
    const [errors, setErrors] = useState({ firstName: "", lastName: "", email: "", category: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Custom Dropdown Logic
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // Expanded Categories
    const categoryOptions = [
        "General Inquiry", 
        "Campus Marketplace Support", 
        "Project Group Matchmaking",
        "Notes & Resources Sharing",
        "Account Verification",
        "Report a Technical Bug",
        "Report Suspicious Activity",
        "Partnerships & Sponsorships"
    ];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Live Validation Function
    const validateField = (field: string, value: string) => {
        let errorMsg = "";
        
        if (field === "firstName" && !value.trim()) {
            errorMsg = "First name is required";
        }
        if (field === "lastName" && !value.trim()) {
            errorMsg = "Last name is required";
        }
        if (field === "email") {
            if (!value.trim()) {
                errorMsg = "Email is required";
            } else if (!value.includes("@") || !value.toLowerCase().endsWith("sliit.lk")) {
                errorMsg = "Please use a valid university email containing '@' and ending with sliit.lk";
            }
        }
        if (field === "category" && !value) {
            errorMsg = "Please select a subject category";
        }
        if (field === "message" && !value.trim()) {
            errorMsg = "Message cannot be empty";
        }

        setErrors(prev => ({ ...prev, [field]: errorMsg }));
        return errorMsg === "";
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        validateField(id, value);
    };

    const handleCategorySelect = (option: string) => {
        setFormData(prev => ({ ...prev, category: option }));
        validateField("category", option);
        setIsDropdownOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const isFirstNameValid = validateField("firstName", formData.firstName);
        const isLastNameValid = validateField("lastName", formData.lastName);
        const isEmailValid = validateField("email", formData.email);
        const isCategoryValid = validateField("category", formData.category);
        const isMessageValid = validateField("message", formData.message);

        const isValid = isFirstNameValid && isLastNameValid && isEmailValid && isCategoryValid && isMessageValid;

        if (isValid) {
            setIsSubmitting(true);
            setTimeout(() => {
                alert("Message Sent Successfully!");
                setIsSubmitting(false);
                setFormData({ firstName: "", lastName: "", email: "", category: "", message: "" });
            }, 1500);
        }
    };

    return (
        <>
        <Navbar />
        <main className="relative min-h-screen bg-[#f8fafc] text-slate-800 selection:bg-blue-200 selection:text-blue-900 overflow-hidden font-sans">
            {/* Soft Background Mesh Gradients */}
            <div className="absolute top-0 -left-40 w-[500px] h-[500px] bg-blue-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-40 w-[500px] h-[500px] bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-40 left-20 w-[600px] h-[600px] bg-purple-200/50 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-blob animation-delay-4000"></div>

            <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-0 md:px-8 md:pb-24 md:pt-0 space-y-24">
                
                {/* 1. Hero Section */}
                <section className={`${oxanium.className} relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden border-y border-white/70 bg-gradient-to-r from-white/62 via-slate-50/55 to-blue-50/52 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.09)] backdrop-blur-xl md:p-10 lg:px-14`}>
                    <div className="pointer-events-none absolute inset-0 opacity-30">
                        <Image
                            src="/images/contactus/contactus_hero_BG.png" 
                            alt=""
                            fill
                            aria-hidden="true"
                            className="object-cover object-center"
                        />
                    </div>
                    <div className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-blue-200/40 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl" />

                    <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                        
                        <div className="order-2 lg:order-1 relative -mb-6 min-h-[420px] md:-mb-10 md:min-h-[520px] lg:-ml-6 lg:w-full lg:self-end">
                            <div className="absolute inset-x-0 bottom-0 h-full">
                                <Image
                                    src="/images/contactus/contactus_hero.png" 
                                    alt="Contact Uni Nexus Support"
                                    fill
                                    priority
                                    className="origin-bottom object-contain object-bottom scale-110 md:scale-125 lg:scale-[1.35] transition-all duration-300"
                                />
                            </div>

                            <div className="hero-overlay-card hero-card-a absolute bottom-5 left-3 z-20 w-[60%] rounded-3xl p-5 md:left-5 md:w-[56%]">
                                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Support Center</p>
                                <p className="mt-2 text-lg font-bold text-slate-900">Always here to help.</p>
                                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-3 py-1.5 text-xs font-bold text-blue-800">
                                    <Clock size={14} /> Response in 24 hrs
                                </div>
                            </div>

                            <div className="hero-overlay-card hero-card-b absolute bottom-16 right-3 z-20 w-[55%] rounded-2xl p-4 md:right-5 md:w-[50%]">
                                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Status</p>
                                <p className="mt-1 text-sm font-semibold text-slate-800 flex items-center gap-2">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                    </span>
                                    All Systems Operational
                                </p>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 space-y-6 lg:pl-10 lg:pb-12">
                            <h1 className={`${poppins.className} hero-title-effect font-extrabold leading-tight tracking-tight text-transparent bg-clip-text`}>
                                <span className="block text-5xl ">We're Here to Help,</span>
                                <span className="block text-5xl md:text-7xl">Let's Connect.</span>
                            </h1>

                             <Image
                                src="/images/contactus/UniNexus_Logo_lightT.png"
                                alt="UniNexus"
                                width={280}
                                height={56}
                                className="-ml-2 h-12 w-auto md:-ml-4 md:h-14"
                                priority
                            />

                            <p className="typing-line max-w-xl text-base leading-relaxed text-slate-600 md:text-lg font-medium">
                                Have questions, feedback, or need support? We’re just a message away.
                            </p>

                            <div className="flex flex-wrap items-center gap-3 pt-4">
                                <a href="#contact-form" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-lg shadow-slate-900/20">
                                    Send a Message
                                    <ArrowRight size={16} />
                                </a>
                                <a href="#faq" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/60 px-6 py-3.5 text-sm font-semibold text-slate-700 backdrop-blur-md transition hover:border-blue-300 hover:text-blue-700">
                                    <HelpCircle size={16} />
                                    Read FAQs
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Contact Grid Section (Info + Form) */}
                <section id="contact-form" className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
                    
                    {/* Left: Contact Info */}
                    <div className="space-y-6">
                        <div className="space-y-3 mb-8">
                            <div className="inline-flex items-center gap-3">
                                <span className="h-[2px] w-10 bg-gradient-to-r from-blue-500 to-indigo-500" />
                                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Reach Out</span>
                            </div>
                            <h2 className={`${sora.className} text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-800 to-blue-700 md:text-4xl`}>
                                Direct Contact
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                Prefer reaching out directly? Here are our official communication channels.
                            </p>
                        </div>

                        {/* Info Cards */}
                        <div className="group relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white/80 via-white/65 to-blue-50/45 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(37,99,235,0.14)]">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Email Support</p>
                                    <a href="mailto:support@uninexus.com" className={`${oxanium.className} text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors`}>support@uninexus.com</a>
                                </div>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white/80 via-white/65 to-indigo-50/45 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(79,70,229,0.14)]">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Phone</p>
                                    <p className={`${oxanium.className} text-lg font-bold text-slate-900`}>+94 77 123 4567</p>
                                </div>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white/80 via-white/65 to-emerald-50/45 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(16,185,129,0.14)]">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow-lg">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Location</p>
                                    <p className={`${oxanium.className} text-lg font-bold text-slate-900`}>SLIIT, New Kandy Road, Malabe.</p>
                                </div>
                            </div>
                            <div className="mt-4 overflow-hidden rounded-2xl border border-emerald-100">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.7985117460157!2d79.96822486817395!3d6.914677496395934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae256db1a6771c5%3A0x2c63e344ab9a7536!2sSri%20Lanka%20Institute%20of%20Information%20Technology!5e0!3m2!1sen!2slk!4v1774520135473!5m2!1sen!2slk"
                                    className="h-52 w-full"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="SLIIT Location Map"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/50 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl md:p-10">
                        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-300/30 blur-3xl" />
                        <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-violet-300/30 blur-3xl" />

                        <div className="relative z-10 space-y-8">
                            <div>
                                <div className="inline-flex items-center gap-3 mb-3">
                                    <span className="h-[2px] w-10 bg-gradient-to-r from-blue-500 to-indigo-500" />
                                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Contact Form</span>
                                </div>
                                <h3 className={`${sora.className} text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-800 to-blue-700 md:text-4xl`}>Send us a message</h3>
                                <p className="mt-2 text-sm text-slate-500">We'll get back to you within 24–48 hours.</p>
                            </div>

                            {/* Form Font changed to Oxanium here */}
                            <form className={`space-y-6 ${oxanium.className}`} onSubmit={handleSubmit} noValidate>
                                
                                <div className="grid gap-5 md:grid-cols-2">
                                    {/* First Name */}
                                    <div className="space-y-2">
                                        <label htmlFor="firstName" className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1">First Name</label>
                                        <div className="relative flex items-center">
                                            <User size={18} className={`absolute left-4 transition-colors ${errors.firstName ? 'text-red-400' : 'text-slate-400'}`} />
                                            <input 
                                                type="text" id="firstName" value={formData.firstName}
                                                onChange={handleInputChange}
                                                className={`w-full rounded-2xl border bg-white/60 pl-11 pr-4 py-3.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 ${errors.firstName ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15' : 'border-white/80 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-500/15 shadow-sm'}`}
                                                placeholder="John"
                                            />
                                        </div>
                                        {errors.firstName && <p className="flex items-center gap-1 text-xs font-medium text-red-500 ml-1 animate-in slide-in-from-top-1"><AlertCircle size={12}/> {errors.firstName}</p>}
                                    </div>

                                    {/* Last Name */}
                                    <div className="space-y-2">
                                        <label htmlFor="lastName" className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1">Last Name</label>
                                        <div className="relative flex items-center">
                                            <User size={18} className={`absolute left-4 transition-colors ${errors.lastName ? 'text-red-400' : 'text-slate-400'}`} />
                                            <input 
                                                type="text" id="lastName" value={formData.lastName}
                                                onChange={handleInputChange}
                                                className={`w-full rounded-2xl border bg-white/60 pl-11 pr-4 py-3.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 ${errors.lastName ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15' : 'border-white/80 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-500/15 shadow-sm'}`}
                                                placeholder="Doe"
                                            />
                                        </div>
                                        {errors.lastName && <p className="flex items-center gap-1 text-xs font-medium text-red-500 ml-1 animate-in slide-in-from-top-1"><AlertCircle size={12}/> {errors.lastName}</p>}
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1">University Email</label>
                                    <div className="relative flex items-center">
                                        <Mail size={18} className={`absolute left-4 transition-colors ${errors.email ? 'text-red-400' : 'text-slate-400'}`} />
                                        <input 
                                            type="email" id="email" value={formData.email}
                                            onChange={handleInputChange}
                                            className={`w-full rounded-2xl border bg-white/60 pl-11 pr-4 py-3.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15' : 'border-white/80 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-500/15 shadow-sm'}`}
                                            placeholder="you@itfac.sliit.lk"
                                        />
                                    </div>
                                    {errors.email && <p className="flex items-center gap-1 text-xs font-medium text-red-500 ml-1 animate-in slide-in-from-top-1"><AlertCircle size={12}/> {errors.email}</p>}
                                </div>

                                {/* Category Dropdown */}
                                <div className="space-y-2" ref={dropdownRef}>
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1">Subject Category</label>
                                    <div className="relative">
                                        <div 
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border bg-white/60 pl-11 pr-4 py-3.5 text-sm outline-none transition-all focus:bg-white focus:ring-4 shadow-sm ${errors.category ? 'border-red-400 focus:ring-red-500/15' : 'border-white/80 hover:border-blue-300'} ${isDropdownOpen ? 'border-blue-500 bg-white ring-4 ring-blue-500/15' : ''}`}
                                        >
                                            <Tag size={18} className={`absolute left-4 transition-colors ${errors.category ? 'text-red-400' : 'text-slate-400'}`} />
                                            <span className={formData.category ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                                                {formData.category || "Select a specific topic..."}
                                            </span>
                                            <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-blue-500' : ''}`} />
                                        </div>
                                        <div className={`absolute left-0 top-full z-50 mt-2 w-full origin-top transform overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_15px_40px_rgba(0,0,0,0.1)] transition-all duration-200 ${isDropdownOpen ? 'scale-y-100 opacity-100' : 'scale-y-95 opacity-0 pointer-events-none'}`}>
                                            <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
                                                {categoryOptions.map((option, idx) => (
                                                    <div 
                                                        key={idx}
                                                        onClick={() => handleCategorySelect(option)}
                                                        className={`cursor-pointer px-4 py-3 text-sm transition-colors hover:bg-blue-50 hover:text-blue-700 ${formData.category === option ? 'bg-blue-50/80 font-semibold text-blue-700' : 'text-slate-600 font-medium'}`}
                                                    >
                                                        {option}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {errors.category && <p className="flex items-center gap-1 text-xs font-medium text-red-500 ml-1 animate-in slide-in-from-top-1"><AlertCircle size={12}/> {errors.category}</p>}
                                </div>

                                {/* Message */}
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1">Message</label>
                                    <div className="relative">
                                        <MessageSquareText size={18} className={`absolute left-4 top-4 transition-colors ${errors.message ? 'text-red-400' : 'text-slate-400'}`} />
                                        <textarea 
                                            id="message" rows={4} value={formData.message}
                                            onChange={handleInputChange}
                                            className={`w-full resize-none rounded-2xl border bg-white/60 pl-11 pr-4 py-3.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 shadow-sm ${errors.message ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15' : 'border-white/80 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-500/15'}`}
                                            placeholder="How can we help you today?"
                                        ></textarea>
                                    </div>
                                    {errors.message && <p className="flex items-center gap-1 text-xs font-medium text-red-500 ml-1 animate-in slide-in-from-top-1"><AlertCircle size={12}/> {errors.message}</p>}
                                </div>

                                <button type="submit" disabled={isSubmitting} className={`${poppins.className} group relative w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-6 py-4 font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] hover:shadow-blue-500/50 active:scale-95 disabled:opacity-70 disabled:hover:scale-100 overflow-hidden`}>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                                    <span className="relative z-10">{isSubmitting ? "Sending your message..." : "Send Message"}</span>
                                    {!isSubmitting && <Send size={18} className="relative z-10 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                {/* 3. NEW SECTION: FAQ (60%) & Newsletter/Community (40%) */}
                <section id="faq" className="grid items-start gap-8 lg:grid-cols-5 lg:gap-12 mt-10">
                    
                    {/* Left Side: FAQs (60% - col-span-3) */}
                    <div className={`${oxanium.className} lg:col-span-3 space-y-8`}>
                        <div>
                            <div className="inline-flex items-center gap-3 mb-3">
                                <span className="h-[2px] w-10 bg-gradient-to-r from-blue-500 to-indigo-500" />
                                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Knowledge Base</span>
                            </div>
                            <h2 className={`${sora.className} text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-800 to-blue-700 md:text-4xl`}>
                                Frequently Asked <br className="hidden md:block" /> Questions
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div 
                                    key={index} 
                                    className={`overflow-hidden rounded-2xl border transition-all duration-300 ${activeFaq === index ? 'bg-white shadow-[0_10px_30px_rgba(37,99,235,0.08)] border-blue-200' : 'bg-white/60 border-white/80 hover:bg-white/90 hover:border-blue-100 backdrop-blur-md'}`}
                                >
                                    <button 
                                        onClick={() => toggleFaq(index)} 
                                        className="flex w-full items-center justify-between px-6 py-5 text-left outline-none"
                                    >
                                        <span className={`text-lg font-semibold pr-4 transition-colors ${activeFaq === index ? 'text-blue-700' : 'text-slate-800'}`}>
                                            {faq.question}
                                        </span>
                                        <div className={`flex flex-shrink-0 items-center justify-center h-8 w-8 rounded-full transition-colors ${activeFaq === index ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                            <ChevronDown size={18} className={`transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`} />
                                        </div>
                                    </button>
                                    <div 
                                        className={`transition-all duration-300 ease-in-out ${activeFaq === index ? 'max-h-[200px] opacity-100 pb-5' : 'max-h-0 opacity-0'}`}
                                    >
                                        <p className="px-6 text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-4 mt-1">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Newsletter & Community (40% - col-span-2) */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Newsletter Card */}
                        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-8 text-white shadow-2xl">
                            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/30 blur-3xl"></div>
                            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-indigo-500/30 blur-3xl"></div>
                            
                            <div className="relative z-10">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-blue-300 backdrop-blur-md border border-white/10 mb-5">
                                    <BellRing size={22} />
                                </div>
                                <h4 className={`${sora.className} text-xl font-bold`}>Stay in the loop</h4>
                                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                                    Get the latest campus updates, features, and monthly newsletters straight to your inbox.
                                </p>
                                
                                <form className="mt-6 space-y-3" onSubmit={(e) => { e.preventDefault(); alert("Subscribed!"); }}>
                                    <div className="relative flex items-center">
                                        <input 
                                            type="email" 
                                            placeholder="Your email address" 
                                            required
                                            className="w-full rounded-xl bg-white/10 border border-white/20 pl-4 pr-24 py-3.5 text-sm text-white outline-none placeholder:text-slate-400 focus:bg-white/15 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 backdrop-blur-md transition-all" 
                                        />
                                        <button type="submit" className="absolute right-1.5 rounded-lg bg-blue-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-600 shadow-lg shadow-blue-500/30">
                                            Subscribe
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Community Card */}
                        <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/50 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl">
                            <h4 className={`${sora.className} text-xl font-bold text-slate-900`}>Join the Network</h4>
                            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                                Connect with your peers, discuss projects, and get instant help from the community.
                            </p>
                            
                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <a href="#" className="group flex flex-col items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-4 py-4 border border-emerald-100 transition-all hover:bg-[#25D366] hover:border-[#25D366] hover:shadow-lg hover:shadow-[#25D366]/20">
                                    <MessageCircle size={24} className="text-[#25D366] transition-colors group-hover:text-white" />
                                    <span className="text-xs font-bold text-slate-700 transition-colors group-hover:text-white">WhatsApp</span>
                                </a>
                                <a href="#" className="group flex flex-col items-center justify-center gap-2 rounded-2xl bg-sky-50 px-4 py-4 border border-sky-100 transition-all hover:bg-[#0088cc] hover:border-[#0088cc] hover:shadow-lg hover:shadow-[#0088cc]/20">
                                    <Send size={24} className="text-[#0088cc] transition-colors group-hover:text-white" />
                                    <span className="text-xs font-bold text-slate-700 transition-colors group-hover:text-white">Telegram</span>
                                </a>
                                <a href="#" className="col-span-2 group flex items-center justify-center gap-3 rounded-2xl bg-indigo-50 px-4 py-4 border border-indigo-100 transition-all hover:bg-[#5865F2] hover:border-[#5865F2] hover:shadow-lg hover:shadow-[#5865F2]/20">
                                    <Users size={20} className="text-[#5865F2] transition-colors group-hover:text-white" />
                                    <span className="text-sm font-bold text-slate-700 transition-colors group-hover:text-white">Join Discord Server</span>
                                </a>
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/50 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl">
                            <h4 className={`${sora.className} text-xl font-bold text-slate-900`}>Follow Us</h4>
                            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                                Stay connected with Uni Nexus on social media for updates and announcements.
                            </p>

                            <div className="mt-6 grid grid-cols-3 gap-3">
                                <a href="#" className="group flex flex-col items-center justify-center gap-2 rounded-2xl bg-blue-50 px-4 py-4 border border-blue-100 transition-all hover:bg-[#1877F2] hover:border-[#1877F2] hover:shadow-lg hover:shadow-[#1877F2]/20">
                                    <Facebook size={22} className="text-[#1877F2] transition-colors group-hover:text-white" />
                                    <span className="text-xs font-bold text-slate-700 transition-colors group-hover:text-white">Facebook</span>
                                </a>
                                <a href="#" className="group flex flex-col items-center justify-center gap-2 rounded-2xl bg-pink-50 px-4 py-4 border border-pink-100 transition-all hover:bg-[#E1306C] hover:border-[#E1306C] hover:shadow-lg hover:shadow-[#E1306C]/20">
                                    <Instagram size={22} className="text-[#E1306C] transition-colors group-hover:text-white" />
                                    <span className="text-xs font-bold text-slate-700 transition-colors group-hover:text-white">Instagram</span>
                                </a>
                                <a href="#" className="group flex flex-col items-center justify-center gap-2 rounded-2xl bg-sky-50 px-4 py-4 border border-sky-100 transition-all hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:shadow-lg hover:shadow-[#0A66C2]/20">
                                    <Linkedin size={22} className="text-[#0A66C2] transition-colors group-hover:text-white" />
                                    <span className="text-xs font-bold text-slate-700 transition-colors group-hover:text-white">LinkedIn</span>
                                </a>
                            </div>
                        </div>

                    </div>
                </section>

                {/* 4. Final CTA Section */}
                <section className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-10 md:p-16 text-center shadow-2xl mt-10">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>
                    <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>
                    
                    <div className="relative z-10 max-w-2xl mx-auto space-y-10">
                        <div className="space-y-8">
                            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Ready to join the network?</h2>
                            <p className="text-xl text-slate-300">
                                Experience a smarter way to learn, connect, and grow within your campus.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                <Link href="/register" className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-slate-900 transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]">
                                    Get Started Today
                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link href="/" className="flex w-full sm:w-auto items-center justify-center rounded-full border border-slate-600 bg-slate-800/50 backdrop-blur-sm px-8 py-4 font-semibold text-white transition-all hover:bg-slate-800">
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Animations matching About Us */}
                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background-color: #cbd5e1;
                        border-radius: 10px;
                    }

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
                        border-color: rgba(52, 211, 153, 0.48);
                        background: linear-gradient(135deg, rgba(236, 253, 245, 0.62), rgba(209, 250, 229, 0.24));
                    }

                    @keyframes typingReveal {
                        from { clip-path: inset(0 100% 0 0); }
                        to { clip-path: inset(0 0 0 0); }
                    }

                    @keyframes titleGradientFlow {
                        0%, 100% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                    }

                    @keyframes titleGlowPulse {
                        0%, 100% { filter: drop-shadow(0 8px 22px rgba(29, 78, 216, 0.28)); }
                        50% { filter: drop-shadow(0 12px 30px rgba(249, 115, 22, 0.35)); }
                    }

                    @keyframes swapCardA {
                        0%, 45% { opacity: 1; transform: translateY(0); pointer-events: auto; }
                        50%, 95% { opacity: 0; transform: translateY(8px); pointer-events: none; }
                        100% { opacity: 1; transform: translateY(0); pointer-events: auto; }
                    }

                    @keyframes swapCardB {
                        0%, 45% { opacity: 0; transform: translateY(8px); pointer-events: none; }
                        50%, 95% { opacity: 1; transform: translateY(0); pointer-events: auto; }
                        100% { opacity: 0; transform: translateY(8px); pointer-events: none; }
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(4px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>

            </div>
        </main>
        <Footer />
        </>
    );
}