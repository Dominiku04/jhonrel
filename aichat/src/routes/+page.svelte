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
        max-width: 600px;
        height: 500px;
        margin: auto;
        display: flex;
        flex-direction: column;
        border: 1px solid #ccc;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.15);
    }

    .chat-header {
        background-color: #4a90e2;
        color: white;
        padding: 16px;
        text-align: center;
        font-weight: bold;
        font-size: 1.5rem;
    }

    .chat-messages {
        padding: 15px;
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .message {
        padding: 12px 16px;
        border-radius: 8px;
        max-width: 80%;
        font-size: 1.2rem;
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
        padding: 15px;
        border-top: 1px solid #ccc;
        background: white;
    }

    input {
        flex: 1;
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 6px;
        outline: none;
        font-size: 1.2rem;
    }

    button {
        margin-left: 10px;
        padding: 12px 18px;
        background-color: #4a90e2;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1.2rem;
    }
</style>

<div class="chat-container">
    <div class="chat-header">AI-REL</div>
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
