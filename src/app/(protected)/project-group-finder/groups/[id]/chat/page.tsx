import ChatWindow from "@/app/modules/project-group-finder/components/chat/ChatWindow";
import { notFound } from "next/navigation";

export default async function GroupChatPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    if (!id || id === "undefined") {
        notFound();
    }

    return (
        <main className="p-6">
            <ChatWindow groupId={id} />
        </main>
    );
}