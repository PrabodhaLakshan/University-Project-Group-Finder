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
        <main className="mx-auto w-full max-w-[1500px] px-4 py-4 sm:px-6 lg:px-8">
            <ChatWindow groupId={id} />
        </main>
    );
}
