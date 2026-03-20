export type GroupMessage = {
    id: string;
    group_id: string;
    sender_id: string;
    sender_name?: string | null;
    sender_image?: string | null;
    message: string;
    created_at: string;
};