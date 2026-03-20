import { z } from "zod";

// Product Validation
export const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000),
  price: z.number().positive("Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  condition: z.enum(["new", "used", "refurbished"]),
  location: z.string().optional(),
  images: z.array(z.string().url()).min(1, "At least 1 image is required"),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Order Validation (Checkout Form)
export const orderSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  paymentMethod: z.enum(["BANK", "CARD"]),
});

export type OrderFormData = z.infer<typeof orderSchema>;

// Bank Deposit Order Validation
export const bankDepositSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  paymentMethod: z.literal("BANK"),
  receiptFile: z.instanceof(File, { message: "Receipt is required" })
    .refine(file => file.size > 0, "Receipt file cannot be empty")
    .refine(file => file.type.startsWith("image/"), "Receipt must be an image"),
});

export type BankDepositFormData = z.infer<typeof bankDepositSchema>;

// Card Payment Order Validation
export const cardPaymentSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  paymentMethod: z.literal("CARD"),
  cardholderName: z.string().min(1, "Cardholder name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
});

export type CardPaymentFormData = z.infer<typeof cardPaymentSchema>;

// Chat Validation
export const messageSchema = z.object({
  conversationId: z.string().uuid("Invalid conversation ID"),
  text: z.string().min(1, "Message cannot be empty").max(2000),
});

export type MessageFormData = z.infer<typeof messageSchema>;

// Search Validation
export const searchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  condition: z.enum(["new", "used", "refurbished"]).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  page: z.number().optional().default(1),
});

export type SearchParams = z.input<typeof searchSchema>;

// Filter Validation
export const filterSchema = z.object({
  categories: z.array(z.string()).optional(),
  priceRange: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),
  condition: z.array(z.enum(["new", "used", "refurbished"])).optional(),
  rating: z.number().min(0).max(5).optional(),
  sortBy: z.enum(["newest", "price-low", "price-high", "rating"]).optional(),
});

export type FilterParams = z.infer<typeof filterSchema>;
