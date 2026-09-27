"use client";

import { FormEvent, useState } from "react";

type Message = {
  id: string;
  message: string;
  senderType: string;
  senderName: string;
  createdAt: string;
};

type Ticket = {
  id: string;
  subject: string;
  description: string | null;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
};

type Props = {
  tickets: Ticket[];
};

export default function SupportClient({ tickets: initialTickets }: Props) {
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(
    initialTickets[0]?.id ?? null
  );

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");

  const [reply, setReply] = useState("");
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const activeTicket =
    tickets.find((ticket) => ticket.id === selectedTicket) ?? null;

  async function createTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setCreating(true);
    setError("");

    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          description,
          priority,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to create ticket.");
        return;
      }

      window.location.reload();
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setCreating(false);
    }
  }

  async function sendReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeTicket || !reply.trim()) {
      return;
    }

    setSending(true);
    setError("");

    try {
      const response = await fetch(
        `/api/support/tickets/${activeTicket.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: reply,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to send reply.");
        return;
      }

      setTickets((current) =>
        current.map((ticket) =>
          ticket.id === activeTicket.id
            ? {
                ...ticket,
                status: "OPEN",
                messages: [
                  ...ticket.messages,
                  {
                    id: data.supportMessage.id,
                    message: data.supportMessage.message,
                    senderType: "USER",
                    senderName: "You",
                    createdAt: data.supportMessage.createdAt,
                  },
                ],
              }
            : ticket
        )
      );

      setReply("");
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      {/* New ticket */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-semibold">
          New Support Ticket
        </h2>

        <form onSubmit={createTicket} className="mt-6 space-y-4">
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Subject"
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-white/30"
          />

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe your issue..."
            rows={6}
            className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-white/30"
          />

          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none"
          >
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="URGENT">Urgent</option>
          </select>

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={creating}
            className="w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-white/80 disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create Ticket"}
          </button>
        </form>
      </section>

      {/* Tickets */}
      <section className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="space-y-3">
          {tickets.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm text-white/40">
                No support tickets yet.
              </p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket.id)}
                className={`w-full rounded-2xl border p-5 text-left transition ${
                  selectedTicket === ticket.id
                    ? "border-white/30 bg-white/[0.08]"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                }`}
              >
                <p className="font-medium">
                  {ticket.subject}
                </p>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-xs text-white/40">
                    {ticket.status.replaceAll("_", " ")}
                  </span>

                  <span className="text-xs text-white/30">
                    {ticket.priority}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
          {!activeTicket ? (
            <div className="flex min-h-[500px] items-center justify-center p-8 text-center">
              <p className="text-white/40">
                Select a ticket to view the conversation.
              </p>
            </div>
          ) : (
            <>
              <div className="border-b border-white/10 p-6">
                <h2 className="text-xl font-semibold">
                  {activeTicket.subject}
                </h2>

                <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/40">
                  <span>
                    Status:{" "}
                    {activeTicket.status.replaceAll("_", " ")}
                  </span>

                  <span>
                    Priority: {activeTicket.priority}
                  </span>
                </div>
              </div>

              <div className="max-h-[500px] space-y-4 overflow-y-auto p-6">
                {activeTicket.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-2xl p-4 ${
                      message.senderType === "USER"
                        ? "ml-8 bg-white/[0.08]"
                        : "mr-8 bg-black"
                    }`}
                  >
                    <div className="flex justify-between gap-4">
                      <p className="text-sm font-medium">
                        {message.senderType === "USER"
                          ? "You"
                          : message.senderName}
                      </p>

                      <p className="text-xs text-white/30">
                        {new Date(
                          message.createdAt
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/60">
                      {message.message}
                    </p>
                  </div>
                ))}
              </div>

              {activeTicket.status !== "CLOSED" &&
                activeTicket.status !== "RESOLVED" && (
                  <form
                    onSubmit={sendReply}
                    className="border-t border-white/10 p-6"
                  >
                    <textarea
                      value={reply}
                      onChange={(event) =>
                        setReply(event.target.value)
                      }
                      placeholder="Write a reply..."
                      rows={4}
                      className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-white/30"
                    />

                    <button
                      type="submit"
                      disabled={sending}
                      className="mt-3 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black disabled:opacity-50"
                    >
                      {sending ? "Sending..." : "Send Reply"}
                    </button>
                  </form>
                )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}