"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type OrderFormProps = {
  serviceId: string;
  serviceName: string;
  userEmail: string;
};

export default function OrderForm({
  serviceId,
  serviceName,
  userEmail,
}: OrderFormProps) {
  const router = useRouter();

  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId,
          requirements,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to create order.");
        return;
      }

      setSuccess("Order created successfully.");

      setRequirements("");

      setTimeout(() => {
        router.push("/dashboard/orders");
        router.refresh();
      }, 800);
    } catch (error) {
      console.error("Order request failed:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8"
    >
      <div>
        <p className="text-sm text-white/40">Service</p>
        <p className="mt-2 font-medium">{serviceName}</p>
      </div>

      <div className="mt-6">
        <p className="text-sm text-white/40">Account</p>
        <p className="mt-2 text-white/70">{userEmail}</p>
      </div>

      <div className="mt-8">
        <label
          htmlFor="requirements"
          className="text-sm text-white/60"
        >
          Tell me what you need
        </label>

        <textarea
          id="requirements"
          value={requirements}
          onChange={(event) => setRequirements(event.target.value)}
          rows={7}
          placeholder="Describe your requirements, project details, preferred timeline, links, or anything else that will help..."
          className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none placeholder:text-white/25 focus:border-white/30"
        />
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-full bg-white px-6 py-4 font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Creating order..." : "Submit order"}
      </button>
    </form>
  );
}