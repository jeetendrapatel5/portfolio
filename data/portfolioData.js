export const NAV_LINKS = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Stack", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export const MARQUEE_SKILLS = [
  "Next.js",
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Express.js",
  "PostgreSQL",
  "Prisma ORM",
  "Redis",
  "Tailwind CSS",
  "Shadcn UI",
  "System Design",
];

export const HERO_STATS = [
  { value: "3",     label: "Products shipped"  },
  { value: "25+",   label: "Core technologies" },
  { value: "Open",  label: "For new work"       },
];

export const PROJECTS = [
  {
    number: "01",
    title: "Freeport",
    category: "SaaS Client Portal",
    year: "2026",
    status: "Product build",
    subtitle:
      "A client delivery system that makes freelance work feel calm, transparent, and premium from the first handoff.",
    story:
      "Freeport is shaped around trust: magic-link access, delivery milestones, decision history, invoice readiness, and clean project stories that clients can understand without a walkthrough.",
    signals: [
      "Designed the experience around client confidence, not internal admin screens.",
      "Built the architecture for secure handoffs, project state, billing flows, and durable records.",
      "Turns progress, approvals, and deliverables into a polished product narrative.",
    ],
    stack: ["Next.js", "PostgreSQL", "Prisma", "Redis", "Stripe", "Resend"],
    preview: "portal",
  },
  {
    number: "02",
    title: "Architecture Lab",
    category: "System Design Study",
    year: "2026",
    status: "Case study",
    subtitle:
      "A technical storytelling environment for designing, explaining, and stress-testing production web systems.",
    story:
      "The project maps product requirements into APIs, queues, cache strategy, database constraints, and failure paths so the system reads like a thoughtful engineering decision, not a pile of features.",
    signals: [
      "Documents the path from user journey to schema, service boundaries, and cache strategy.",
      "Highlights tradeoffs clearly for recruiters, founders, and engineering teams.",
      "Shows how frontend polish and backend reliability support the same business outcome.",
    ],
    stack: ["System Design", "Node.js", "Express.js", "Redis", "PostgreSQL"],
    preview: "map",
  },
  {
    number: "03",
    title: "Invoiced",
    category: "Payments Platform",
    year: "2025",
    status: "Shipped concept",
    subtitle:
      "A lightweight invoice and payment workflow for independent builders who need clarity without enterprise noise.",
    story:
      "Invoiced focuses on the practical details that make a tool feel reliable: clean invoice states, fast PDF generation, payment visibility, multi-currency thinking, and a UI that keeps money conversations professional.",
    signals: [
      "Built around real freelancer workflows: draft, send, follow up, settle, archive.",
      "Keeps financial state legible while leaving room for Stripe Connect and automation.",
      "Balances a minimalist interface with the operational detail users need.",
    ],
    stack: ["React", "Node.js", "Express.js", "Stripe", "PostgreSQL"],
    preview: "terminal",
  },
];

export const SKILL_GROUPS = [
  {
    title: "Frontend",
    items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "Shadcn UI"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express.js", "REST APIs", "Authentication", "Caching", "Background workflows"],
  },
  {
    title: "Data",
    items: ["PostgreSQL", "Prisma ORM", "Redis", "Schema design", "Query performance"],
  },
  {
    title: "Product Craft",
    items: ["System design", "UX thinking", "Performance", "Clean architecture", "Production polish"],
  },
];

export const METHOD = [
  {
    title: "Clarify",
    text: "I start by turning vague requirements into a sharp product model, success criteria, and technical boundaries.",
  },
  {
    title: "Architect",
    text: "I map the data, routes, API contracts, states, and failure cases before the interface becomes expensive to change.",
  },
  {
    title: "Craft",
    text: "I build interfaces that feel precise, fast, and calm while keeping the code readable enough to keep evolving.",
  },
  {
    title: "Harden",
    text: "I look for the production details: loading states, empty states, accessibility, performance, and maintainable patterns.",
  },
];
