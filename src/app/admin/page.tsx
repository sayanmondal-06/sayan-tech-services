export const dynamic = "force-dynamic";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const admin = await requireAdmin();

  const [
    totalUsers,
    totalOrders,
    pendingOrders,
    completedOrders,
    totalTickets,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.order.count(),

    prisma.order.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.order.count({
      where: {
        status: "COMPLETED",
      },
    }),

    prisma.supportTicket.count({
      where: {
        status: {
          in: [
            "OPEN",
            "IN_PROGRESS",
            "WAITING_FOR_CLIENT",
          ],
        },
      },
    }),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
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
  });

  return (
    <main className="min-h-screen bg-[#080808] px-6 py-32 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-white/40">
            Admin Portal
          </p>

          <h1 className="mt-4 text-5xl font-semibold">
            Admin Dashboard
          </h1>

          <p className="mt-3 text-white/40">
            Signed in as {admin.email}
          </p>
        </div>

        {/* Stats */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Users", totalUsers],
            ["Orders", totalOrders],
            ["Pending", pendingOrders],
            ["Completed", completedOrders],
            ["Open Tickets", totalTickets],
          ].map(([title, value]) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <p className="text-sm text-white/40">
                {title}
              </p>

              <p className="mt-3 text-3xl font-semibold">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Admin Actions */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {/* Orders */}
          <a
            href="/admin/orders"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:bg-white/[0.07]"
          >
            <p className="text-sm text-white/40">
              Orders
            </p>

            <p className="mt-3 text-xl font-medium">
              Manage Orders →
            </p>

            <p className="mt-2 text-sm text-white/30">
              Review client orders and update their status.
            </p>
          </a>

          {/* Support */}
          <a
            href="/admin/support"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:bg-white/[0.07]"
          >
            <p className="text-sm text-white/40">
              Support
            </p>

            <p className="mt-3 text-xl font-medium">
              Manage Support →
            </p>

            <p className="mt-2 text-sm text-white/30">
              Reply to clients and manage support tickets.
            </p>
          </a>

          {/* AI Assistant */}
          <a
            href="/assistant"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:bg-white/[0.07]"
          >
            <p className="text-sm text-white/40">
              AI Assistant
            </p>

            <p className="mt-3 text-xl font-medium">
              Test AI Assistant →
            </p>

            <p className="mt-2 text-sm text-white/30">
              Test the customer-facing AI assistant and escalation flow.
            </p>
          </a>
        </div>

        {/* AI Escalation Information */}
        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-white/30">
            AI Support System
          </p>

          <h2 className="mt-4 text-3xl font-semibold">
            Automatic issue escalation
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-white/40">
            The AI assistant can identify potentially serious issues and
            automatically create a support ticket. The client and available
            administrators are then notified so the issue can be handled
            through the support system.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-white/40">
                01
              </p>

              <p className="mt-2 font-medium">
                User reports an issue
              </p>

              <p className="mt-2 text-sm leading-6 text-white/30">
                The client explains the problem through the AI assistant.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-white/40">
                02
              </p>

              <p className="mt-2 font-medium">
                AI detects escalation
              </p>

              <p className="mt-2 text-sm leading-6 text-white/30">
                Potentially serious issues are routed into the support system.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-white/40">
                03
              </p>

              <p className="mt-2 font-medium">
                Admin receives notification
              </p>

              <p className="mt-2 text-sm leading-6 text-white/30">
                Administrators can review and respond from Support.
              </p>
            </div>
          </div>

          <a
            href="/admin/support"
            className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/80"
          >
            Open Support →
          </a>
        </section>

        {/* Recent Orders */}
        <section className="mt-12">
          <div>
            <h2 className="text-2xl font-semibold">
              Recent Orders
            </h2>

            <p className="mt-2 text-sm text-white/40">
              Latest client service requests.
            </p>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-white/40">
                No orders yet.
              </div>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="grid gap-4 border-b border-white/10 p-6 last:border-0 md:grid-cols-4 md:items-center"
                >
                  <div>
                    <p className="font-medium">
                      {order.service.name}
                    </p>

                    <p className="mt-1 text-sm text-white/40">
                      {order.user.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-white/50">
                      {order.user.email}
                    </p>
                  </div>

                  <div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                      {order.status}
                    </span>
                  </div>

                  <div className="text-sm text-white/40 md:text-right">
                    {order.createdAt.toLocaleDateString("en-IN")}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Logout */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="rounded-full border border-white/15 px-5 py-3 text-sm text-white/60 transition hover:border-white/30 hover:text-white"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    
        <div className="mt-6">
          <a
            href="/admin/payments"
            className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Payment Verification
          </a>
        </div>
</main>
  );
}