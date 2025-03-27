import { json, type RequestHandler } from "@sveltejs/kit";
import { Ollama } from "ollama";

export const POST: RequestHandler = async ({ request }) => {
    const ollama = new Ollama({ host: "http://localhost:11434" });

    try {
        const { chat } = await request.json();
        if (!chat?.trim()) return json({ error: "Please provide a valid message." }, { status: 400 });

        const user = {
            name: "Jhon Rel Talmento",
            hobbies: ["Cooking", "Travel", "Singing", "Swimming"],
            likes: "Sleep and Eat",
            age: "21",
            mothername: "Jacquelyn Singua",
            home: "Morong Bataan",
            school: "Gordon College",
            birthday: "Dec 19, 2003",
            zodiacsign: "Sagittarius"
        };

        const prompt = `
        You are an AI assistant. Return only a valid JSON response following this schema:

        {
            "summary_of_context_data": "Brief summary of the user's context.",
            "master_user_name": "${user.name}",
            "sensitive_information_present": true or false,
            "confidence_level": A number from 1 to 10,
            "user_persona_description": "A description of the user's personality based on context."
        }

        User Context:
        - Name: ${user.name}
        - Age: ${user.age}
        - Home: ${user.home}
        - School: ${user.school}
        - Hobbies: ${user.hobbies.join(", ")}
        - Birthday: ${user.birthday}
        - Zodiac Sign: ${user.zodiacsign}

        **User Request:** "${chat}"
        **Strict JSON Response (no extra text):**`;

        const response = await ollama.chat({
            model: "deepseek-r1:latest",
            messages: [{ role: "user", content: prompt }]
        });

        const rawReply = response?.message?.content || "{}";
        const match = rawReply.match(/\{[\s\S]*\}/);

        return json(match ? JSON.parse(match[0]) : { error: "Invalid AI response format" });
    } catch (error) {
        console.error("Chat API Error:", error);
        return json({ error: "An error occurred while processing your request." }, { status: 500 });
    }
};

