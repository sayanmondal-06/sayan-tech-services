const projects = [
  {
    title: "SkillSetu",
    category: "AI / EdTech",
    description:
      "An academia-industry collaboration platform concept focused on skill mapping, internships and placement.",
  },
  {
    title: "Web Security Scanner",
    category: "Cybersecurity",
    description:
      "A security testing project designed to inspect websites and produce structured findings.",
  },
  {
    title: "Android & Device Testing",
    category: "Mobile Technology",
    description:
      "Hands-on testing and feedback involving Android applications, smartphones and emerging device features.",
  },
];

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-[#080808] px-6 py-32 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-[0.25em] text-white/40">
          Portfolio
        </p>

        <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-7xl">
          Selected Work
        </h1>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <article
              key={project.title}
              className="min-h-[380px] rounded-2xl border border-white/10 bg-white/[0.03] p-8"
            >
              <span className="text-sm text-white/30">
                0{index + 1}
              </span>

              <div className="mt-48">
                <p className="text-xs uppercase tracking-widest text-white/35">
                  {project.category}
                </p>

                <h2 className="mt-3 text-2xl font-medium">
                  {project.title}
                </h2>

                <p className="mt-3 leading-6 text-white/45">
                  {project.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}