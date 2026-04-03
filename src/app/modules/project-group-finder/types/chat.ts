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
    reply_to_id?: string | null;
    reply_to_message?: string | null;
    reply_to_sender?: string | null;
    created_at: string;
};

export type GroupMember = {
    id: string;
    name: string;
    avatar_path?: string | null;
};
