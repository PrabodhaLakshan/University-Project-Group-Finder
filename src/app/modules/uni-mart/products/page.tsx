// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import SearchBar from "../components/SearchBar";
// import ProductGrid from "../components/ProductGrid";
// import CategoryFilter from "../components/CategoryFilter";
// import PriceFilter from "../components/PriceFilter";
// import SortDropdown from "../components/SortDropdown";
// import { getAllProducts } from "../services/product.service";
// import { Product } from "../types";
// import { ArrowLeft, ChevronLeft, ChevronRight, Instagram, MessageCircle, Linkedin, Twitter } from "lucide-react";
// import { Oxanium, Inter } from "next/font/google";

// const oxanium = Oxanium({
//   subsets: ["latin"],
//   weight: ["500", "600", "700"],
// });

// const inter = Inter({
//   subsets: ["latin"],
//   weight: ["400", "500", "600"],
// });

// const PRODUCTS_PER_SLIDE = 16;

// export default function ProductsPage() {
//   const router = useRouter();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [priceRange, setPriceRange] = useState<{
//     min?: number;
//     max?: number;
//   }>({});
//   const [sortBy, setSortBy] = useState("newest");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageInput, setPageInput] = useState("1");

//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         setIsLoading(true);
//         const data = await getAllProducts({
//           query: searchQuery,
//           category: selectedCategories[0],
//          minPrice: priceRange.min,
//          maxPrice: priceRange.max,
//          limit: "all",
//        });
//         setProducts(data.items);
//         setCurrentPage(1);
//       } catch (error) {
//         console.error("Failed to load products:", error);
//         setProducts([]);
//         setCurrentPage(1);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     const timer = setTimeout(loadProducts, 500);
//     return () => clearTimeout(timer);
//   }, [searchQuery, selectedCategories, priceRange]);

//   const handleSort = (sortValue: string) => {
//     setSortBy(sortValue);
//     let sorted = [...products];

//     switch (sortValue) {
//       case "price-low":
//         sorted.sort((a, b) => a.price - b.price);
//         break;
//       case "price-high":
//         sorted.sort((a, b) => b.price - a.price);
//         break;
//       case "rating":
//         sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
//         break;
//       default:
//         sorted.sort(
//           (a, b) =>
//             new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         );
//     }

//     setProducts(sorted);
//   };

//   const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PER_SLIDE));
//   const startIndex = (currentPage - 1) * PRODUCTS_PER_SLIDE;
//   const paginatedProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_SLIDE);

//   const getVisiblePages = () => {
//     if (totalPages <= 7) {
//       return Array.from({ length: totalPages }, (_, index) => index + 1);
//     }

//     const pages: (number | "ellipsis")[] = [1];

//     if (currentPage > 3) {
//       pages.push("ellipsis");
//     }

//     const start = Math.max(2, currentPage - 1);
//     const end = Math.min(totalPages - 1, currentPage + 1);

//     for (let page = start; page <= end; page++) {
//       pages.push(page);
//     }

//     if (currentPage < totalPages - 2) {
//       pages.push("ellipsis");
//     }

//     pages.push(totalPages);
//     return pages;
//   };

//   const visiblePages = getVisiblePages();

//   useEffect(() => {
//     setPageInput(currentPage.toString());
//   }, [currentPage]);

//   const goToTypedPage = () => {
//     const parsed = parseInt(pageInput, 10);
//     if (Number.isNaN(parsed)) {
//       setPageInput(currentPage.toString());
//       return;
//     }

//     const clampedPage = Math.min(Math.max(parsed, 1), totalPages);
//     setCurrentPage(clampedPage);
//     setPageInput(clampedPage.toString());
//   };

//   return (
//     <div className={`${inter.className} space-y-8`}>
//       {/* Back Button */}
//       <button
//         onClick={() => router.back()}
//         className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
//       >
//         <ArrowLeft size={20} />
//         Back
//       </button>
//       {/* Header */}
//       <div>
//         <h1 className={`${oxanium.className} mb-2 text-4xl font-bold text-gray-900`}>Browse Products</h1>
//         <p className="text-gray-600">
//           Explore all available items in our marketplace
//         </p>
//       </div>

//       {/* Search */}
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <SearchBar onSearch={setSearchQuery} placeholder="Search all products..." />
//       </div>

//       {/* Main Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//         {/* Filters */}
//         <div className={`${oxanium.className} space-y-6 lg:col-span-1`}>
//           <CategoryFilter onFilterChange={setSelectedCategories} />
//           <PriceFilter
//             onFilterChange={(min, max) =>
//               setPriceRange({ min: min, max: max })
//             }
//           />

