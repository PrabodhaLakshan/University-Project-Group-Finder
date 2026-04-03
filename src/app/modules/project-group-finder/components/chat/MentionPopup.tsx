"use client";

import { useEffect, useRef } from "react";
import { GroupMember } from "../../types/chat";

export default function MentionPopup({
    members,
    onSelect,
    selectedIndex,
}: {
    members: GroupMember[];
    onSelect: (member: GroupMember) => void;
    selectedIndex: number;
}) {
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        // Scroll selected item into view to ensure it stays visible during keyboard nav
        const item = listRef.current?.children[selectedIndex] as HTMLElement;
        if (item) {
            item.scrollIntoView({ block: "nearest" });
        }
    }, [selectedIndex]);

    if (members.length === 0) return null;

    return (
        <div className="absolute bottom-[calc(100%+8px)] left-2 mb-2 max-h-56 w-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white/95 shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50 backdrop-blur-md animate-in slide-in-from-bottom-2 fade-in duration-200">
            <div className="sticky top-0 bg-slate-50/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 backdrop-blur-md">
                Members
            </div>
            <ul ref={listRef} className="py-1 text-sm text-slate-700">
                {members.map((member, index) => {
                    const isActive = index === selectedIndex;
                    return (
                        <li
                            key={member.id}
                            className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-colors ${
                                isActive ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"
                            }`}
                            onClick={() => onSelect(member)}
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 overflow-hidden shadow-sm ring-2 ring-white">
                                {member.avatar_path ? (
                                    <img src={member.avatar_path} alt={member.name} className="h-full w-full object-cover" />
                                ) : (
                                    member.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
                                )}
                            </div>
                            <span className="font-medium truncate">{member.name}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
