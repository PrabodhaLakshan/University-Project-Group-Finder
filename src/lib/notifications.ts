import { prisma } from "@/lib/prismaClient";

type NotificationType =
  | "ORDER_PLACED"
  | "PAYMENT_UPLOADED"
  | "PAYMENT_VERIFIED"
  | "ORDER_REJECTED"
  | "ITEM_SOLD"
  | "NEW_MESSAGE";

export interface CreateNotificationInput {
  userId: string; // receiver/recipient of the notification
  title: string;
  message: string;
  type: NotificationType;
  orderId?: string;
  link?: string;
}

function buildDefaultLink(type: NotificationType, orderId?: string) {
  switch (type) {
    case "ORDER_PLACED":
      return orderId ? `/modules/uni-mart/orders/${orderId}` : "/modules/uni-mart/orders/seller";
    case "PAYMENT_UPLOADED":
      return "/modules/uni-mart/sales";
    case "PAYMENT_VERIFIED":
    case "ORDER_REJECTED":
      return orderId ? `/modules/uni-mart/orders/${orderId}` : "/modules/uni-mart/purchase-history";
    case "ITEM_SOLD":
      return "/modules/uni-mart/sales-history";
    case "NEW_MESSAGE":
      return "/modules/uni-mart/messages";
    default:
      return "/modules/uni-mart/notifications";
  }
}

export async function createNotification(input: CreateNotificationInput) {
  try {
    const link = input.link || buildDefaultLink(input.type, input.orderId);

    const notification = await prisma.app_notifications.create({
      data: {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        receiver_id: input.userId,
        title: input.title,
        message: input.message,
        type: input.type,
        is_read: false,
        meta: {
          ...(input.orderId ? { orderId: input.orderId } : {}),
          link,
        },
      },
    });
    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error);
    // Don't throw - notifications shouldn't break the main operation
    return null;
  }
}