//           <div className="rounded-2xl border border-white/70 bg-white/60 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur-md">
//             <h3 className={`${oxanium.className} mb-3 text-lg font-semibold text-gray-900`}>
//               Price Trade Safely on Uni-Mart 🛡️
//             </h3>

//             <div className={`${inter.className} space-y-3 text-sm leading-relaxed text-gray-700`}>
//               <p>
//                 🤝 <span className={`${oxanium.className} font-semibold text-gray-900`}>Meet in Public:</span> Always arrange handovers in high-traffic campus areas like the SLIIT library lobby, main canteen, or the student lounge.
//               </p>
//               <p>
//                 🔍 <span className={`${oxanium.className} font-semibold text-gray-900`}>Inspect Before Paying:</span> Thoroughly check the item’s condition in person. If it&apos;s a device, test it out before you finalize the deal.
//               </p>
//               <p>
//                 💳 <span className={`${oxanium.className} font-semibold text-gray-900`}>Secure Payments:</span> Use our integrated Card Payment or Bank Transfer options for a recorded transaction.
//               </p>
//               <p>
//                 🚫 <span className={`${oxanium.className} font-semibold text-gray-900`}>No Advance Payments:</span> Whether paying by cash or transfer, never pay before meeting the seller and inspecting the item. Only authorize the payment once the item is in your hand.
//               </p>
//               <p>
//                 📱 <span className={`${oxanium.className} font-semibold text-gray-900`}>Keep Chats Internal:</span> For your protection, keep all your negotiations and proof of agreement within the Uni-Mart chat system.
//               </p>
//               <p>
//                 🚩 <span className={`${oxanium.className} font-semibold text-gray-900`}>Report Suspicious Ads:</span> If a listing seems "too good to be true" or a seller pressures you to pay an advance before seeing the item, report it to us immediately.
//               </p>
//             </div>
//           </div>

//           <div className="rounded-2xl border border-white/70 bg-white/60 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur-md">
//             <h3 className={`${oxanium.className} mb-4 text-lg font-semibold text-gray-900`}>
//               Got Questions? 🙋‍♂️
//             </h3>

//             <div className={`${inter.className} space-y-5 text-sm leading-relaxed text-gray-700`}>
//               <div>
//                 <h4 className={`${oxanium.className} mb-1 text-base font-semibold text-gray-900`}>
//                   Help Center
//                 </h4>
//                 <p className="mb-3">
//                   Need help with your account, listing, or payments? Find quick answers and step-by-step guides in our Help Center.
//                 </p>
//                 <button
//                   type="button"
//                   className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
//                 >
//                   Visit Help Center
//                 </button>
//               </div>

//               <div className="border-t border-white/70 pt-4">
//                 <h4 className={`${oxanium.className} mb-1 text-base font-semibold text-gray-900`}>
//                   Contact Support
//                 </h4>
//                 <p className="mb-2">
//                   Can&apos;t find what you&apos;re looking for? Our dedicated support team is here to assist you with any issues.
//                 </p>
//                 <p>
//                   <span className={`${oxanium.className} font-semibold text-gray-900`}>Email:</span> support@uni-mart.com
//                 </p>
//                 <p>
//                   <span className={`${oxanium.className} font-semibold text-gray-900`}>Live Chat:</span> Available Mon - Fri (9 AM - 6 PM)
//                 </p>
//                 <button
//                   type="button"
//                   className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
//                 >
//                   Start a Chat
//                 </button>
//               </div>

