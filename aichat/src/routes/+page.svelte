<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
  
    let chat = "";
    let isLoading = writable(false);
    let messages = writable<{ role: string; content: string }[]>([]);
  
    onMount(() => {
        messages.set([{ role: "ai", content: "Hey there! How can I assist you today?" }]);
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

<style>
    .chat-container {
        max-width: 600px;
        margin: auto;
        background: #f9f9f9;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .message {
        padding: 10px;
        border-radius: 8px;
        margin-bottom: 10px;
        max-width: 80%;
    }
    .user {
        background: #007bff;
        color: white;
        align-self: flex-end;
    }
    .ai {
        background: #e3e3e3;
        color: black;
        align-self: flex-start;
    }
    .input-container {
        display: flex;
        gap: 8px;
        margin-top: 12px;
    }
    input {
        flex-grow: 1;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #ccc;
    }
    button {
        padding: 10px 16px;
        border: none;
        border-radius: 8px;
        background: #007bff;
        color: white;
        cursor: pointer;
    }
</style>

<div class="chat-container" id="chat-container">
    {#each $messages as message}
        <div class="message {message.role}">{message.content}</div>
    {/each}
</div>

<div class="input-container">
    <input type="text" bind:value={chat} on:keypress={(e) => e.key === 'Enter' && onSubmit()} placeholder="Type a message..." />
    <button on:click={onSubmit} disabled={$isLoading}>Send</button>
</div>
