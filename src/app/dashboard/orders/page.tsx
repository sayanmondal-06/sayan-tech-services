export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function OrdersPage() {
  const user = await requireAuth();

  const orders = await prisma.order.findMany({
    where: {
      userId: user.userId,
    },
    include: {
      service: true,
      transactions: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#080808] px-6 py-32 text-white lg:px-8">
      <div className="mx-auto max-w-6xl">
        <a
          href="/dashboard"
          className="text-sm text-white/40 hover:text-white"
        >
          ← Dashboard
        </a>

        <h1 className="mt-8 text-4xl font-semibold">
          My Orders
        </h1>

        <p className="mt-3 text-white/40">
          Track your service requests and their progress.
        </p>

        {orders.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <p className="text-white/50">
              You haven&apos;t placed any orders yet.
            </p>

            <Link
              href="/services"
              className="mt-6 inline-block rounded-full bg-white px-6 py-3 font-medium text-black"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <h2 className="text-xl font-medium">
                      {order.service.name}
                    </h2>

                    <p className="mt-2 text-sm text-white/40">
                      Order ID: {order.id}
                    </p>
                  </div>

                  <span className="h-fit rounded-full border border-white/10 px-4 py-2 text-xs uppercase text-white/60">
                    {order.status.replaceAll("_", " ")}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-white/30">Amount</p>
                    <p className="mt-1">
                      ₹
                      {order.amount
                        ? Number(order.amount).toLocaleString("en-IN")
                        : "0"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-white/30">Created</p>
                    <p className="mt-1">
                      {order.createdAt.toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-white/30">
                      Payment
                    </p>
                    <p className="mt-1">
                      {order.transactions.length === 0
                        ? "Not paid"
                        : order.transactions
                            .map((transaction) => transaction.status)
                            .join(", ")}
                    </p>
                  </div>
                </div>

                {order.requirements && (
                  <div className="mt-6 rounded-xl bg-black/30 p-4">
                    <p className="text-xs text-white/30">
                      Requirements
                    </p>

                    <p className="mt-2 text-sm leading-6 text-white/60">
                      {order.requirements}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}