//               <div className="border-t border-white/70 pt-4">
//                 <h4 className={`${oxanium.className} mb-1 text-base font-semibold text-gray-900`}>
//                   Join the Community (Socials)
//                 </h4>
//                 <p className="mb-2">
//                   Stay updated with the latest campus listings, trending items, and exclusive Uni-Mart deals!
//                 </p>
//                 <div className="flex items-center gap-3">
//                   <button
//                     type="button"
//                     aria-label="Instagram"
//                     className="grid h-10 w-10 place-items-center rounded-xl bg-white/80 text-pink-600 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white"
//                   >
//                     <Instagram size={18} />
//                   </button>
//                   <button
//                     type="button"
//                     aria-label="WhatsApp"
//                     className="grid h-10 w-10 place-items-center rounded-xl bg-white/80 text-emerald-600 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white"
//                   >
//                     <MessageCircle size={18} />
//                   </button>
//                   <button
//                     type="button"
//                     aria-label="LinkedIn"
//                     className="grid h-10 w-10 place-items-center rounded-xl bg-white/80 text-blue-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white"
//                   >
//                     <Linkedin size={18} />
//                   </button>
//                   <button
//                     type="button"
//                     aria-label="X"
//                     className="grid h-10 w-10 place-items-center rounded-xl bg-white/80 text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white"
//                   >
//                     <Twitter size={18} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Products */}
//         <div className="lg:col-span-3">
//           {/* Sort Bar */}
//           <div className="relative z-20 mb-6 flex items-center justify-between rounded-2xl border border-white/70 bg-white/55 p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)] backdrop-blur-md">
//             <div className="flex items-center gap-4">
//               <span className="grid h-11 min-w-11 place-items-center rounded-xl bg-blue-100/80 px-3 text-sm font-semibold text-blue-700">
//                 {isLoading ? "..." : products.length}
//               </span>
//               <div className="leading-tight">
//                 <p className={`${oxanium.className} text-xl font-semibold text-gray-900`}>
//                   {isLoading ? "Loading products..." : `${products.length} products found`}
//                 </p>
//                 <p className="text-sm font-medium text-gray-500">
//                   Showing latest available items
//                 </p>
//               </div>
//             </div>
//             <SortDropdown value={sortBy} onChange={handleSort} />
//           </div>

//           <ProductGrid products={paginatedProducts} isLoading={isLoading} />

//           {!isLoading && products.length > 0 && (
//             <div className="mt-8 flex items-center justify-between rounded-2xl border border-white/70 bg-white/60 px-6 py-4 text-slate-700 shadow-[0_10px_28px_rgba(15,23,42,0.10)] backdrop-blur-md">
//               {/* Left: Page Indicator */}
//               <div className={`${oxanium.className} text-sm font-semibold text-gray-700`}>
//                 {currentPage.toString().padStart(2, "0")} of {totalPages.toString().padStart(2, "0")}
//               </div>

//               {/* Middle: Pagination Controls */}
//               <div className="inline-flex items-center gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
//                   disabled={currentPage === 1}
//                   className="grid h-9 w-9 place-items-center rounded-xl text-gray-600 transition-all hover:bg-white hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
//                   aria-label="Previous page"
//                 >
//                   <ChevronLeft size={18} />
//                 </button>

//                 {visiblePages.map((page, index) =>
//                   page === "ellipsis" ? (
//                     <span key={`ellipsis-${index}`} className="px-2 text-base font-semibold text-gray-400">
//                       ...
//                     </span>
//                   ) : (
//                     <button
//                       key={page}
//                       type="button"
//                       onClick={() => setCurrentPage(page)}
//                       className={`grid h-9 min-w-9 place-items-center rounded-xl px-2 text-base font-semibold transition-all ${
//                         currentPage === page
//                           ? "bg-blue-600 text-white shadow-sm"
//                           : "text-gray-700 hover:bg-white hover:text-blue-600"
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   )
//                 )}

//                 <button
//                   type="button"
//                   onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
//                   disabled={currentPage === totalPages}
//                   className="grid h-9 w-9 place-items-center rounded-xl text-gray-600 transition-all hover:bg-white hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
//                   aria-label="Next page"
//                 >
//                   <ChevronRight size={18} />
//                 </button>
//               </div>

//               {/* Right: Go to Input */}
//               <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/80 px-2 py-1">
//                 <span className={`${oxanium.className} text-xs font-semibold text-gray-500`}>
//                   Go to
//                 </span>
//                 <input
//                   type="number"
//                   min={1}
//                   max={totalPages}
//                   value={pageInput}
//                   onChange={(e) => setPageInput(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       e.preventDefault();
//                       goToTypedPage();
//                     }
//                   }}
//                   className="h-8 w-16 rounded-lg border border-slate-200 bg-white px-2 text-sm font-semibold text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/25"
//                   aria-label="Type page number"
//                 />
//                 <button
//                   type="button"
//                   onClick={goToTypedPage}
//                   className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
//                 >
//                   Go
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "../components/SearchBar";
import ProductGrid from "../components/ProductGrid";
import CategoryFilter from "../components/CategoryFilter";
import PriceFilter from "../components/PriceFilter";
import SortDropdown from "../components/SortDropdown";
import Footer from "@/components/footer";
import { getAllProducts } from "../services/product.service";
import { Product } from "../types";
import { ArrowLeft, ChevronLeft, ChevronRight, Instagram, MessageCircle, Linkedin, Twitter } from "lucide-react";
import { Oxanium, Inter } from "next/font/google";

