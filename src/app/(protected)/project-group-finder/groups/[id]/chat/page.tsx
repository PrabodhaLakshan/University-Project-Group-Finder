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

    const currentUserId = "11111111-1111-1111-1111-111111111111";
    const currentUserName = "Current User";
    const currentUserImage = "";

    return (
        <main className="p-6">
            <ChatWindow
                groupId={id}
                currentUserId={currentUserId}
                currentUserName={currentUserName}
                currentUserImage={currentUserImage}
            />
        </main>
    );
}