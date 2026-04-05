export const CHAT_BOT_USER_ID =
  process.env.CHAT_BOT_USER_ID || "11111111-1111-1111-1111-111111111111";

export const CHAT_BOT_NAME =
  process.env.CHAT_BOT_NAME || "UniNexus chat Bot";

export const CHAT_BOT_AVATAR =
  process.env.CHAT_BOT_AVATAR || "/images/navbar/UniNexus_nav_Logo_lightT.png";

export const SOCKET_SERVER_INTERNAL_URL =
  process.env.SOCKET_SERVER_INTERNAL_URL || "http://localhost:4000";

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export function getChatBotMentionMember() {
  return {
    id: CHAT_BOT_USER_ID,
    name: CHAT_BOT_NAME,
    avatar_path: CHAT_BOT_AVATAR,
  };
}

export function appendChatBotMentionMember<
  T extends { id: string; name: string; avatar_path?: string | null }
>(members: T[]) {
  if (members.some((member) => member.id === CHAT_BOT_USER_ID)) {
    return members;
  }

  return [
    ...members,
    getChatBotMentionMember() as T,
  ];
}

export function buildChatBotGroupMember(groupId: string) {
  return {
    id: `bot-${groupId}`,
    user_id: CHAT_BOT_USER_ID,
    role: "bot",
    joined_at: new Date(0).toISOString(),
    user: {
      id: CHAT_BOT_USER_ID,
      name: CHAT_BOT_NAME,
      email: "bot@uninexus.local",
      avatarUrl: CHAT_BOT_AVATAR,
      avatar_path: CHAT_BOT_AVATAR,
      specialization: "AI Assistant",
      student_id: "BOT",
      year: null,
      semester: null,
      skills: ["AI assistance", "Project help", "Code guidance"],
      bio: "UniNexus group chat assistant",
      github_url: null,
      linkedin_url: null,
      mobile_no: null,
    },
  };
}

export function appendChatBotGroupMember<
  T extends { user_id: string; role?: string | null }
>(members: T[], groupId: string) {
  if (members.some((member) => member.user_id === CHAT_BOT_USER_ID)) {
    return members;
  }

  return [
    ...members,
    buildChatBotGroupMember(groupId) as T,
  ];
}
