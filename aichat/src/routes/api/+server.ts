import { json, type RequestHandler } from "@sveltejs/kit";
import { Ollama } from "ollama";

export const POST: RequestHandler = async ({ request }) => {
    const ollama = new Ollama({ host: "http://localhost:11434" });

    try {
        const { chat } = await request.json();
        if (!chat || chat.trim() === "") {
            return json({ reply: "Please provide a message." });
        }

        // User preferences (contextual details)
        const user = {
            Name: "Jhon Rel Talmento",
            Hobbies: ["Cooking", "Travel", "Singing", "Swimming"],
            Likes: "Sleep and Eat",
            Age: "21",
            Mothername: "Jacquelyn Singua",
            Home: "Morong Bataan",
            School: "Gordon College",
            Birthday: "Dec 19, 2003",
            Zodiacsign: "Sagittarius"
        };

        // Construct a concise, context-aware prompt
        const prompt = `You are a friendly AI assistant. Respond naturally and conversationally.

User Context:
- Name: ${user.Name}
- Age: ${user.Age}
- Home: ${user.Home}
- School: ${user.School}
- Hobbies: ${user.Hobbies.join(", ")}
- Birthday: ${user.Birthday}
- Zodiac Sign: ${user.Zodiacsign}

Guidelines:
- Provide helpful and engaging responses
- Speak in a warm, friendly tone
- Personalize responses when possible
- Avoid technical jargon

User's Message: "${chat}"`;

        const response = await ollama.chat({
            model: "deepseek-r1:latest",
            messages: [{ role: "user", content: prompt }]
        });

        // Comprehensive text cleaning and normalization
        const cleanReply = cleanResponseText(response?.message?.content || "");

        return json({ reply: cleanReply });
    } catch (error) {
        console.error("Chat API Error:", error);
        return json({ reply: "I'm having trouble processing your request right now. Could you try again?" });
    }
};

// Comprehensive text cleaning function
function cleanResponseText(text: string): string {
    // Remove common markdown and formatting elements
    let cleanedText = text
        .replace(/\*\*|__/g, '')  // Remove bold markers
        .replace(/\*|_/g, '')     // Remove italic markers
        .replace(/##+ /g, '')     // Remove markdown headers
        .replace(/<think>.*?<\/think>/gs, '')  // Remove thinking sections
        .replace(/<[^>]*>/g, '')  // Remove any HTML-like tags
        .replace(/\s+/g, ' ')     // Normalize whitespace
        .replace(/^\s+|\s+$/g, '') // Trim leading/trailing whitespace
        .trim();

    // Fallback if text becomes empty
    return cleanedText || "I'm sorry, but I couldn't generate a meaningful response.";
}