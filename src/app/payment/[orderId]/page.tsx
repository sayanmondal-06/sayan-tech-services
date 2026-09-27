"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type OrderData = {
  id: string;
  status: string;
  amount: number | null;
  requirements: string | null;
  service: {
    name: string;
    description: string;
  };
  transaction: {
    id: string;
    amount: number;
    status: string;
    receiptFileName: string | null;
    rejectionReason: string | null;
  } | null;
};

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const upiId = "sayan.mondal.sm06@oksbi";

  useEffect(() => {
    async function loadOrder() {
      try {
        const response = await fetch(`/api/payments/${orderId}`);

        if (!response.ok) {
          throw new Error("Unable to load payment information.");
        }

        const data = await response.json();
        setOrder(data.order);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Could not copy the UPI ID.");
    }
  }

  async function uploadReceipt(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const fileInput = form.elements.namedItem("receipt") as HTMLInputElement;

    if (!fileInput.files || fileInput.files.length === 0) {
      setError("Please select your payment receipt.");
      return;
    }

    const file = fileInput.files[0];

    if (file.size > 5 * 1024 * 1024) {
      setError("Receipt must be smaller than 5 MB.");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, WEBP or PDF receipts are allowed.");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("receipt", file);

      const response = await fetch(
        `/api/payments/${orderId}/receipt`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Receipt upload failed.");
      }

      setMessage(
        "Payment receipt uploaded successfully. Your payment is now waiting for admin verification."
      );

      setOrder(data.order);
      form.reset();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload receipt."
      );
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <p>Loading payment information...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div>
          <h1 className="text-2xl font-bold">Payment not available</h1>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </main>
    );
  }

  const amount = order.transaction?.amount ?? order.amount ?? 0;
  const transactionStatus = order.transaction?.status ?? "PENDING";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">

        <button
          onClick={() => router.push("/dashboard")}
          className="mb-6 text-sm text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <div className="rounded-2xl bg-white p-6 shadow-sm border">
          <h1 className="text-2xl font-bold">
            Complete Payment
          </h1>

          <div className="mt-6 rounded-xl border bg-gray-50 p-5">
            <p className="text-sm text-gray-500">Service</p>
            <h2 className="mt-1 text-xl font-semibold">
              {order.service.name}
            </h2>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-gray-600">Amount</span>
              <span className="text-2xl font-bold">
                ₹{amount}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-gray-600">Payment status</span>
              <span className="font-semibold">
                {transactionStatus}
              </span>
            </div>
          </div>

          {transactionStatus === "PAID" && (
            <div className="mt-6 rounded-xl border border-green-300 bg-green-50 p-4 text-green-800">
              <p className="font-semibold">
                Payment verified successfully.
              </p>
              <p className="mt-1 text-sm">
                You do not need to upload another receipt.
              </p>
            </div>
          )}

          {transactionStatus === "VERIFICATION_PENDING" && (
            <div className="mt-6 rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-yellow-800">
              <p className="font-semibold">
                Payment verification pending
              </p>
              <p className="mt-1 text-sm">
                Your receipt has been submitted and is waiting for admin verification.
              </p>
            </div>
          )}

          {transactionStatus === "FAILED" &&
            order.transaction?.rejectionReason && (
              <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-4 text-red-800">
                <p className="font-semibold">
                  Payment receipt was rejected
                </p>
                <p className="mt-1 text-sm">
                  Reason: {order.transaction.rejectionReason}
                </p>
              </div>
            )}

          {message && (
            <div className="mt-6 rounded-xl border border-green-300 bg-green-50 p-4 text-green-800">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {transactionStatus !== "PAID" &&
            transactionStatus !== "VERIFICATION_PENDING" && (
              <>
                <div className="mt-8">
                  <h2 className="text-lg font-semibold">
                    1. Pay using UPI
                  </h2>

                  <p className="mt-2 text-sm text-gray-600">
                    Open any UPI application such as Google Pay,
                    PhonePe, Paytm or your bank's UPI app.
                  </p>

                  <div className="mt-4 rounded-xl border-2 border-dashed p-5">
                    <p className="text-sm text-gray-500">
                      UPI ID
                    </p>

                    <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="break-all text-lg font-bold">
                        {upiId}
                      </p>

                      <button
                        type="button"
                        onClick={copyUpi}
                        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
                      >
                        {copied ? "Copied!" : "Copy UPI ID"}
                      </button>
                    </div>

                    <p className="mt-3 text-sm text-gray-500">
                      Pay exactly ₹{amount}.
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-lg font-semibold">
                    2. Upload payment receipt
                  </h2>

                  <p className="mt-2 text-sm text-gray-600">
                    After completing the UPI payment, upload the
                    payment screenshot or receipt below.
                  </p>

                  <form
                    onSubmit={uploadReceipt}
                    className="mt-4 space-y-4"
                  >
                    <input
                      name="receipt"
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      className="block w-full rounded-lg border p-3 text-sm"
                    />

                    <p className="text-xs text-gray-500">
                      JPG, PNG, WEBP or PDF. Maximum 5 MB.
                    </p>

                    <button
                      type="submit"
                      disabled={uploading}
                      className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {uploading
                        ? "Uploading..."
                        : "Submit Payment Receipt"}
                    </button>
                  </form>
                </div>
              </>
            )}
        </div>
      </div>
    </main>
  );
}