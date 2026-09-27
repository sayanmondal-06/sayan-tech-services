"use client";

import { FormEvent, useState } from "react";

type Message = {
  sender: "USER" | "AI";
  message: string;
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "AI",
      message:
        "Hi! I'm the Sayan Tech Services assistant. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = input.trim();

    if (!message || loading) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        sender: "USER",
        message,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          conversationId: conversationId || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessages((current) => [
          ...current,
          {
            sender: "AI",
            message:
              data.message ||
              "Unable to process your message.",
          },
        ]);

        return;
      }

      setConversationId(data.conversationId);

      setMessages((current) => [
        ...current,
        {
          sender: "AI",
          message: data.response,
        },
      ]);

      if (data.escalated && data.ticketId) {
        setMessages((current) => [
          ...current,
          {
            sender: "AI",
            message:
              `Your issue has been escalated to the support team. ` +
              `Your ticket ID is ${data.ticketId}.`,
          },
        ]);
      }
    } catch (error) {
      console.error("Assistant request error:", error);

      setMessages((current) => [
        ...current,
        {
          sender: "AI",
          message:
            "Unable to connect to the assistant right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function startNewConversation() {
    setMessages([
      {
        sender: "AI",
        message:
          "Hi! I'm the Sayan Tech Services assistant. How can I help you today?",
      },
    ]);

    setConversationId("");
    setInput("");
  }

  return (
    <main className="min-h-screen bg-[#080808] px-6 py-20 text-white lg:px-8">
      <div className="mx-auto flex min-h-[85vh] max-w-4xl flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <a
              href="/dashboard"
              className="text-sm text-white/40 transition hover:text-white"
            >
              ← Dashboard
            </a>

            <p className="mt-10 text-sm uppercase tracking-[0.25em] text-white/40">
              AI Assistant
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              How can I help?
            </h1>

            <p className="mt-3 max-w-2xl text-white/40">
              Ask about services, orders, testing, cybersecurity or support.
            </p>
          </div>

          <button
            type="button"
            onClick={startNewConversation}
            className="mt-10 rounded-full border border-white/10 px-4 py-2 text-sm text-white/50 transition hover:border-white/30 hover:text-white"
          >
            New chat
          </button>
        </div>

        {/* Chat */}
        <div className="mt-10 flex flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          {/* Messages */}
          <div className="flex min-h-[500px] flex-1 flex-col gap-4 overflow-y-auto p-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-7 ${
                  message.sender === "USER"
                    ? "ml-auto bg-white text-black"
                    : "mr-auto border border-white/10 bg-black text-white/70"
                }`}
              >
                {message.message}
              </div>
            ))}

            {loading && (
              <div className="mr-auto rounded-2xl border border-white/10 bg-black p-4 text-sm text-white/40">
                Thinking...
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="border-t border-white/10 p-4"
          >
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask something..."
                maxLength={2000}
                disabled={loading}
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/30 disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "..." : "Send"}
              </button>
            </div>

            <p className="mt-3 px-1 text-xs text-white/20">
              For serious issues, the assistant can automatically escalate
              your request to support.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}