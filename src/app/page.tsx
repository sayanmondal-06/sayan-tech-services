import Link from "next/link";
const services = [
  {
    number: "01",
    title: "Web Development",
    description:
      "Modern, responsive websites and web applications built around your requirements.",
    tags: ["Business Websites", "Web Apps", "Landing Pages"],
  },
  {
    number: "02",
    title: "Website Security",
    description:
      "Authorized security checks to identify common weaknesses and improve website security.",
    tags: ["Security Check", "Vulnerability Testing", "Security Report"],
  },
  {
    number: "03",
    title: "Website & App Testing",
    description:
      "Functional, usability and compatibility testing for websites, Android apps and prototypes.",
    tags: ["Alpha Testing", "Beta Testing", "Bug Testing"],
  },
  {
    number: "04",
    title: "Android & Device Testing",
    description:
      "Testing Android applications, smartphones and new device features in real-world scenarios.",
    tags: ["Android", "Device Testing", "Beta Testing"],
  },
  {
    number: "05",
    title: "AI / AIoT Testing",
    description:
      "Testing AI-powered products, features and connected devices with practical user feedback.",
    tags: ["AI Testing", "AIoT", "Product Feedback"],
  },
  {
    number: "06",
    title: "Photography",
    description:
      "Mobile photography services for products, events, technology and creative projects.",
    tags: ["Mobile Photography", "Products", "Events"],
  },
  {
    number: "07",
    title: "Application Assistance",
    description:
      "Assistance with online forms, job applications and digital application processes.",
    tags: ["Online Forms", "Job Applications", "Assistance"],
  },
  {
    number: "08",
    title: "Tech Collaboration",
    description:
      "Collaborate on technology products, testing, prototypes and innovative ideas.",
    tags: ["Collaboration", "Testing", "Technology"],
  },
];