const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const PRODUCTS_PER_SLIDE = 16;

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{
    min?: number;
    max?: number;
  }>({});
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getAllProducts({
          query: searchQuery,
          category: selectedCategories[0],
         minPrice: priceRange.min,
         maxPrice: priceRange.max,
         limit: "all",
       });
        setProducts(data.items);
        setCurrentPage(1);
      } catch (error) {
        console.error("Failed to load products:", error);
        setProducts([]);
        setCurrentPage(1);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(loadProducts, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategories, priceRange]);

  const handleSort = (sortValue: string) => {
    setSortBy(sortValue);
    let sorted = [...products];

    switch (sortValue) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    setProducts(sorted);
  };

  const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PER_SLIDE));
  const startIndex = (currentPage - 1) * PRODUCTS_PER_SLIDE;
  const paginatedProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_SLIDE);

  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages: (number | "ellipsis")[] = [1];

    if (currentPage > 3) {
      pages.push("ellipsis");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    if (currentPage < totalPages - 2) {
      pages.push("ellipsis");
    }

    pages.push(totalPages);
    return pages;
  };

  const visiblePages = getVisiblePages();

  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  const goToTypedPage = () => {
    const parsed = parseInt(pageInput, 10);
    if (Number.isNaN(parsed)) {
      setPageInput(currentPage.toString());
      return;
    }

    const clampedPage = Math.min(Math.max(parsed, 1), totalPages);
    setCurrentPage(clampedPage);
    setPageInput(clampedPage.toString());
  };

  return (
    <div className={`${inter.className} space-y-8`}>
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
      >
        <ArrowLeft size={20} />
        Back
      </button>
      {/* Header */}
      <div>
        <h1 className={`${oxanium.className} mb-2 text-4xl font-bold text-gray-900`}>Browse Products</h1>
        <p className="text-gray-600">
          Explore all available items in our marketplace
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <SearchBar onSearch={setSearchQuery} placeholder="Search all products..." />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className={`${oxanium.className} space-y-6 lg:col-span-1`}>
          <CategoryFilter onFilterChange={setSelectedCategories} />
          <PriceFilter
            onFilterChange={(min, max) =>
              setPriceRange({ min: min, max: max })
            }
          />

          <div className="rounded-2xl border border-white/70 bg-white/60 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur-md">
            <h3 className={`${oxanium.className} mb-3 text-lg font-semibold text-gray-900`}>
              Price Trade Safely on Uni-Mart 🛡️
            </h3>

            <div className={`${inter.className} space-y-3 text-sm leading-relaxed text-gray-700`}>
              <p>
                🤝 <span className={`${oxanium.className} font-semibold text-gray-900`}>Meet in Public:</span> Always arrange handovers in high-traffic campus areas like the SLIIT library lobby, main canteen, or the student lounge.
              </p>
              <p>
                🔍 <span className={`${oxanium.className} font-semibold text-gray-900`}>Inspect Before Paying:</span> Thoroughly check the item’s condition in person. If it&apos;s a device, test it out before you finalize the deal.
              </p>
              <p>
                💳 <span className={`${oxanium.className} font-semibold text-gray-900`}>Secure Payments:</span> Use our integrated Card Payment or Bank Transfer options for a recorded transaction.
              </p>
              <p>
                🚫 <span className={`${oxanium.className} font-semibold text-gray-900`}>No Advance Payments:</span> Whether paying by cash or transfer, never pay before meeting the seller and inspecting the item. Only authorize the payment once the item is in your hand.
              </p>
              <p>
                📱 <span className={`${oxanium.className} font-semibold text-gray-900`}>Keep Chats Internal:</span> For your protection, keep all your negotiations and proof of agreement within the Uni-Mart chat system.
              </p>
              <p>
                🚩 <span className={`${oxanium.className} font-semibold text-gray-900`}>Report Suspicious Ads:</span> If a listing seems "too good to be true" or a seller pressures you to pay an advance before seeing the item, report it to us immediately.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/60 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur-md">
            <h3 className={`${oxanium.className} mb-4 text-lg font-semibold text-gray-900`}>
              Got Questions? 🙋‍♂️
            </h3>

            <div className={`${inter.className} space-y-5 text-sm leading-relaxed text-gray-700`}>
              <div>
                <h4 className={`${oxanium.className} mb-1 text-base font-semibold text-gray-900`}>
                  Help Center
                </h4>
                <p className="mb-3">
                  Need help with your account, listing, or payments? Find quick answers and step-by-step guides in our Help Center.
                </p>
                <button
                  type="button"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Visit Help Center
                </button>
              </div>

              <div className="border-t border-white/70 pt-4">
                <h4 className={`${oxanium.className} mb-1 text-base font-semibold text-gray-900`}>
                  Contact Support
                </h4>
                <p className="mb-2">
                  Can&apos;t find what you&apos;re looking for? Our dedicated support team is here to assist you with any issues.
                </p>
                <p>
                  <span className={`${oxanium.className} font-semibold text-gray-900`}>Email:</span> support@uni-mart.com
                </p>
                <p>
                  <span className={`${oxanium.className} font-semibold text-gray-900`}>Live Chat:</span> Available Mon - Fri (9 AM - 6 PM)
                </p>
                <button
                  type="button"
                  className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  Start a Chat
                </button>
              </div>

              <div className="border-t border-white/70 pt-4">
                <h4 className={`${oxanium.className} mb-1 text-base font-semibold text-gray-900`}>
                  Join the Community (Socials)
                </h4>
                <p className="mb-2">
                  Stay updated with the latest campus listings, trending items, and exclusive Uni-Mart deals!
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Instagram"
                    className="grid h-10 w-10 place-items-center rounded-xl bg-white/80 text-pink-600 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white"
                  >
                    <Instagram size={18} />
                  </button>
                  <button
                    type="button"
                    aria-label="WhatsApp"
                    className="grid h-10 w-10 place-items-center rounded-xl bg-white/80 text-emerald-600 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white"
                  >
                    <MessageCircle size={18} />
                  </button>
                  <button
                    type="button"
                    aria-label="LinkedIn"
                    className="grid h-10 w-10 place-items-center rounded-xl bg-white/80 text-blue-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white"
                  >
                    <Linkedin size={18} />
                  </button>
                  <button
                    type="button"
                    aria-label="X"
                    className="grid h-10 w-10 place-items-center rounded-xl bg-white/80 text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white"
                  >
                    <Twitter size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="lg:col-span-3">
          {/* Sort Bar */}
          <div className="relative z-20 mb-6 flex items-center justify-between rounded-2xl border border-white/70 bg-white/55 p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)] backdrop-blur-md">
            <div className="flex items-center gap-4">
              <span className="grid h-11 min-w-11 place-items-center rounded-xl bg-blue-100/80 px-3 text-sm font-semibold text-blue-700">
                {isLoading ? "..." : products.length}
              </span>
              <div className="leading-tight">
                <p className={`${oxanium.className} text-xl font-semibold text-gray-900`}>
                  {isLoading ? "Loading products..." : `${products.length} products found`}
                </p>
                <p className="text-sm font-medium text-gray-500">
                  Showing latest available items
                </p>
              </div>
            </div>
            <SortDropdown value={sortBy} onChange={handleSort} />
          </div>

          <ProductGrid products={paginatedProducts} isLoading={isLoading} />

          {!isLoading && products.length > 0 && (
            <div className="mt-8 flex items-center justify-between rounded-2xl border border-white/70 bg-white/60 px-6 py-4 text-slate-700 shadow-[0_10px_28px_rgba(15,23,42,0.10)] backdrop-blur-md">
              {/* Left: Page Indicator */}
              <div className={`${oxanium.className} text-sm font-semibold text-gray-700`}>
                {currentPage.toString().padStart(2, "0")} of {totalPages.toString().padStart(2, "0")}
              </div>

              {/* Middle: Pagination Controls */}
              <div className="inline-flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="grid h-9 w-9 place-items-center rounded-xl text-gray-600 transition-all hover:bg-white hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>

                {visiblePages.map((page, index) =>
                  page === "ellipsis" ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-base font-semibold text-gray-400">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`grid h-9 min-w-9 place-items-center rounded-xl px-2 text-base font-semibold transition-all ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-gray-700 hover:bg-white hover:text-blue-600"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="grid h-9 w-9 place-items-center rounded-xl text-gray-600 transition-all hover:bg-white hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Right: Go to Input */}
              <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/80 px-2 py-1">
                <span className={`${oxanium.className} text-xs font-semibold text-gray-500`}>
                  Go to
                </span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      goToTypedPage();
                    }
                  }}
                  className="h-8 w-16 rounded-lg border border-slate-200 bg-white px-2 text-sm font-semibold text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/25"
                  aria-label="Type page number"
                />
                <button
                  type="button"
                  onClick={goToTypedPage}
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Go
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer Component - Full Bleed Breakout with w-screen */}
      <div className="w-screen relative left-1/2 -translate-x-1/2 mt-12">
        <Footer />
      </div>
    </div>
  );
}