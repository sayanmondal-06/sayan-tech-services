export const dynamic = "force-dynamic";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminOrdersClient from "./AdminOrdersClient";

export default async function AdminOrdersPage() {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      service: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const serializedOrders = orders.map((order) => ({
    id: order.id,
    clientName: order.user.name,
    clientEmail: order.user.email,
    serviceName: order.service.name,
    status: order.status,
    amount: order.amount ? Number(order.amount) : 0,
    requirements: order.requirements,
    createdAt: order.createdAt.toISOString(),
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

          <h1 className="mt-4 text-5xl font-semibold">
            Manage Orders
          </h1>

          <p className="mt-3 text-white/40">
            Review client requests and update their progress.
          </p>
        </div>

        <div className="mt-12">
          <AdminOrdersClient orders={serializedOrders} />
        </div>
      </div>
    </main>
  );
}