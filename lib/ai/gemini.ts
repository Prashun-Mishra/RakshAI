import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

// Models tried in order — newest/most stable first, falls back automatically on 404/429/503.
const CHAT_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-2.5-pro",
];

const IMAGE_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-2.5-pro",
];

/** Returns true when the error means "model unavailable, quota hit, or temporary server error" — try next model */
function isRetryableModelError(error: unknown): boolean {
  if (!(error instanceof Error)) return true;
  const msg = error.message.toLowerCase();
  if (msg.includes("invalid_ai_response")) return false;
  return (
    msg.includes("404") ||
    msg.includes("429") ||
    msg.includes("503") ||
    msg.includes("500") ||
    msg.includes("unavailable") ||
    msg.includes("overloaded") ||
    msg.includes("demand") ||
    msg.includes("no longer available") ||
    msg.includes("quota") ||
    msg.includes("limit") ||
    msg.includes("not found")
  );
}

const assessmentSchema = z.object({
  severity: z.enum(["LOW", "MODERATE", "HIGH", "CRITICAL"]),
  confidence: z.string().min(1).max(120),
  likelyConditions: z.array(z.string().max(250)).max(5),
  firstAid: z.array(z.string().max(500)).min(1).max(8),
  questions: z.array(z.string().max(300)).max(5),
  disclaimer: z.string().min(1).max(600),
  summary: z.string().min(1).max(1600),
});

export type EmergencyAssessment = z.infer<typeof assessmentSchema>;

function extractJson(text: string) {
  return text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
}

export async function assessEmergency(message: string, priorMessages: string[] = []): Promise<EmergencyAssessment> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_NOT_CONFIGURED");

  const ai = new GoogleGenAI({ apiKey });
  const context = priorMessages.slice(-6).join("\n");
  const prompt = `You are RakshAI, an emergency first-aid triage assistant. You provide cautious, concise, non-diagnostic guidance for the first critical minutes of an emergency. You are not a replacement for emergency services or a clinician. Never state that a condition is certain. For HIGH or CRITICAL severity, explicitly tell the person to call their local emergency number or seek emergency care now. Do not recommend prescription medicines or risky procedures. If there is any immediate threat to life, say to call emergency services first.

Return ONLY a JSON object matching exactly this shape:
{"severity":"LOW|MODERATE|HIGH|CRITICAL","confidence":"low|medium|high","likelyConditions":["possible, non-certain condition"],"firstAid":["safe immediate action"],"questions":["brief next question"],"disclaimer":"medical safety disclaimer","summary":"clear plain-language assessment"}

Earlier conversation, if any:
${context || "None"}

Latest user message:
${message}`;

  let lastError: unknown;
  for (const modelName of CHAT_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });
      const aiText = response.text ?? "";
      const parsed = assessmentSchema.safeParse(JSON.parse(extractJson(aiText)));
      if (!parsed.success) throw new Error("INVALID_AI_RESPONSE");
      console.log(`[RakshAI] Chat responded using model: ${modelName}`);
      return parsed.data;
    } catch (error) {
      lastError = error;
      if (isRetryableModelError(error)) {
        console.warn(`[RakshAI] Model ${modelName} unavailable, trying next...`);
        continue;
      }
      throw error; // non-retryable — re-throw immediately
    }
  }
  throw lastError; // all models exhausted
}

export function assessmentToMessage(assessment: EmergencyAssessment) {
  const urgency = ["HIGH", "CRITICAL"].includes(assessment.severity) ? " Call your local emergency number or seek emergency care now." : "";
  return `${assessment.summary}${urgency}\n\nImmediate steps:\n${assessment.firstAid.map((item, index) => `${index + 1}. ${item}`).join("\n")}`;
}

const imageAssessmentSchema = z.object({
  injuryType: z.string().min(1).max(250),
  severity: z.enum(["LOW", "MODERATE", "HIGH", "CRITICAL"]),
  confidence: z.string().min(1).max(120),
  recommendations: z.array(z.string().max(500)).min(1).max(8),
});

function safeImageUrl(value: string) {
  const url = new URL(value);
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local") || /^127\.|^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\./.test(host)) throw new Error("UNSAFE_IMAGE_URL");
  return url;
}

export async function analyzeInjuryImage(imageUrl: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_NOT_CONFIGURED");

  const fetchResponse = await fetch(safeImageUrl(imageUrl), { signal: AbortSignal.timeout(15_000), redirect: "error" });
  if (!fetchResponse.ok) throw new Error("IMAGE_FETCH_FAILED");
  const contentType = fetchResponse.headers.get("content-type")?.split(";")[0] ?? "";
  if (!contentType.startsWith("image/")) throw new Error("INVALID_IMAGE");
  const image = Buffer.from(await fetchResponse.arrayBuffer());
  if (image.length === 0 || image.length > 8 * 1024 * 1024) throw new Error("INVALID_IMAGE");

  const prompt = `You are RakshAI's cautious visual first-aid assistant. Assess only visible injury features; never diagnose or claim certainty. If there may be severe bleeding, a deep wound, burn, deformity, loss of circulation, an eye injury, or another serious concern, use HIGH or CRITICAL and tell the person to call emergency services or seek urgent care. Return ONLY JSON: {"injuryType":"possible visible injury","severity":"LOW|MODERATE|HIGH|CRITICAL","confidence":"low|medium|high","recommendations":["safe immediate action"]}.`;

  const ai = new GoogleGenAI({ apiKey });

  let lastError: unknown;
  for (const modelName of IMAGE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [
          {
            parts: [
              { text: prompt },
              { inlineData: { data: image.toString("base64"), mimeType: contentType } },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      });
      const aiText = response.text ?? "";
      const parsed = imageAssessmentSchema.safeParse(JSON.parse(extractJson(aiText)));
      if (!parsed.success) throw new Error("INVALID_AI_RESPONSE");
      console.log(`[RakshAI] Image analyzed using model: ${modelName}`);
      return parsed.data;
    } catch (error) {
      lastError = error;
      if (isRetryableModelError(error)) {
        console.warn(`[RakshAI] Image model ${modelName} unavailable, trying next...`);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

