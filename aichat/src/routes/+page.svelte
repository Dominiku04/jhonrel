    <script lang="ts">
        import { onMount } from "svelte";
        let response = "";
        let chat = "";
        let chatHistory: { text: string; type: "user" | "bot" }[] = [];

        const onSubmit = async () => {
            if (!chat.trim()) return;

            chatHistory = [...chatHistory, { text: chat, type: "user" }];
            const userInput = chat;
            chat = "";

            try {
                const req = await fetch("/api", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ chat: userInput })
                });
                const res = await req.json();

                response = JSON.stringify(res, null, 2); // Format JSON output
                chatHistory = [...chatHistory, { text: response, type: "bot" }];
            } catch (error) {
                console.error("Error:", error);
                response = "An error occurred.";
                chatHistory = [...chatHistory, { text: response, type: "bot" }];
            }
        };
    </script>

<style>
    .chat-container {
        max-width: 800px;
        height: 700px;
        margin: auto;
        display: flex;
        flex-direction: column;
        border: 1px solid #ccc;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
    }

    .chat-header {
        background-color: #4a90e2;
        color: white;
        padding: 20px;
        text-align: center;
        font-weight: bold;
        font-size: 2rem;
    }

    .chat-messages {
        padding: 20px;
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .message {
        padding: 15px 20px;
        border-radius: 10px;
        max-width: 85%;
        font-size: 1.5rem;
        word-wrap: break-word;
        white-space: pre-wrap;
    }

    .user {
        align-self: flex-end;
        background-color: #d1e8ff;
    }

    .bot {
        align-self: flex-start;
        background-color: #f1f1f1;
    }

    .chat-input {
        display: flex;
        padding: 20px;
        border-top: 1px solid #ccc;
        background: white;
    }

    input {
        flex: 1;
        padding: 15px;
        border: 1px solid #ccc;
        border-radius: 8px;
        outline: none;
        font-size: 1.5rem;
    }

    button {
        margin-left: 12px;
        padding: 15px 22px;
        background-color: #4a90e2;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1.5rem;
    }
</style>

<div class="chat-container">
    <div class="chat-header">AI Chatbot</div>
    <div class="chat-messages">
        {#each chatHistory as msg (msg.text)}
            <div class="message {msg.type}">{msg.text}</div>
        {/each}
    </div>
    <div class="chat-input">
        <input bind:value={chat} placeholder="Type a message..." on:keypress={(e) => e.key === 'Enter' && onSubmit()} />
        <button on:click={onSubmit}>Send</button>
    </div>
</div>

