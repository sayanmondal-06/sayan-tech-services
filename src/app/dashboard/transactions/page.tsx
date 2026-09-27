export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function TransactionsPage() {
  const user = await requireAuth();

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: user.userId,
    },
    include: {
      order: {
        include: {
          service: true,
        },
      },
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
          Transactions
        </h1>

        <p className="mt-3 text-white/40">
          Your payment and transaction history.
        </p>

        {transactions.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <p className="text-white/50">
              No transactions yet.
            </p>
          </div>
        ) : (
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <div className="hidden grid-cols-4 gap-4 border-b border-white/10 bg-white/[0.03] px-6 py-4 text-xs uppercase tracking-wider text-white/30 sm:grid">
              <span>Service</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Date</span>
            </div>

            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="grid gap-4 border-b border-white/10 px-6 py-5 last:border-0 sm:grid-cols-4 sm:items-center"
              >
                <div>
                  <p className="text-xs text-white/30 sm:hidden">
                    Service
                  </p>

                  <p>{transaction.order.service.name}</p>
                </div>

                <div>
                  <p className="text-xs text-white/30 sm:hidden">
                    Amount
                  </p>

                  <p>
                    ₹
                    {Number(transaction.amount).toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-white/30 sm:hidden">
                    Status
                  </p>

                  <span className="text-sm text-white/60">
                    {transaction.status}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-white/30 sm:hidden">
                    Date
                  </p>

                  <p className="text-sm text-white/50">
                    {transaction.createdAt.toLocaleDateString(
                      "en-IN"
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}