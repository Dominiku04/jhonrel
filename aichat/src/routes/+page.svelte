<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    let chat = "";
    let isLoading = writable(false);
    let messages = writable<{ role: string; content: string }[]>([]);

    onMount(() => {
        messages.set([{ role: "ai", content: "Hello! I'm your AI-sistant. How can I help you today?" }]);
    });

    const onSubmit = async () => {
        if (!chat.trim()) return;

        const userContent = chat.trim();
        chat = "";

        messages.update(msgs => [...msgs, { role: "user", content: userContent }]);

        isLoading.set(true);
        scrollToBottom();

        try {
            const req = await fetch("/api", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat: userContent })
            });

            const res = await req.json();
            messages.update(msgs => [...msgs, { role: "ai", content: res.reply }]);

        } catch (error) {
            messages.update(msgs => [...msgs, { role: "ai", content: "Oops! Something went wrong." }]);
        } finally {
            isLoading.set(false);
            scrollToBottom();
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            const chatContainer = document.getElementById("chat-container");
            if (chatContainer) {
                chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
            }
        }, 100);
    };
</script>

<div class="chat-wrapper">
    <div class="chat-header">IG AI</div>
    
    <div class="chat-container" id="chat-container">
        {#each $messages as message}
            <div class="message {message.role}">{message.content}</div>
        {/each}
        {#if $isLoading}
            <div class="message ai typing">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        {/if}
    </div>
    <div class="input-container">
        <input type="text" bind:value={chat} on:keypress={(e) => e.key === 'Enter' && onSubmit()} placeholder="Message..." />
        <button on:click={onSubmit} disabled={$isLoading}>➤</button>
    </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Helvetica+Neue:wght@400;500;700&display=swap');
    
    /* Full viewport centering */
    :global(html, body) {
        height: 100%;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f5f5f5;
        font-family: 'Helvetica Neue', sans-serif;
    }

    /* Chat wrapper with shadow */
    .chat-wrapper {
        width: 400px;
        height: 600px;
        background: #fff;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        border: 1px solid #ddd;
    }

    .chat-header {
        padding: 12px;
        background: white;
        color: black;
        text-align: center;
        font-weight: bold;
        border-bottom: 1px solid #ddd;
    }

    .chat-container {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        display: flex;
        flex-direction: column;
        background: white;
    }

    .message {
        padding: 10px 14px;
        border-radius: 18px;
        margin-bottom: 10px;
        max-width: 75%;
        font-size: 14px;
        line-height: 1.4;
    }

    .user {
        background: #007aff;
        color: white;
        align-self: flex-end;
        border-bottom-right-radius: 6px;
    }

    .ai {
        background: #e5e5ea;
        color: black;
        align-self: flex-start;
        border-bottom-left-radius: 6px;
    }

    .input-container {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px;
        background: white;
        border-top: 1px solid #ddd;
        border-radius: 0 0 15px 15px;
    }

    input {
        flex-grow: 1;
        padding: 10px;
        border-radius: 20px;
        border: 1px solid #ddd;
        background: #f9f9f9;
        color: black;
        outline: none;
        font-size: 14px;
    }

    button {
        padding: 10px 16px;
        border: none;
        border-radius: 20px;
        background: #007aff;
        color: white;
        cursor: pointer;
    }
</style>