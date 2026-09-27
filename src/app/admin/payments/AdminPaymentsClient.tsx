"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Payment = {
  id: string;
  amount: number;
  status: string;
  paymentMethod: string | null;
  receiptUrl: string | null;
  receiptFileName: string | null;
  receiptUploadedAt: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
  order: {
    id: string;
    status: string;
    service: {
      id: string;
      name: string;
    };
  };
};

export default function AdminPaymentsPage() {
  const router = useRouter();

  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [processing, setProcessing] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const [rejecting, setRejecting] =
    useState<string | null>(null);

  const [rejectionReason, setRejectionReason] =
    useState("");

  async function loadPayments() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/payments",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (response.status === 403) {
        setError(
          "You do not have admin access."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to load payments."
        );
      }

      setPayments(data.transactions || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load payments."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPayments();
  }, []);

  async function verifyPayment(
    transactionId: string
  ) {
    setProcessing(transactionId);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/payments/${transactionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            action: "VERIFY",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to verify payment."
        );
      }

      setMessage(
        "Payment verified successfully."
      );

      setPayments((current: Payment[]) =>
        current.filter(
          (payment) =>
            payment.id !== transactionId
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to verify payment."
      );
    } finally {
      setProcessing(null);
    }
  }

  async function rejectPayment(
    transactionId: string
  ) {
    if (!rejectionReason.trim()) {
      setError(
        "Please enter a rejection reason."
      );
      return;
    }

    setProcessing(transactionId);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/payments/${transactionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            action: "REJECT",
            rejectionReason:
              rejectionReason.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to reject payment."
        );
      }

      setMessage(
        "Payment receipt rejected."
      );

      setPayments((current: Payment[]) =>
        current.filter(
          (payment) =>
            payment.id !== transactionId
        )
      );

      setRejecting(null);
      setRejectionReason("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reject payment."
      );
    } finally {
      setProcessing(null);
    }
  }

  function formatDate(
    value: string | null
  ) {
    if (!value) {
      return "Unknown";
    }

    return new Date(value).toLocaleString();
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <p>Loading payment verifications...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() =>
                router.push("/admin")
              }
              className="mb-3 text-sm text-blue-600 hover:underline"
            >
              ← Back to Admin Dashboard
            </button>

            <h1 className="text-3xl font-bold">
              Payment Verification
            </h1>

            <p className="mt-2 text-gray-600">
              Review UPI payment receipts submitted by customers.
            </p>
          </div>

          <button
            onClick={loadPayments}
            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Refresh
          </button>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-green-300 bg-green-50 p-4 text-green-800">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 rounded-xl border bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Pending verification
              </p>

              <p className="mt-1 text-3xl font-bold">
                {payments.length}
              </p>
            </div>

            <div className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800">
              VERIFICATION_PENDING
            </div>
          </div>
        </div>

        {payments.length === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center">
            <h2 className="text-xl font-semibold">
              No pending payments
            </h2>

            <p className="mt-2 text-gray-500">
              New customer payment receipts will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {payments.map((payment: Payment) => (
              <div
                key={payment.id}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <div className="grid gap-6 lg:grid-cols-3">

                  <div className="lg:col-span-2">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          Service
                        </p>

                        <h2 className="text-xl font-bold">
                          {payment.order.service.name}
                        </h2>
                      </div>

                      <div className="rounded-lg bg-gray-100 px-4 py-2 font-bold">
                        ₹{payment.amount}
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase text-gray-500">
                          Customer
                        </p>

                        <p className="mt-1 font-semibold">
                          {payment.user.name}
                        </p>

                        <p className="text-sm text-gray-600">
                          {payment.user.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase text-gray-500">
                          Order ID
                        </p>

                        <p className="mt-1 break-all text-sm">
                          {payment.order.id}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase text-gray-500">
                          Payment method
                        </p>

                        <p className="mt-1 font-medium">
                          {payment.paymentMethod ||
                            "UPI"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase text-gray-500">
                          Receipt uploaded
                        </p>

                        <p className="mt-1 text-sm">
                          {formatDate(
                            payment.receiptUploadedAt
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      {payment.receiptUrl && (
                        <a
                          href={payment.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          View Receipt
                        </a>
                      )}

                      {payment.receiptUrl && (
                        <a
                          href={payment.receiptUrl}
                          download
                          className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                        >
                          Download Receipt
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-5">
                    <h3 className="font-semibold">
                      Verification
                    </h3>

                    <button
                      disabled={
                        processing === payment.id
                      }
                      onClick={() =>
                        verifyPayment(
                          payment.id
                        )
                      }
                      className="mt-4 w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {processing === payment.id
                        ? "Processing..."
                        : "✓ Confirm Payment"}
                    </button>

                    {rejecting === payment.id ? (
                      <div className="mt-4">
                        <textarea
                          value={rejectionReason}
                          onChange={(event) =>
                            setRejectionReason(
                              event.target.value
                            )
                          }
                          placeholder="Enter reason for rejecting this receipt..."
                          rows={4}
                          className="w-full rounded-lg border p-3 text-sm"
                        />

                        <div className="mt-2 flex gap-2">
                          <button
                            disabled={
                              processing ===
                              payment.id
                            }
                            onClick={() =>
                              rejectPayment(
                                payment.id
                              )
                            }
                            className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            Reject
                          </button>

                          <button
                            disabled={
                              processing ===
                              payment.id
                            }
                            onClick={() => {
                              setRejecting(null);
                              setRejectionReason(
                                ""
                              );
                            }}
                            className="flex-1 rounded-lg border px-3 py-2 text-sm font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        disabled={
                          processing === payment.id
                        }
                        onClick={() => {
                          setRejecting(
                            payment.id
                          );
                          setRejectionReason("");
                        }}
                        className="mt-3 w-full rounded-lg border border-red-300 px-4 py-3 font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        ✕ Reject Payment
                      </button>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}