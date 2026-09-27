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
  clientName: string;
  clientEmail: string;
  createdAt: string;
  messages: Message[];
};

type Props = {
  tickets: Ticket[];
};

const statuses = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING_FOR_CLIENT",
  "RESOLVED",
  "CLOSED",
];

const priorities = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
];

export default function AdminSupportClient({
  tickets: initialTickets,
}: Props) {
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialTickets[0]?.id ?? null
  );
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const selectedTicket =
    tickets.find((ticket) => ticket.id === selectedId) ?? null;

  async function updateTicket(
    field: "status" | "priority",
    value: string
  ) {
    if (!selectedTicket) {
      return;
    }

    const response = await fetch(
      `/api/admin/support/${selectedTicket.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [field]: value,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Unable to update ticket.");
      return;
    }

    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === selectedTicket.id
          ? {
              ...ticket,
              [field]: value,
            }
          : ticket
      )
    );
  }

  async function sendReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedTicket || !reply.trim()) {
      return;
    }

    setSending(true);

    try {
      const response = await fetch(
        `/api/admin/support/${selectedTicket.id}`,
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
        alert(data.message || "Unable to send reply.");
        return;
      }

      setTickets((current) =>
        current.map((ticket) =>
          ticket.id === selectedTicket.id
            ? {
                ...ticket,
                status: "IN_PROGRESS",
                messages: [
                  ...ticket.messages,
                  {
                    id: data.supportMessage.id,
                    message: data.supportMessage.message,
                    senderType: "ADMIN",
                    senderName: "Admin",
                    createdAt: data.supportMessage.createdAt,
                  },
                ],
              }
            : ticket
        )
      );

      setReply("");
    } catch {
      alert("Unable to connect to the server.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
      {/* Ticket list */}
      <section className="space-y-3">
        {tickets.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <p className="text-white/40">
              No support tickets yet.
            </p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => setSelectedId(ticket.id)}
              className={`w-full rounded-2xl border p-5 text-left transition ${
                selectedId === ticket.id
                  ? "border-white/30 bg-white/[0.08]"
                  : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
              }`}
            >
              <p className="font-medium">
                {ticket.subject}
              </p>

              <p className="mt-2 text-sm text-white/40">
                {ticket.clientName}
              </p>

              <p className="mt-1 text-xs text-white/30">
                {ticket.clientEmail}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-white/50">
                  {ticket.status.replaceAll("_", " ")}
                </span>

                <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-white/50">
                  {ticket.priority}
                </span>
              </div>
            </button>
          ))
        )}
      </section>

      {/* Ticket detail */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.03]">
        {!selectedTicket ? (
          <div className="flex min-h-[600px] items-center justify-center p-8">
            <p className="text-white/40">
              Select a ticket.
            </p>
          </div>
        ) : (
          <>
            <div className="border-b border-white/10 p-6">
              <div className="flex flex-col justify-between gap-5 md:flex-row">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {selectedTicket.subject}
                  </h2>

                  <p className="mt-2 text-sm text-white/40">
                    {selectedTicket.clientName} ·{" "}
                    {selectedTicket.clientEmail}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <select
                    value={selectedTicket.status}
                    onChange={(event) =>
                      updateTicket(
                        "status",
                        event.target.value
                      )
                    }
                    className="rounded-xl border border-white/10 bg-black px-3 py-2 text-sm outline-none"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedTicket.priority}
                    onChange={(event) =>
                      updateTicket(
                        "priority",
                        event.target.value
                      )
                    }
                    className="rounded-xl border border-white/10 bg-black px-3 py-2 text-sm outline-none"
                  >
                    {priorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="max-h-[550px] space-y-4 overflow-y-auto p-6">
              {selectedTicket.messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-2xl p-5 ${
                    message.senderType === "ADMIN"
                      ? "ml-8 bg-white/[0.08]"
                      : "mr-8 bg-black"
                  }`}
                >
                  <div className="flex justify-between gap-4">
                    <p className="text-sm font-medium">
                      {message.senderType === "ADMIN"
                        ? "You / Admin"
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

            {selectedTicket.status !== "CLOSED" && (
              <form
                onSubmit={sendReply}
                className="border-t border-white/10 p-6"
              >
                <textarea
                  value={reply}
                  onChange={(event) =>
                    setReply(event.target.value)
                  }
                  placeholder="Reply to the client..."
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
      </section>
    </div>
  );
}