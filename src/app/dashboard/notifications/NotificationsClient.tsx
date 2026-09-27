"use client";

import { useState } from "react";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

type Props = {
  notifications: NotificationItem[];
};

export default function NotificationsClient({ notifications: initial }: Props) {
  const [notifications, setNotifications] = useState(initial);
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  async function markRead(id: string) {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId: id,
        }),
      });

      if (!response.ok) {
        return;
      }

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Mark notification read error:", error);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-white/40">
          {unreadCount === 0
            ? "You're all caught up."
            : `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}.`}
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <p className="text-white/40">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`rounded-2xl border p-6 transition ${
                notification.read
                  ? "border-white/10 bg-white/[0.02]"
                  : "border-white/20 bg-white/[0.06]"
              }`}
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-medium">{notification.title}</h2>
                    {!notification.read && (
                      <span className="rounded-full border border-white/20 px-2 py-1 text-[10px] uppercase tracking-wider text-white/60">
                        New
                      </span>
                    )}
                  </div>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/50">
                    {notification.message}
                  </p>

                  <p className="mt-4 text-xs text-white/25">
                    {new Date(notification.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>

                {!notification.read && (
                  <button
                    type="button"
                    onClick={() => markRead(notification.id)}
                    className="h-fit rounded-full border border-white/15 px-4 py-2 text-xs text-white/60 transition hover:border-white/30 hover:text-white"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
