export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NotificationsClient from "./NotificationsClient";

export default async function NotificationsPage() {
  const user = await requireAuth();

  const notifications = await prisma.notification.findMany({
    where: {
      userId: user.userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  const serializedNotifications = notifications.map((notification) => ({
    id: notification.id,
    title: notification.title,
    message: notification.message,
    read: notification.read,
    createdAt: notification.createdAt.toISOString(),
  }));

  return (
    <main className="min-h-screen bg-[#080808] px-6 py-32 text-white lg:px-8">
      <div className="mx-auto max-w-5xl">
        <a
          href="/dashboard"
          className="text-sm text-white/40 transition hover:text-white"
        >
          ← Dashboard
        </a>

        <p className="mt-10 text-sm uppercase tracking-[0.25em] text-white/40">
          Client Portal
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-tight">
          Notifications
        </h1>

        <p className="mt-3 text-white/40">
          Updates about your orders, support tickets and account.
        </p>

        <div className="mt-10">
          <NotificationsClient notifications={serializedNotifications} />
        </div>
      </div>
    </main>
  );
}
