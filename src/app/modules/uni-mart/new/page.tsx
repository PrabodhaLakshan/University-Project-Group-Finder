

"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createProduct } from "../services/product.service";
import { productSchema } from "../validations";
import { ZodError } from "zod";
import { Upload, X, ArrowLeft, ChevronDown, Check } from "lucide-react";
import { Oxanium, Inter, Poppins } from "next/font/google";
import Footer from "@/components/footer";
import {
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
  weight: ["400", "500", "600"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const CATEGORIES = [
  "Electronics",
  "Books",
  "Clothing",
  "Furniture",
  "Sports",
  "Notes & Study Materials",
  "Laptops & Accessories",
  "Phones & Tablets",
  "Other",
];

const CONDITIONS = ["new", "used", "refurbished"];

const CAMPUS_LOCATIONS = [
  "SLIIT UNI - Malabe",
  "SLIIT Metro - Colombo 03",
  "SLIIT Matara Center - Matara",
  "SLIIT Kandy UNI - Kandy",
  "SLIIT Kurunegala Center - Kurunegala",
  "SLIIT Jaffna Center - Jaffna",
];

type SelectOption = {
  value: string;
  label: string;
};

type ModernSelectProps = {
  name: string;
  value: string;
  onChange: (nextValue: string) => void;
  placeholder: string;
  options: SelectOption[];
};

function ModernSelect({ name, value, onChange, placeholder, options }: ModernSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full rounded-xl border border-slate-200/80 bg-white/85 px-4 py-2.5 pr-11 text-left shadow-sm backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-400"
      >
        <span className={value ? "text-slate-900" : "text-slate-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-30 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-slate-200 bg-white/95 p-1.5 shadow-[0_16px_40px_rgba(15,23,42,0.18)] backdrop-blur-md">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  isSelected
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <Check size={16} className="text-blue-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function PostItemPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "" as string | number,
    category: "",
    condition: "used" as "new" | "used" | "refurbished",
    location: "",
    images: [] as string[],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;

    // --- Live Validation & Formatting logic ---
    let errorMsg = "";

    if (name === "title") {
      if (value.length > 0 && value.length < 10) errorMsg = "Title must be at least 10 characters long.";
      if (value.length > 80) errorMsg = "Title cannot exceed 80 characters.";
    }

    if (name === "description") {
      if (value.length > 0 && value.length < 20) errorMsg = "Description must be at least 20 characters long.";
      
      // Regex to detect mobile numbers (SL format or general 10 digits) and emails
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
      const phoneRegex = /(?:\+94|0)[0-9]{2}[-\s]?[0-9]{3}[-\s]?[0-9]{4}/; 
      
      if (emailRegex.test(value) || phoneRegex.test(value)) {
        errorMsg = "Contact info (mobile numbers and emails) are not allowed in the description.";
      }
    }

    if (name === "price") {
      // Prevent entering decimals or negative signs by strictly matching digits only
      const noDecimalValue = value.replace(/[^0-9]/g, '');
      parsedValue = noDecimalValue ? Number(noDecimalValue) : "";

      const numValue = Number(parsedValue);
      if (parsedValue !== "" && numValue <= 0) {
        errorMsg = "Price must be greater than zero.";
      } else if (numValue > 1500000) {
        errorMsg = "Maximum price limit is Rs. 1,500,000.00";
      }
    }

    // Update form state
    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    // Update errors state dynamically
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (errorMsg) {
        newErrors[name] = errorMsg;
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  const handleSelectChange = (
    name: "category" | "condition" | "location",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "condition" ? (value as "new" | "used" | "refurbished") : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    let newErrors = { ...errors };
    delete newErrors.images; // Clear previous image errors

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB limit
    const currentImagesCount = uploadedImages.length;
    let addedCount = 0;

    for (let i = 0; i < files.length; i++) {
      if (currentImagesCount + addedCount >= 5) {
        newErrors.images = "You can only upload a maximum of 5 images.";
        break;
      }

      const file = files[i];

      // File Type Check
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        newErrors.images = "Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed.";
        continue;
      }

      // File Size Check (5MB)
      if (file.size > maxSize) {
        newErrors.images = "Image is too large. Max 5MB allowed";
        continue;
      }

      // Read valid files
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setUploadedImages((prev) => [...prev, imageUrl]);
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, imageUrl],
        }));
      };
      reader.readAsDataURL(file);
      addedCount++;
    }

    setErrors(newErrors);
    
    // Reset input value to allow selecting the same file again if it was removed
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Get the exact number value
      const rawPrice = typeof formData.price === "number" ? formData.price : 0;
      
      // Formatting price to exactly 2 decimal places (e.g., 1000 -> "1000.00")
      const formattedPrice = rawPrice.toFixed(2); 

      // Validate form data through schema (Schema validates it as a Number)
      const validatedData = productSchema.parse({
        ...formData,
        price: Number(formattedPrice),
      });

      // API Payload overrides price with the exact "1000.00" string so the DB receives the .00 correctly.
      const apiPayload = {
        ...validatedData,
        price: formattedPrice, 
      };

      // Create product
      await createProduct(apiPayload as any);

      // Success - redirect to products page
      router.push("/modules/uni-mart/my-items");
    } catch (error: unknown) {
      console.error("Product creation error:", error);
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          const path = err.path[0] as string;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      } else if (error instanceof Error) {
        console.error("Error message:", error.message);
        setErrors({ submit: error.message || "Failed to create product. Please try again." });
      } else {
        console.error("Unknown error type:", typeof error, error);
        setErrors({ submit: "Failed to create product. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Step Validations ---
  const stepOneValid =
    formData.title.trim().length >= 10 &&
    formData.title.trim().length <= 80 &&
    formData.description.trim().length >= 20 &&
    !/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(formData.description) && // No emails
    !/(?:\+94|0)[0-9]{2}[-\s]?[0-9]{3}[-\s]?[0-9]{4}/.test(formData.description) && // No phone numbers
    formData.category.trim().length > 0 &&
    formData.condition.trim().length > 0 &&
    formData.location.trim().length > 0 && // Location is now strictly required
    !errors.title &&
    !errors.description;

  const stepTwoValid =
    typeof formData.price === 'number' &&
    formData.price > 0 &&
    formData.price <= 1500000 &&
    formData.images.length >= 1 &&
    formData.images.length <= 5 &&
    !errors.price &&
    !errors.images;

  // Calculate Progress value
  const progressChecks = [
    formData.title.trim().length >= 10 && formData.title.trim().length <= 80,
    formData.description.trim().length >= 20 && !errors.description,
    formData.category.trim().length > 0,
    formData.location.trim().length > 0,
    typeof formData.price === 'number' && formData.price > 0 && formData.price <= 1500000,
    formData.images.length >= 1,
  ];
  const progressValue = Math.round(
    (progressChecks.filter(Boolean).length / progressChecks.length) * 100
  );

  return (
    <div
      className={`${inter.className} relative -mx-[calc(50vw-50%)] -mt-12 min-h-screen overflow-x-hidden bg-cover bg-top bg-no-repeat`}
      style={{ backgroundImage: "url('/images/unimart/unimart_BG1.jpg')" }}
    >
      <div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 lg:px-6">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <aside className="rounded-xl border border-blue-100 bg-blue-50/60 p-6 lg:col-span-2">
          <h2 className={`${oxanium.className} text-3xl font-bold text-gray-900`}>Ready to declutter your dorm? 🚀</h2>
          <p className="mt-3 text-gray-700">
            Follow these simple steps to find a buyer within the campus community instantly.
          </p>

          <div className="mt-6 rounded-lg border border-blue-100 bg-white/70 p-5">
            <h3 className={`${oxanium.className} text-lg font-semibold text-gray-900`}>Quick Tips to Sell Faster</h3>
            <ul className="mt-4 space-y-4 text-base leading-7 text-gray-700">
              <li>
                📸 <span className={`${oxanium.className} font-semibold`}>Snap Clear Photos:</span> Use natural light and show the item from multiple angles. High-quality visuals build immediate buyer trust.
              </li>
              <li>
                ✍️ <span className={`${oxanium.className} font-semibold`}>Be Honest & Detailed:</span> Mention the exact condition, how long it was used, and any minor flaws upfront. Honesty prevents future disputes.
              </li>
              <li>
                💰 <span className={`${oxanium.className} font-semibold`}>Set a Fair Price:</span> Check similar listings on UniNexus to stay competitive. A fair price is the fastest way to close a deal.
              </li>
              <li>
                🏷️ <span className={`${oxanium.className} font-semibold`}>Categorize Correcty:</span> Ensure your item appears in the right searches by selecting the most accurate category.
              </li>
              <li>
                ⚡ <span className={`${oxanium.className} font-semibold`}>Respond Quickly:</span> Interested buyers appreciate fast replies. Being responsive helps you secure the sale before someone else does.
              </li>
              <li>
                🤝 <span className={`${oxanium.className} font-semibold`}>Meet Safely:</span> Always arrange to meet in a well-lit, public campus location for the final handover.
              </li>
            </ul>
          </div>

          <div className="mt-6 rounded-lg border border-emerald-100 bg-emerald-50/70 p-4">
            <p className={`${oxanium.className} text-base font-semibold text-emerald-800`}>Trusted by 1000+ Students</p>
            <p className="mt-1 text-sm text-emerald-900/80">
              Join the growing community of active buyers & sellers at your University.
            </p>
          </div>
        </aside>

        <section className="lg:col-span-3">
          <div className="mb-6">
            <h1 className={`${oxanium.className} text-4xl font-bold text-gray-900`}>Post an Item</h1>
            <p className="mt-2 text-gray-600">
              Sell your items to campus community and earn money
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/60 bg-white/10 p-8 shadow-[0_12px_40px_rgba(15,23,42,0.18)] backdrop-blur-sm">
            <div className="rounded-xl border border-white/70 bg-white/45 p-4 shadow-sm backdrop-blur-sm">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-700 ">
                <span>Step {currentStep} of 2</span>
                <span>{progressValue}% Complete</span>
              </div>
              <div className="h-2 w-full rounded-full bg-black/10 shadow-sm backdrop-blur-sm">
                <div
                  className="h-2 rounded-full bg-blue-500/95 shadow-[0_0_12px_rgba(59,130,246,0.35)] transition-all duration-300"
                  style={{ width: `${progressValue}%` }}
                />
              </div>
            </div>

            {currentStep === 1 && (
              <>
                <h2 className={`${oxanium.className} text-xl font-semibold text-gray-900`}>Step 1: Item Info</h2>

                <div>
                  <label className={`${oxanium.className} mb-2 block text-base font-medium text-gray-700`}>Item Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    maxLength={80}
                    placeholder="What are you selling today? (Max 80 chars)"
                    className={`w-full rounded-lg border bg-white/70 px-4 py-2 shadow-sm backdrop-blur-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/80 ${errors.title ? 'border-red-400' : 'border-white/70'}`}
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                </div>

                <div>
                  <label className={`${oxanium.className} mb-2 block text-base font-medium text-gray-700`}>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell buyers what makes this item useful and its condition. (Min 20 chars, no contact info)"
                    rows={5}
                    className={`w-full rounded-lg border bg-white/70 px-4 py-2 shadow-sm backdrop-blur-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/80 ${errors.description ? 'border-red-400' : 'border-white/70'}`}
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className={`${oxanium.className} mb-2 block text-base font-medium text-gray-700`}>Category *</label>
                    <ModernSelect
                      name="category"
                      value={formData.category}
                      onChange={(nextValue) => handleSelectChange("category", nextValue)}
                      placeholder="Pick the best category"
                      options={CATEGORIES.map((category) => ({
                        value: category,
                        label: category,
                      }))}
                    />
                    {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
                  </div>

                  <div>
                    <label className={`${oxanium.className} mb-2 block text-base font-medium text-gray-700`}>Condition *</label>
                    <ModernSelect
                      name="condition"
                      value={formData.condition}
                      onChange={(nextValue) => handleSelectChange("condition", nextValue)}
                      placeholder="Select item condition"
                      options={CONDITIONS.map((condition) => ({
                        value: condition,
                        label: condition.charAt(0).toUpperCase() + condition.slice(1),
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <label className={`${oxanium.className} mb-2 block text-base font-medium text-gray-700`}>Location *</label>
                  <ModernSelect
                    name="location"
                    value={formData.location}
                    onChange={(nextValue) => handleSelectChange("location", nextValue)}
                    placeholder="Select campus location"
                    options={CAMPUS_LOCATIONS.map((location) => ({
                      value: location,
                      label: location,
                    }))}
                  />
                  {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <h2 className={`${oxanium.className} text-xl font-semibold text-gray-900`}>Step 2: Images & Price</h2>

                <div>
                  <label className={`${oxanium.className} mb-2 block text-base font-medium text-gray-700`}>Price (Rs.) *</label>
                  <input
                    type="number"
                    name="price"
                    min="1"
                    max="1500000"
                    step="1"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="How much are you asking (Rs.)? Whole numbers only."
                    className={`w-full rounded-lg border bg-white/70 px-4 py-2 shadow-sm backdrop-blur-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/80 ${errors.price ? 'border-red-400' : 'border-white/70'}`}
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                </div>

                <div>
                  <label className={`${oxanium.className} mb-2 block text-base font-medium text-gray-700`}>Images (Min 1, Max 5) *</label>

                  {uploadedImages.length < 5 && (
                    <label className="cursor-pointer rounded-lg border-2 border-dashed border-white/70 bg-white/50 p-8 text-center transition-colors hover:border-blue-400/80 hover:bg-white/65 flex flex-col items-center">
                      <Upload className="mx-auto mb-2 text-slate-500" size={32} />
                      <p className="font-medium text-slate-700">Click to upload or drag images</p>
                      <p className="text-sm text-slate-600">JPG, PNG, WEBP up to 5MB</p>
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg, image/jpg, image/png, image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}

                  {uploadedImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="group relative">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="h-32 w-full rounded-lg object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {errors.images && <p className="mt-2 text-sm font-medium text-red-500">{errors.images}</p>}
                </div>

                {errors.submit && (
                  <div className="rounded-lg border border-red-300/70 bg-red-50/85 px-4 py-3 text-red-700 backdrop-blur-sm">
                    {errors.submit}
                  </div>
                )}
              </>
            )}

            <div className="flex gap-4 pt-2">
              {currentStep === 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 rounded-lg border border-white/70 bg-white/60 px-6 py-2 font-medium text-slate-700 transition-colors hover:bg-white/80"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    disabled={!stepOneValid}
                    className="flex-1 rounded-lg bg-blue-600/90 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    Next Step
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 rounded-lg border border-white/70 bg-white/60 px-6 py-2 font-medium text-slate-700 transition-colors hover:bg-white/80"
                  >
                    Back to Item Info
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !stepTwoValid}
                    className="flex-1 rounded-lg bg-blue-600/90 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {isLoading ? "Posting..." : "Post Item"}
                  </button>
                </>
              )}
            </div>
          </form>
        </section>
        </div>
      </div>
    </div>
  );
}