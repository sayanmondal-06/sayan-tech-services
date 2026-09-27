export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SupportClient from "./SupportClient";

export default async function SupportPage() {
  const user = await requireAuth();

  const tickets = await prisma.supportTicket.findMany({
    where: {
      userId: user.userId,
    },
    include: {
      messages: {
        include: {
          sender: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const serializedTickets = tickets.map((ticket) => ({
    id: ticket.id,
    subject: ticket.subject,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
    messages: ticket.messages.map((message) => ({
      id: message.id,
      message: message.message,
      senderType: message.senderType,
      senderName: message.sender.name,
      createdAt: message.createdAt.toISOString(),
    })),
  }));

  return (
    <main className="min-h-screen bg-[#080808] px-6 py-24 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <a
          href="/dashboard"
          className="text-sm text-white/40 transition hover:text-white"
        >
          ← Dashboard
        </a>

        <div className="mt-8">
          <p className="text-sm uppercase tracking-[0.25em] text-white/40">
            Client Support
          </p>
          <h1 className="mt-4 text-5xl font-semibold">Support</h1>
          <p className="mt-3 text-white/40">
            Create a ticket, follow replies and communicate with the support team.
          </p>
        </div>

        <div className="mt-10">
          <SupportClient tickets={serializedTickets} />
        </div>
      </div>
    </main>
  );
}
