import { SOCKET_SERVER_INTERNAL_URL } from "@/lib/chatBot";

export async function emitGroupMessage(groupId: string, message: unknown) {
  try {
    const response = await fetch(
      `${SOCKET_SERVER_INTERNAL_URL}/internal/emit-group-message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groupId, message }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to emit group message:", response.status, errorText);
    }
  } catch (error) {
    console.error("Socket relay error:", error);
  }
}
