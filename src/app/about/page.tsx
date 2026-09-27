export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          About Sayan Tech Services
        </h1>

        <p className="mx-auto mt-5 max-w-3xl text-lg text-gray-600">
          Sayan Tech Services provides practical technology services covering
          web development, cybersecurity testing, application testing,
          Android testing, AI/AIoT testing and technical assistance.
        </p>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold">Development</h2>
          <p className="mt-3 text-gray-600">
            Website development and technical project work focused on
            practical, usable solutions.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold">Testing & Security</h2>
          <p className="mt-3 text-gray-600">
            Website, application, Android and cybersecurity testing services
            for identifying issues and improving reliability.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold">Technology Support</h2>
          <p className="mt-3 text-gray-600">
            Technical assistance, AI/AIoT testing, photography and
            technology collaboration services.
          </p>
        </div>
      </section>
    </main>
  );
}