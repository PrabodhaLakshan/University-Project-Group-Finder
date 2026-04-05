import { CHAT_BOT_NAME, GEMINI_MODEL } from "@/lib/chatBot";

type RecentMessage = {
  sender_name?: string | null;
  message: string;
};

const fallbackReply =
  "Samawenna, mata dan reply ekak denna beri una. Tawa tikakin nawatha try karanna.";

function detectReplyLanguage(text: string) {
  const normalized = text.toLowerCase();
  const hasSinhalaChars = /[\u0D80-\u0DFF]/.test(text);
  const singlishHints = [
    "mokak",
    "kohomada",
    "kiyala",
    "karanna",
    "eka",
    "mata",
    "mage",
    "dan",
    "thiyenawa",
    "neda",
    "ane",
    "meka",
    "poddak",
    "hari",
    "barida",
    "ona",
    "puluwan",
  ];

  const singlishScore = singlishHints.reduce((score, hint) => {
    return normalized.includes(hint) ? score + 1 : score;
  }, 0);

  if (hasSinhalaChars || singlishScore >= 2) {
    return "sinhala";
  }

  return "english";
}

export async function getUniNexusReply(params: {
  userQuestion: string;
  recentMessages?: RecentMessage[];
  groupName?: string | null;
}) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return (
      "GEMINI_API_KEY `.env` file eke set karala nehe.\n" +
      "The `GEMINI_API_KEY` is missing from the environment."
    );
  }

  const { userQuestion, recentMessages = [], groupName } = params;
  const replyLanguage = detectReplyLanguage(userQuestion);

  const historyBlock = recentMessages
    .slice(-8)
    .map((message) => `${message.sender_name || "User"}: ${message.message}`)
    .join("\n");

  const languageInstruction =
    replyLanguage === "sinhala"
      ? "Reply only in Sinhala. You may use simple Sinhala script or very light Singlish only if needed, but prefer natural Sinhala."
      : "Reply only in clear English.";

  const prompt = [
    `You are ${CHAT_BOT_NAME}, an AI assistant inside a university project group chat.`,
    languageInstruction,
    "Keep the answer practical, polished, friendly, and easy to scan.",
    "Use short paragraphs or simple bullets. Avoid long walls of text.",
    "If suitable, structure the answer like: short answer, why, what to do next.",
    "If the question is about a code error, explain: the likely cause, why it happens, and how to fix it.",
    "If the user asks for a recommendation or opinion, give a direct answer first, then a short reason.",
    "Sound helpful and confident, not robotic.",
    "Do not say you executed code or inspected files unless the prompt explicitly says so.",
    `Group: ${groupName || "Unknown group"}`,
    "",
    "Recent chat context:",
    historyBlock || "No recent context.",
    "",
    "User question:",
    userQuestion,
    "",
    "Formatting rules:",
    "- No markdown headings unless really needed.",
    "- Do not output both Sinhala and English together unless the user explicitly asks for both.",
    "- Keep the reply reasonably short by default.",
  ].join("\n");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 600,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return fallbackReply;
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

    return text || fallbackReply;
  } catch (error) {
    console.error("Gemini request failed:", error);
    return fallbackReply;
  }
}
