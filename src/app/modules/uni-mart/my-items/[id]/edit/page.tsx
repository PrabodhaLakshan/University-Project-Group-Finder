"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById, updateProduct } from "../../../services/product.service";
import { Product } from "../../../types";
import { ArrowLeft, Upload, X, Save } from "lucide-react";

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

const CONDITIONS = ["new", "used", "refurbished"] as const;

export default function EditMyItemPage() {
  const router = useRouter();
  const params = useParams();
  const productId = typeof params.id === "string" ? params.id : "";

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "used" as (typeof CONDITIONS)[number],
    location: "",
    images: [] as string[],
  });

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        setIsLoading(false);
        setSubmitError("Invalid product id");
        return;
      }

      try {
        setIsLoading(true);
        setSubmitError(null);
        const product: Product = await getProductById(productId);

        setFormData({
          title: product.title,
          description: product.description,
          price: product.price.toString(),
          category: product.category,
          condition: product.condition,
          location: product.location || "",
          images: product.images || [],
        });
        setUploadedImages(product.images || []);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load product";
        setSubmitError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const availableSlots = Math.max(0, 5 - uploadedImages.length);
    const count = Math.min(files.length, availableSlots);

    for (let index = 0; index < count; index++) {
      const file = files[index];
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const imageUrl = loadEvent.target?.result as string;
        setUploadedImages((previous) => [...previous, imageUrl]);
        setFormData((previous) => ({
          ...previous,
          images: [...previous.images, imageUrl],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setUploadedImages((previous) => previous.filter((_, index) => index !== indexToRemove));
    setFormData((previous) => ({
      ...previous,
      images: previous.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    if (!productId) {
      setSubmitError("Invalid product id");
      return;
    }

    const trimmedTitle = formData.title.trim();
    const trimmedDescription = formData.description.trim();
    const parsedPrice = Number(formData.price);

    if (!trimmedTitle || !trimmedDescription || !formData.category || !formData.condition) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setSubmitError("Price must be greater than 0");
      return;
    }

    if (formData.images.length === 0) {
      setSubmitError("At least one image is required");
      return;
    }

    try {
      setIsSaving(true);
      await updateProduct(productId, {
        title: trimmedTitle,
        description: trimmedDescription,
        price: parsedPrice,
        category: formData.category,
        condition: formData.condition,
        location: formData.location.trim(),
        images: formData.images,
      });

      router.push("/modules/uni-mart/my-items");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update product";
      setSubmitError(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading item...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Item</h1>
        <p className="text-gray-600">Update your listing details</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Item Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price (LKR) *</label>
            <input
              type="number"
              min="1"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CONDITIONS.map((itemCondition) => (
                <option key={itemCondition} value={itemCondition}>
                  {itemCondition}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Images (Max 5) *</label>
          <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
            <div className="text-center">
              <Upload className="mx-auto text-gray-400 mb-2" size={24} />
              <p className="text-sm text-gray-600">Click to upload images</p>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {uploadedImages.map((image, index) => (
                <div key={`${index}-${image.slice(0, 12)}`} className="relative rounded-lg overflow-hidden border">
                  <img src={image} alt={`Uploaded ${index + 1}`} className="w-full h-24 object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {submitError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Save size={18} />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