const projects = [
  {
    title: "SkillSetu",
    category: "AI • Academia • Industry",
    description:
      "An AI-powered platform concept for skill mapping, internships and industry-academia collaboration.",
  },
  {
    title: "Web Security Scanner",
    category: "Cybersecurity",
    description:
      "A security-focused project designed to inspect websites and generate useful security findings.",
  },
  {
    title: "Android & Device Testing",
    category: "Testing • Mobile",
    description:
      "Hands-on testing and feedback across Android applications, smartphones and emerging features.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#080808]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#" className="text-xl font-bold tracking-tight">
            SAYAN<span className="text-white/40">.</span>
          </a>

          <div className="hidden items-center gap-8 text-sm text-white/65 md:flex">
            <a href="#work" className="transition hover:text-white">Work</a>
            <a href="#services" className="transition hover:text-white">Services</a>
            <a href="#about" className="transition hover:text-white">About</a>
            <a href="#contact" className="transition hover:text-white">Contact</a>
          </div>

          <a
            href="/login"
            className="rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white hover:text-black"
          >
            Client Portal
          </a>
        </div>
      </nav>

      <section className="relative overflow-hidden px-6 pb-24 pt-40 lg:px-8 lg:pb-32 lg:pt-52">
        <div className="absolute left-1/2 top-20 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-white/10 blur-[120px]" />

        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-6 text-sm font-medium uppercase tracking-[0.3em] text-white/45">
              Technology • Testing • Security • Development
            </p>

            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-8xl">
              Build.
              <br />
              Test.
              <br />
              <span className="text-white/35">Secure.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/55">
              Technology solutions for individuals, creators, startups and
              businesses — from building digital products to testing and
              securing them.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/services"
                className="rounded-full bg-white px-6 py-3 font-medium text-black transition hover:bg-white/85"
              >
                Explore Services →
              </Link>

              <a
                href="/assistant"
                className="rounded-full border border-white/20 px-6 py-3 font-medium transition hover:bg-white/10"
              >
                Ask AI Assistant
              </a>
            </div>
          </div>

          <div className="mt-24 grid max-w-3xl grid-cols-2 gap-8 border-t border-white/10 pt-8 sm:grid-cols-4">
            <div>
              <p className="text-3xl font-semibold">08+</p>
              <p className="mt-1 text-sm text-white/40">Service Areas</p>
            </div>
            <div>
              <p className="text-3xl font-semibold">10+</p>
              <p className="mt-1 text-sm text-white/40">Projects & Ideas</p>
            </div>
            <div>
              <p className="text-3xl font-semibold">24/7</p>
              <p className="mt-1 text-sm text-white/40">AI Assistance</p>
            </div>
            <div>
              <p className="text-3xl font-semibold">01</p>
              <p className="mt-1 text-sm text-white/40">Client Portal</p>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="border-t border-white/10 px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-white/40">
                What I Do
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Services built around technology.
              </h2>
            </div>

            <p className="max-w-xl self-end leading-7 text-white/50">
              From a new website to testing an Android application or checking
              a website for common security issues, choose a service or
              contact me for a custom requirement.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.number}
                className="group bg-[#0d0d0d] p-8 transition hover:bg-[#141414] lg:p-10"
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm text-white/30">{service.number}</span>
                  <span className="text-xl text-white/30 transition group-hover:translate-x-1 group-hover:text-white">
                    ↗
                  </span>
                </div>

                <h3 className="mt-12 text-2xl font-medium">{service.title}</h3>

                <p className="mt-4 max-w-md leading-7 text-white/45">
                  {service.description}
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/services" className="text-sm text-white/50 transition hover:text-white">
              View service details and starting prices →
            </Link>
          </div>
        </div>
      </section>

      <section id="work" className="border-t border-white/10 px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-[0.25em] text-white/40">
            Selected Work
          </p>

          <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Things I&apos;ve worked on.
            </h2>

            <p className="max-w-md text-white/45">
              Projects, experiments and technology work that represent my
              interests and capabilities.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {projects.map((project, index) => (
              <article
                key={project.title}
                className="group min-h-[360px] rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition hover:-translate-y-1 hover:bg-white/[0.06]"
              >
                <div className="flex justify-between">
                  <span className="text-sm text-white/30">0{index + 1}</span>
                  <span className="text-white/30">↗</span>
                </div>

                <div className="mt-36">
                  <p className="text-xs uppercase tracking-widest text-white/35">
                    {project.category}
                  </p>
                  <h3 className="mt-3 text-2xl font-medium">{project.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/45">
                    {project.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a href="/work" className="text-sm text-white/50 transition hover:text-white">
              View more work →
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="border-t border-white/10 px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-white/40">About</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Technology from a practical perspective.
            </h2>
          </div>

          <div className="space-y-5 text-lg leading-8 text-white/50">
            <p>
              I&apos;m Sayan Mondal, a computer science student interested in
              software development, cybersecurity, mobile technology,
              artificial intelligence and testing.
            </p>
            <p>
              This platform brings my technical work and services together in
              one place, while giving clients a simple way to request work,
              track projects and communicate with me.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center sm:p-16">
          <p className="text-sm uppercase tracking-[0.25em] text-white/40">Have a project?</p>
          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Let&apos;s build something useful.
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-7 text-white/45">
            Tell me what you need. You can request a service, ask a question,
            or start a conversation about a technology project.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="rounded-full bg-white px-7 py-3 font-medium text-black transition hover:bg-white/85"
            >
              Contact Me
            </a>
            <Link
              href="/services"
              className="rounded-full border border-white/20 px-7 py-3 font-medium transition hover:bg-white/10"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-white/35 sm:flex-row">
          <p>© 2026 Sayan Mondal. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/about" className="transition hover:text-white">About</a>
            <a href="/contact" className="transition hover:text-white">Contact</a>
          </div>
        </div>
      </footer>

      <a
        href="/assistant"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-medium text-black shadow-2xl transition hover:scale-105"
      >
        <span className="text-base">✦</span>
        AI Assistant
      </a>
    </main>
  );
}
