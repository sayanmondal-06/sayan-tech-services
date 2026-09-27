export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import OrderForm from "./OrderForm";

type OrderPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function OrderPage({
  params,
}: OrderPageProps) {
  const user = await requireAuth();

  const { slug } = await params;

  const service = await prisma.service.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      name: true,
      description: true,
      startingPrice: true,
      active: true,
    },
  });

  if (!service || !service.active) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#080808] px-6 py-32 text-white lg:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm uppercase tracking-[0.25em] text-white/40">
          Place an order
        </p>

        <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
          {service.name}
        </h1>

        <p className="mt-5 leading-7 text-white/50">
          {service.description}
        </p>

        {service.startingPrice !== null && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-white/40">Starting price</p>

            <p className="mt-2 text-3xl font-semibold">
              ₹{Number(service.startingPrice).toLocaleString("en-IN")}
            </p>
          </div>
        )}

        <OrderForm
          serviceId={service.id}
          serviceName={service.name}
          userEmail={user.email}
        />
      </div>
    </main>
  );
}