export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await requireAuth();

  const [
    activeOrders,
    completedOrders,
    pendingOrders,
    paidTransactions,
    unreadNotifications,
  ] = await Promise.all([
    prisma.order.count({
      where: {
        userId: user.userId,
        status: {
          in: ["ACCEPTED", "IN_PROGRESS", "REVIEW"],
        },
      },
    }),

    prisma.order.count({
      where: {
        userId: user.userId,
        status: "COMPLETED",
      },
    }),

    prisma.order.count({
      where: {
        userId: user.userId,
        status: "PENDING",
      },
    }),

    prisma.transaction.aggregate({
      where: {
        userId: user.userId,
        status: "PAID",
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.notification.count({
      where: {
        userId: user.userId,
        read: false,
      },
    }),
  ]);

  const totalPaid = paidTransactions._sum.amount
    ? Number(paidTransactions._sum.amount)
    : 0;

  return (
    <main className="min-h-screen bg-[#080808] px-6 py-32 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-white/40">
            Client Dashboard
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight">
            Welcome back
          </h1>

          <p className="mt-3 text-white/40">
            Signed in as {user.email}
          </p>
        </div>

        {/* Stats */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-white/40">
              Active Orders
            </p>

            <p className="mt-3 text-3xl font-semibold">
              {activeOrders}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-white/40">
              Completed
            </p>

            <p className="mt-3 text-3xl font-semibold">
              {completedOrders}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-white/40">
              Pending
            </p>

            <p className="mt-3 text-3xl font-semibold">
              {pendingOrders}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-white/40">
              Total Paid
            </p>

            <p className="mt-3 text-3xl font-semibold">
              ₹{totalPaid.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-white/40">
              Unread Notifications
            </p>

            <p className="mt-3 text-3xl font-semibold">
              {unreadNotifications}
            </p>
          </div>
        </div>

        {/* Dashboard Actions */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">
            Manage your account
          </h2>

          <p className="mt-2 text-white/40">
            Access your orders, transactions, support and notifications.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href="/dashboard/orders"
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:bg-white/[0.07]"
            >
              <p className="text-sm text-white/40">
                Orders
              </p>

              <p className="mt-3 text-lg font-medium">
                View your orders →
              </p>
            </a>

            <a
              href="/dashboard/transactions"
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:bg-white/[0.07]"
            >
              <p className="text-sm text-white/40">
                Transactions
              </p>

              <p className="mt-3 text-lg font-medium">
                View transactions →
              </p>
            </a>

            <a
              href="/dashboard/support"
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:bg-white/[0.07]"
            >
              <p className="text-sm text-white/40">
                Support
              </p>

              <p className="mt-3 text-lg font-medium">
                Get support →
              </p>
            </a>
            <a
  href="/assistant"
  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:bg-white/[0.07]"
>
  <p className="text-sm text-white/40">
    AI Assistant
  </p>

  <p className="mt-3 text-lg font-medium">
    Ask the assistant →
  </p>
</a>

            <a
              href="/dashboard/notifications"
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:bg-white/[0.07]"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-white/40">
                  Notifications
                </p>

                {unreadNotifications > 0 && (
                  <span className="rounded-full border border-white/20 px-2 py-1 text-xs text-white/70">
                    {unreadNotifications} new
                  </span>
                )}
              </div>

              <p className="mt-3 text-lg font-medium">
                View notifications →
              </p>
            </a>
          </div>
        </section>

        {/* Services CTA */}
        <section className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-white/30">
            Need something else?
          </p>

          <h2 className="mt-4 text-3xl font-semibold">
            Start a new project
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-white/40">
            Explore the available services and submit a new request
            whenever you&apos;re ready.
          </p>

          <Link
            href="/services"
            className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/80"
          >
            Explore Services →
          </Link>
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
    </main>
  );
}