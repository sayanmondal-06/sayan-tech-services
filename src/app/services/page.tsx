export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: {
      active: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-[#080808] px-6 py-32 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-[0.25em] text-white/40">
          Services
        </p>

        <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight sm:text-7xl">
          What can I help you build or test?
        </h1>

        <div className="mt-16 grid gap-4 md:grid-cols-2">
          {services.map((service, index) => (
            <a
              key={service.id}
              href={`/services/${service.slug}`}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition hover:bg-white/[0.07]"
            >
              <span className="text-sm text-white/30">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h2 className="mt-10 text-2xl font-medium">
                {service.name}
              </h2>

              <p className="mt-4 leading-7 text-white/45">
                {service.description}
              </p>

              {service.startingPrice !== null && (
                <p className="mt-6 text-sm text-white/50">
                  Starting from ₹
                  {Number(service.startingPrice).toLocaleString("en-IN")}
                </p>
              )}

              <p className="mt-8 text-sm text-white/50 group-hover:text-white">
                View service →
              </p>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}