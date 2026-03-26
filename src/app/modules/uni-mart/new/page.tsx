"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "../services/product.service";
import { productSchema } from "../validations";
import { ZodError } from "zod";
import { Upload, X, ArrowLeft } from "lucide-react";
import { Oxanium, Inter } from "next/font/google";

const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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

export default function PostItemPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "used" as "new" | "used" | "refurbished",
    location: "",
    images: [] as string[],
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? (value ? parseFloat(value) : "") : value,
    }));
    // Clear error for this field
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

    // In a real app, you'd upload to a server/storage service
    // For now, we'll create data URLs
    for (let i = 0; i < Math.min(files.length, 5); i++) {
      const file = files[i];
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
    }
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
      // Validate form data
      const validatedData = productSchema.parse({
        ...formData,
        price: typeof formData.price === "string" ? 0 : formData.price,
      });

      // Create product
      await createProduct(validatedData);

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
        // Show the actual error message from the API
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

  const formValidation = productSchema.safeParse({
    ...formData,
    price: typeof formData.price === "string" ? 0 : formData.price,
  });
  const isFormValid = formValidation.success;
  const stepOneValid =
    formData.title.trim().length >= 3 &&
    formData.description.trim().length >= 10 &&
    formData.category.trim().length > 0;
  const stepTwoValid =
    typeof formData.price !== "string" && formData.price > 0 && formData.images.length >= 1;
  const progressChecks = [
    formData.title.trim().length > 0,
    formData.description.trim().length > 0,
    formData.category.trim().length > 0,
    formData.location.trim().length > 0,
    typeof formData.price !== "string" && formData.price > 0,
    formData.images.length > 0,
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
                    placeholder="What are you selling today?"
                    className="w-full rounded-lg border border-white/70 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                </div>

                <div>
                  <label className={`${oxanium.className} mb-2 block text-base font-medium text-gray-700`}>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell buyers what makes this item useful and its condition."
                    rows={5}
                    minLength={10}
                    className="w-full rounded-lg border border-white/70 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className={`${oxanium.className} mb-2 block text-base font-medium text-gray-700`}>Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/70 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                    >
                      <option value="">Pick the best category for your item</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
                  </div>

                  <div>
                    <label className={`${oxanium.className} mb-2 block text-base font-medium text-gray-700`}>Condition *</label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/70 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                    >
                      {CONDITIONS.map((cond) => (
                        <option key={cond} value={cond}>
                          {cond.charAt(0).toUpperCase() + cond.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`${oxanium.className} mb-2 block text-base font-medium text-gray-700`}>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Where can the buyer meet you on campus?"
                    className="w-full rounded-lg border border-white/70 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                  />
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
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="How much are you asking (Rs.)?"
                    className="w-full rounded-lg border border-white/70 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                </div>

                <div>
                  <label className={`${oxanium.className} mb-2 block text-base font-medium text-gray-700`}>Images (Max 5) *</label>

                  {uploadedImages.length < 5 && (
                    <label className="cursor-pointer rounded-lg border-2 border-dashed border-white/70 bg-white/50 p-8 text-center transition-colors hover:border-blue-400/80 hover:bg-white/65">
                      <Upload className="mx-auto mb-2 text-slate-500" size={32} />
                      <p className="font-medium text-slate-700">Click to upload or drag images</p>
                      <p className="text-sm text-slate-600">PNG, JPG, GIF up to 10MB</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
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

                  {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}
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
                    disabled={isLoading || !isFormValid || !stepTwoValid}
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
