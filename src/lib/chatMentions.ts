import { CHAT_BOT_NAME } from "@/lib/chatBot";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeMentionValue(value: string) {
  return value
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const mentionAliases = Array.from(
  new Set(
    [
      CHAT_BOT_NAME,
      "UniNexus",
      "Uni Nexus",
      "UniNexus chat Bot",
      "UniNexus Bot",
      "Uni_Nexus",
    ].map(normalizeMentionValue)
  )
);

const mentionPatterns = mentionAliases.map((alias) => {
  const compactAlias = escapeRegExp(alias).replace(/\s+/g, "[\\s_-]*");
  return new RegExp(`(^|\\s)@${compactAlias}(?=\\s|$)`, "i");
});

export function isBotMentioned(message: string) {
  return mentionPatterns.some((pattern) => pattern.test(message));
}

export function stripBotMention(message: string) {
  let nextMessage = message;

  for (const alias of mentionAliases) {
    const compactAlias = escapeRegExp(alias).replace(/\s+/g, "[\\s_-]*");
    const pattern = new RegExp(`(^|\\s)@${compactAlias}(?=\\s|$)`, "gi");
    nextMessage = nextMessage.replace(pattern, " ");
  }

  return nextMessage.replace(/\s+/g, " ").trim();
}
