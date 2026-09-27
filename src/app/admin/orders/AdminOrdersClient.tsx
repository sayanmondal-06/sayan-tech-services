"use client";

import { useState } from "react";

type Order = {
  id: string;
  clientName: string;
  clientEmail: string;
  serviceName: string;
  status: string;
  amount: number;
  requirements: string | null;
  createdAt: string;
};

type Props = {
  orders: Order[];
};

const statuses = [
  "PENDING",
  "ACCEPTED",
  "IN_PROGRESS",
  "REVIEW",
  "COMPLETED",
  "CANCELLED",
];

export default function AdminOrdersClient({ orders }: Props) {
  const [orderList, setOrderList] = useState(orders);
  const [updating, setUpdating] = useState<string | null>(null);

  async function updateStatus(orderId: string, status: string) {
    setUpdating(orderId);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to update order.");
        return;
      }

      setOrderList((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status,
              }
            : order
        )
      );
    } catch (error) {
      console.error("Status update failed:", error);
      alert("Unable to connect to the server.");
    } finally {
      setUpdating(null);
    }
  }

  if (orderList.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
        <p className="text-white/40">
          No orders have been placed yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orderList.map((order) => (
        <div
          key={order.id}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="flex flex-col justify-between gap-6 lg:flex-row">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/30">
                Service
              </p>

              <h2 className="mt-2 text-xl font-medium">
                {order.serviceName}
              </h2>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-white/30">
                Order ID
              </p>

              <p className="mt-2 break-all text-sm text-white/50">
                {order.id}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-white/30">Client</p>

              <p className="mt-2">{order.clientName}</p>

              <p className="mt-1 text-sm text-white/40">
                {order.clientEmail}
              </p>
            </div>

            <div>
              <p className="text-xs text-white/30">Amount</p>

              <p className="mt-2">
                ₹{order.amount.toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <p className="text-xs text-white/30">Created</p>

              <p className="mt-2 text-sm">
                {new Date(order.createdAt).toLocaleDateString(
                  "en-IN"
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-white/30">Status</p>

              <select
                value={order.status}
                disabled={updating === order.id}
                onChange={(event) =>
                  updateStatus(order.id, event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm outline-none focus:border-white/30 disabled:opacity-50"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {order.requirements && (
            <div className="mt-8 rounded-xl border border-white/10 bg-black/30 p-5">
              <p className="text-xs uppercase tracking-wider text-white/30">
                Client Requirements
              </p>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/60">
                {order.requirements}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}