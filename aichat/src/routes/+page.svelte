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
        max-width: 400px;
        margin: auto;
        display: flex;
        flex-direction: column;
        border: 1px solid #ccc;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    }

    .chat-header {
        background-color: #4a90e2;
        color: white;
        padding: 12px;
        text-align: center;
        font-weight: bold;
    }

    .chat-messages {
        padding: 10px;
        height: 300px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .message {
        padding: 8px 12px;
        border-radius: 6px;
        max-width: 75%;
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
        padding: 10px;
        border-top: 1px solid #ccc;
        background: white;
    }

    input {
        flex: 1;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        outline: none;
    }

    button {
        margin-left: 8px;
        padding: 8px 12px;
        background-color: #4a90e2;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
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
