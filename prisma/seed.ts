import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const services = [
  {
    name: "Web Development",
    slug: "web-development",
    category: "Development",
    description: "Modern responsive websites and web applications.",
    details:
      "Custom website development with responsive design, frontend development and backend integration.",
    startingPrice: 3000,
  },
  {
    name: "Website Security Testing",
    slug: "website-security-testing",
    category: "Cybersecurity",
    description: "Security checks to identify common website vulnerabilities.",
    details:
      "Basic security assessment covering common web security issues and configuration weaknesses.",
    startingPrice: 2500,
  },
  {
    name: "Website & App Testing",
    slug: "website-app-testing",
    category: "Testing",
    description: "Functional and usability testing for websites and applications.",
    details:
      "Testing for bugs, broken functionality, usability issues and inconsistent behaviour.",
    startingPrice: 1500,
  },
  {
    name: "Android App Testing",
    slug: "android-app-testing",
    category: "Testing",
    description: "Testing Android applications across devices and use cases.",
    details:
      "Android application testing focused on functionality, usability, compatibility and common issues.",
    startingPrice: 1500,
  },
  {
    name: "AI / AIoT Testing",
    slug: "ai-aiot-testing",
    category: "AI Testing",
    description: "Testing AI-powered applications and AIoT concepts.",
    details:
      "Testing AI features, interaction flows, prototype behaviour and practical device integration.",
    startingPrice: 2000,
  },
  {
    name: "Mobile Photography",
    slug: "mobile-photography",
    category: "Photography",
    description: "Smartphone photography for products, devices and creative projects.",
    details:
      "Mobile photography services for technology products, devices, portfolios and selected creative requirements.",
    startingPrice: 1000,
  },
  {
    name: "Application Assistance",
    slug: "application-assistance",
    category: "Assistance",
    description: "Assistance with online forms and application processes.",
    details:
      "Guidance and assistance with online government, education, job and other application processes.",
    startingPrice: 300,
  },
  {
    name: "Tech Collaboration",
    slug: "tech-collaboration",
    category: "Technology",
    description: "Technical collaboration for projects, prototypes and technology initiatives.",
    details:
      "Collaboration on technology projects, prototypes, testing and related technical activities.",
    startingPrice: 2000,
  },
];

async function main() {
  for (const service of services) {
    await prisma.service.upsert({
      where: {
        slug: service.slug,
      },
      update: service,
      create: service,
    });
  }

  console.log("Services seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });