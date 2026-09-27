export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

type ServicePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ServicePage({
  params,
}: ServicePageProps) {
  const { slug } = await params;

  const service = await prisma.service.findUnique({
    where: {
      slug,
    },
  });

  if (!service || !service.active) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#080808] px-6 py-32 text-white lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/services"
          className="text-sm text-white/40 transition hover:text-white"
        >
          ← Back to services
        </Link>

        <div className="mt-12">
          <p className="text-sm uppercase tracking-[0.25em] text-white/40">
            {service.category}
          </p>

          <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-7xl">
            {service.name}
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-8 text-white/50">
            {service.description}
          </p>
        </div>

        <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-white/30">
            About this service
          </p>

          <p className="mt-5 leading-8 text-white/60">
            {service.details || service.description}
          </p>

          {service.startingPrice !== null && (
            <div className="mt-8">
              <p className="text-sm text-white/40">Starting price</p>

              <p className="mt-2 text-3xl font-semibold">
                ₹{Number(service.startingPrice).toLocaleString("en-IN")}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={`/services/${service.slug}/order`}
            className="rounded-full bg-white px-6 py-3 font-medium text-black transition hover:bg-white/90"
          >
            Place an order
          </Link>

          <Link
            href="/contact"
            className="rounded-full border border-white/20 px-6 py-3 transition hover:bg-white/[0.07]"
          >
            Ask a question
          </Link>
        </div>
      </div>
    </main>
  );
}