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
    number: "01",
    title: "SkillSetu",
    category: "AI • Academia • Industry",
    description:
      "An AI-powered platform concept for skill mapping, internships and industry-academia collaboration.",
    accent: "from-violet-500/20 via-transparent to-transparent",
  },
  {
    number: "02",
    title: "Web Security Scanner",
    category: "CYBERSECURITY",
    description:
      "A security-focused project designed to inspect websites and generate useful security findings.",
    accent: "from-cyan-500/20 via-transparent to-transparent",
  },
  {
    number: "03",
    title: "Android & Device Testing",
    category: "TESTING • MOBILE",
    description:
      "Hands-on testing and feedback across Android applications, smartphones and emerging features.",
    accent: "from-blue-500/20 via-transparent to-transparent",
  },
];

const process = [
  {
    number: "01",
    title: "Tell me what you need",
    text: "Share your requirement, idea, bug, testing need or project goal.",
  },
  {
    number: "02",
    title: "Plan the work",
    text: "We define the scope, deliverables, timeline and the right approach.",
  },
  {
    number: "03",
    title: "Build & test",
    text: "The work moves through development, testing and practical feedback.",
  },
  {
    number: "04",
    title: "Deliver",
    text: "You receive the result, updates and a clear handover of the work.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070708] text-white">
      {/* Background atmosphere */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="ambient-orb ambient-orb-one" />
        <div className="ambient-orb ambient-orb-two" />
        <div className="ambient-grid" />
      </div>

      {/* Navigation */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.08] bg-[#070708]/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a
            href="#top"
            className="group text-xl font-bold tracking-[-0.04em]"
          >
            SAYAN<span className="text-white/35 transition group-hover:text-white">.</span>
          </a>

          <div className="hidden items-center gap-9 text-sm text-white/55 md:flex">
            <a className="nav-link" href="#work">Work</a>
            <a className="nav-link" href="#services">Services</a>
            <a className="nav-link" href="#about">About</a>
            <a className="nav-link" href="#contact">Contact</a>
          </div>

          <Link
            href="/login"
            className="group rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm transition-all duration-300 hover:border-white/35 hover:bg-white hover:text-black"
          >
            Client Portal
            <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section id="top" className="relative px-5 pb-20 pt-36 sm:pt-40 lg:px-8 lg:pb-28 lg:pt-48">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="reveal">
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/45">
              <span className="status-dot" />
              Technology • Testing • Security
            </div>

            <h1 className="max-w-4xl text-[3.7rem] font-semibold leading-[0.92] tracking-[-0.065em] sm:text-7xl lg:text-[7.2rem]">
              Build.
              <br />
              Test.
              <br />
              <span className="hero-muted">Secure.</span>
            </h1>

            <p className="mt-9 max-w-2xl text-base leading-7 text-white/50 sm:text-lg sm:leading-8">
              Technology solutions for individuals, creators, startups and
              businesses — from building digital products to testing and
              securing them.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="primary-button group rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black"
              >
                Explore Services
                <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="/assistant"
                className="secondary-button rounded-full border border-white/15 bg-white/[0.025] px-6 py-3.5 text-sm font-medium"
              >
                Ask AI Assistant
              </Link>
            </div>

            <div className="mt-14 grid max-w-2xl grid-cols-2 gap-y-8 border-t border-white/10 pt-7 sm:grid-cols-4 sm:gap-5">
              <div className="stat-item">
                <p className="text-2xl font-semibold tracking-tight">08+</p>
                <p className="mt-1 text-xs text-white/35">Service Areas</p>
              </div>
              <div className="stat-item">
                <p className="text-2xl font-semibold tracking-tight">10+</p>
                <p className="mt-1 text-xs text-white/35">Projects & Ideas</p>
              </div>
              <div className="stat-item">
                <p className="text-2xl font-semibold tracking-tight">24/7</p>
                <p className="mt-1 text-xs text-white/35">AI Assistance</p>
              </div>
              <div className="stat-item">
                <p className="text-2xl font-semibold tracking-tight">01</p>
                <p className="mt-1 text-xs text-white/35">Client Portal</p>
              </div>
            </div>
          </div>

          {/* Animated technology visual */}
          <div className="hero-visual reveal reveal-delay-2">
            <div className="tech-card">
              <div className="tech-card-glow" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">
                    Sayan Tech Services
                  </p>
                  <p className="mt-2 text-sm font-medium text-white/80">
                    Digital workspace
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-[10px] text-emerald-300/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  ONLINE
                </div>
              </div>

              <div className="tech-core">
                <div className="orbit orbit-one" />
                <div className="orbit orbit-two" />
                <div className="orbit orbit-three" />

                <div className="core-circle">
                  <span className="text-2xl font-semibold tracking-[-0.06em]">S</span>
                  <span className="mt-1 text-[8px] uppercase tracking-[0.3em] text-white/35">
                    TECH
                  </span>
                </div>

                <span className="orbit-dot dot-one" />
                <span className="orbit-dot dot-two" />
                <span className="orbit-dot dot-three" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="mini-panel">
                  <span className="mini-icon">01</span>
                  <div>
                    <p className="text-xs text-white/70">Build</p>
                    <p className="text-[10px] text-white/30">Web & Apps</p>
                  </div>
                </div>
                <div className="mini-panel">
                  <span className="mini-icon">02</span>
                  <div>
                    <p className="text-xs text-white/70">Test</p>
                    <p className="text-[10px] text-white/30">Quality & Devices</p>
                  </div>
                </div>
                <div className="mini-panel">
                  <span className="mini-icon">03</span>
                  <div>
                    <p className="text-xs text-white/70">Secure</p>
                    <p className="text-[10px] text-white/30">Web Security</p>
                  </div>
                </div>
                <div className="mini-panel">
                  <span className="mini-icon">04</span>
                  <div>
                    <p className="text-xs text-white/70">Assist</p>
                    <p className="text-[10px] text-white/30">AI Support</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-chip floating-chip-one">
              <span>◈</span>
              AI / AIoT
            </div>

            <div className="floating-chip floating-chip-two">
              <span>⌁</span>
              Security
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-t border-white/[0.08] px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 grid gap-8 md:grid-cols-[1fr_0.7fr] md:items-end">
            <div className="reveal">
              <p className="section-label">What I Do</p>
              <h2 className="section-title">
                Technology services
                <br />
                built to be useful.
              </h2>
            </div>

            <p className="reveal reveal-delay-1 max-w-xl text-sm leading-7 text-white/45">
              From a new website to testing an Android application or checking
              a website for common security issues, choose a service or
              contact me for a custom requirement.
            </p>
          </div>

          <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] md:grid-cols-2">
            {services.map((service, index) => (
              <article
                key={service.number}
                className={`service-card reveal reveal-delay-${Math.min(index % 4, 3)}`}
              >
                <div className="service-line" />

                <div className="flex items-start justify-between">
                  <span className="text-xs font-medium tracking-[0.2em] text-white/25">
                    {service.number}
                  </span>
                  <span className="service-arrow">↗</span>
                </div>

                <h3 className="mt-12 text-2xl font-medium tracking-tight">
                  {service.title}
                </h3>

                <p className="mt-4 max-w-md text-sm leading-7 text-white/42">
                  {service.description}
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1 text-[10px] uppercase tracking-wider text-white/35"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/services"
              className="inline-flex items-center text-sm text-white/45 transition hover:text-white"
            >
              View service details and starting prices
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="border-t border-white/[0.08] px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="reveal">
            <p className="section-label">Selected Work</p>

            <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <h2 className="section-title">
                Ideas turned
                <br />
                into working projects.
              </h2>

              <p className="max-w-md text-sm leading-7 text-white/40">
                Projects, experiments and technology work that represent my
                interests and practical capabilities.
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {projects.map((project, index) => (
              <article
                key={project.title}
                className="project-card reveal"
                style={{ animationDelay: `${150 + index * 120}ms` }}
              >
                <div className={`project-glow bg-gradient-to-br ${project.accent}`} />

                <div className="relative flex items-start justify-between">
                  <span className="text-xs tracking-[0.2em] text-white/25">
                    {project.number}
                  </span>
                  <span className="text-white/30 transition-transform duration-300 group-hover:translate-x-1">
                    ↗
                  </span>
                </div>

                <div className="relative mt-36">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                    {project.category}
                  </p>
                  <h3 className="mt-3 text-2xl font-medium tracking-tight">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/40">
                    {project.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/work"
              className="inline-flex text-sm text-white/45 transition hover:text-white"
            >
              View more work <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-white/[0.08] px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="reveal">
              <p className="section-label">How It Works</p>
              <h2 className="section-title mt-4">
                Simple process.
                <br />
                Clear delivery.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-white/40">
                No unnecessary complexity. Start with the requirement, define
                the work and move step by step toward delivery.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {process.map((item, index) => (
                <div
                  key={item.number}
                  className="process-card reveal"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-xs tracking-[0.2em] text-white/25">
                    {item.number}
                  </span>
                  <h3 className="mt-10 text-lg font-medium">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/40">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-white/[0.08] px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="reveal">
            <p className="section-label">About</p>
            <h2 className="section-title mt-4">
              Technology from
              <br />
              a practical perspective.
            </h2>
          </div>

          <div className="reveal reveal-delay-1">
            <div className="space-y-5 text-base leading-8 text-white/45 sm:text-lg">
              <p>
                I&apos;m Sayan Mondal, a computer science student interested in
                software development, cybersecurity, mobile technology,
                artificial intelligence and testing.
              </p>

              <p>
                Sayan Tech Services brings those interests together into one
                platform — giving clients a simple way to request work,
                communicate, track projects and manage their services.
              </p>
            </div>

            <div className="mt-9 flex flex-wrap gap-2">
              {[
                "Software",
                "Cybersecurity",
                "Web",
                "Android",
                "AI / AIoT",
                "Testing",
                "Photography",
                "Technology",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 text-xs text-white/45"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="px-5 py-24 lg:px-8 lg:py-32">
        <div className="cta-panel reveal mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 p-8 text-center sm:p-16 lg:p-24">
          <div className="cta-glow" />

          <div className="relative">
            <p className="section-label">Have a project?</p>

            <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Let&apos;s build something
              <span className="text-white/35"> useful.</span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/40 sm:text-base">
              Tell me what you need. Request a service, ask a question, or
              start a conversation about a technology project.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="primary-button rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black"
              >
                Contact Me
              </Link>

              <Link
                href="/services"
                className="secondary-button rounded-full border border-white/15 bg-black/20 px-7 py-3.5 text-sm font-medium"
              >
                Browse Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] px-5 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-xs text-white/30 sm:flex-row sm:items-center">
          <div>
            <p className="font-medium text-white/55">SAYAN.</p>
            <p className="mt-1">Technology • Testing • Security • Development</p>
          </div>

          <div className="flex gap-6">
            <a href="/about" className="transition hover:text-white">About</a>
            <a href="/contact" className="transition hover:text-white">Contact</a>
            <a href="/login" className="transition hover:text-white">Client Portal</a>
          </div>

          <p>© 2026 Sayan Mondal</p>
        </div>
      </footer>

      {/* Floating AI Assistant */}
      <Link
        href="/assistant"
        className="ai-float group fixed bottom-6 right-5 z-50 flex items-center gap-3 rounded-full border border-white/15 bg-white px-5 py-3.5 text-sm font-semibold text-black shadow-2xl sm:right-7"
      >
        <span className="ai-spark">✦</span>
        AI Assistant
        <span className="hidden text-black/40 transition-transform duration-300 group-hover:translate-x-1 sm:inline">
          →
        </span>
      </Link>
    </main>
  );
}
