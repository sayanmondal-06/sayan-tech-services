export const dynamic = "force-dynamic";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminSupportClient from "./AdminSupportClient";

export default async function AdminSupportPage() {
  await requireAdmin();

  const tickets = await prisma.supportTicket.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
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
    clientName: ticket.user.name,
    clientEmail: ticket.user.email,
    createdAt: ticket.createdAt.toISOString(),
    messages: ticket.messages.map((message) => ({
      id: message.id,
      message: message.message,
      senderType: message.senderType,
      senderName: message.sender.name,
      createdAt: message.createdAt.toISOString(),
    })),
  }));

  return (
    <main className="min-h-screen bg-[#080808] px-6 py-32 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <a
          href="/admin"
          className="text-sm text-white/40 transition hover:text-white"
        >
          ← Admin Dashboard
        </a>

        <div className="mt-8">
          <p className="text-sm uppercase tracking-[0.25em] text-white/40">
            Administration
          </p>
          <h1 className="mt-4 text-5xl font-semibold">Manage Support</h1>
          <p className="mt-3 text-white/40">
            Review client tickets, update their status and reply to clients.
          </p>
        </div>

        <div className="mt-12">
          <AdminSupportClient tickets={serializedTickets} />
        </div>
      </div>
    </main>
  );
}
