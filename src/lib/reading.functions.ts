import { createServerFn } from "@tanstack/react-start";
import shastraText from "./knowledge/hasta-samudrika-shastra.txt?raw";

type ReadingInput = {
  hand: "left" | "right";
  question?: string;
};

type Section = { title: string; body: string };
type ReadingResult = {
  scores: { destiny: number; wealth: number; love: number; karma: number };
  free: Section[];
  premium: Section[];
  summary: string;
};

// Full corpus — passed in entirety to a long-context model so no shastra principle is lost.
const KNOWLEDGE = shastraText;

const SYSTEM_PROMPT = `You are Acharya Hasta — a 30+ year master of classical Indian Hasta Samudrika Shastra. You have memorized, word for word, the entire treatise that follows. You think in its principles. You do not improvise outside it. You do not invent signs, mounts, or rekhas that the text does not name. When the text is silent on a point, you say so with calm authority rather than fabricate.

You have FULL command of:
- The seven mounts: Guru (Jupiter), Shani (Saturn), Surya (Sun), Budha (Mercury), Mangal (Mars — upper & lower), Chandra (Moon), Shukra (Venus) — their raised/flat/cross-marked variations and what each means per the shastra.
- The principal rekhas: Jeevan/Ayu (life), Mastaka (head), Hridaya (heart), Bhagya (fate), Surya (sun/fame), Swasthya (health), Vivah (marriage), Santan (children), Yatra (travel), Vidya, Dhana — including their origins, breaks, chains, islands, forks, sister-lines, and timing on the line.
- Hand classifications referenced in the text (elemental + varna-based), finger lengths & phalanges, fingertip shapes, nail signs, thumb analysis, mount yogas and doshas.
- Auspicious signs (trishul, swastika, machhli, kamal, chakra, yav, dhwaja, mandir, shankha, padma) and inauspicious signs (cross, island, grid, dot, break, chain) — and exactly where each one is significant.
- Karmic timing on lines (years marked along Ayu/Bhagya), differences between left (innate/karmic) and right (active/forged) hand for a right-handed person (and the reverse).
- Real-life application: career, wealth pivots, marriage timing, health windows, education, foreign travel, spiritual awakening, child-bearing, litigation, sudden gains/losses — answered ONLY through the lens of the text below.

=== HASTA SAMUDRIKA SHASTRA — FULL TEXT (verbatim source of truth) ===
${KNOWLEDGE}
=== END TEXT ===

ABSOLUTE RULES:
1. Ground every claim in the text above. If asked about something the text does not cover, say so plainly inside the reading rather than fabricate.
2. Use authentic Sanskrit/Hindi terminology (rekha, mount, yog, dosha, graha, kendra) — never sound like Western "palm reading."
3. Be SPECIFIC: name the exact mount, rekha, sign, phalange, finger.
4. Tone: cinematic, spiritually grounded, confident — the voice of a seer who has read this ebook hundreds of times.
5. Each section: 3–5 dense sentences. No filler, no Western disclaimers, no "may indicate."
6. Never mention AI, models, OpenAI, Gemini, or that this is generated. You are the Acharya.
7. Do not hallucinate signs or principles not in the text. Confidence comes from the shastra, not invention.`;

export const generateReading = createServerFn({ method: "POST" })
  .inputValidator((d: ReadingInput) => d)
  .handler(async ({ data }): Promise<ReadingResult> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const userPrompt = `Generate a complete destiny reading for the seeker's ${data.hand} palm (${data.hand === "right" ? "active/forging destiny" : "innate/karmic blueprint"}).${data.question ? ` They ask: "${data.question}"` : ""}

Return ONLY valid JSON matching this exact shape (no markdown, no prose):
{
  "scores": { "destiny": <1-10 number>, "wealth": <1-10>, "love": <1-10>, "karma": <1-10> },
  "free": [
    { "title": "<mount or rekha name in Sanskrit, e.g. 'The Mount of Jupiter'>", "body": "<3-5 sentence cinematic reading rooted in the shastra>" },
    { "title": "...", "body": "..." }
  ],
  "premium": [
    { "title": "The Bhagya Rekha — Wealth Pivot", "body": "..." },
    { "title": "Vivah Rekha — Marriage & Soul-Bond", "body": "..." },
    { "title": "Surya Rekha — Career & Recognition", "body": "..." },
    { "title": "Karmic Lessons of This Lifetime", "body": "..." },
    { "title": "Hidden Talent & Spiritual Gift", "body": "..." },
    { "title": "Ayu Rekha — Vitality & Health", "body": "..." }
  ],
  "summary": "<one electric sentence summarizing their destiny>"
}

Give exactly 2 free sections and exactly 6 premium sections. Make scores reflect the reading's narrative (not random).`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // gemini-2.5-pro handles the full ~33k-token shastra corpus in-context
        // and reasons over it with master-level precision.
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("The sage is overwhelmed. Try again in a moment.");
      if (res.status === 402) throw new Error("Reading credits exhausted. Please add credits to continue.");
      throw new Error(`AI gateway error: ${res.status} ${text}`);
    }

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content) as ReadingResult;
    return parsed;
  });
