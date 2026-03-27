export type GroupMessage = {
    id: string;
    group_id: string;
    sender_id: string;
    sender_name?: string | null;
    sender_image?: string | null;
    message: string;
    attachment_type?: "image" | "video" | "voice" | null;
    attachment_url?: string | null;
    attachment_name?: string | null;
    attachment_bucket?: string | null;
    attachment_path?: string | null;
    created_at: string;
};
