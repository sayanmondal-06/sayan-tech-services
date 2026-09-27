export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#080808] px-6 py-32 text-white lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm uppercase tracking-[0.25em] text-white/40">
          Contact
        </p>

        <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-7xl">
          Tell me what you need.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-white/50">
          You can contact me about a service, project, collaboration or
          technical requirement.
        </p>

        <form className="mt-12 space-y-5">
          <input
            type="text"
            placeholder="Your name"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none placeholder:text-white/30 focus:border-white/30"
          />

          <input
            type="email"
            placeholder="Your email"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none placeholder:text-white/30 focus:border-white/30"
          />

          <textarea
            placeholder="Tell me about your requirement..."
            rows={6}
            className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none placeholder:text-white/30 focus:border-white/30"
          />

          <button
            type="button"
            className="rounded-full bg-white px-7 py-3 font-medium text-black"
          >
            Send Request
          </button>
        </form>
      </div>
    </main>
  );
}