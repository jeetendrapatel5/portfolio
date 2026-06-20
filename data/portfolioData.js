export const NAV_LINKS = [
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Technologies", href: "/technologies" },
  { label: "Contact", href: "/contact" },
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
  { value: "25+", label: "Core technologies" },
  { value: "Open", label: "For new work" },
];

export const HERO_SOCIALS = [
  {
    label: "X",
    href: "https://x.com/jeetendragp",
    platform: "x",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/yourhandle",
    platform: "linkedin",
  },
  {
    label: "GitHub",
    href: "https://github.com/jeetendrapatel5",
    platform: "github",
  },
];

export const PROJECTS = [
  {
    number: "01",
    title: "Opprine",
    category: "SaaS Client Portal",
    year: "2026",
    status: "Product build",
    subtitle:
      "A client delivery system that makes freelance work feel calm, transparent, and premium from the first handoff.",
    story:
      "Opprine is shaped around trust: magic-link access, delivery milestones, decision history, invoice readiness, and clean project stories that clients can understand without a walkthrough.",
    signals: [
      "Designed the experience around client confidence, not internal admin screens.",
      "Built the architecture for secure handoffs, project state, billing flows, and durable records.",
      "Turns progress, approvals, and deliverables into a polished product narrative.",
    ],
    stack: ["Next.js", "PostgreSQL", "Prisma", "Redis", "Stripe", "Resend"],
    preview: "portal",
  },
  // {
  //   number: "02",
  //   title: "Architecture Lab",
  //   category: "System Design Study",
  //   year: "2026",
  //   status: "Case study",
  //   subtitle:
  //     "A technical storytelling environment for designing, explaining, and stress-testing production web systems.",
  //   story:
  //     "The project maps product requirements into APIs, queues, cache strategy, database constraints, and failure paths so the system reads like a thoughtful engineering decision, not a pile of features.",
  //   signals: [
  //     "Documents the path from user journey to schema, service boundaries, and cache strategy.",
  //     "Highlights tradeoffs clearly for recruiters, founders, and engineering teams.",
  //     "Shows how frontend polish and backend reliability support the same business outcome.",
  //   ],
  //   stack: ["System Design", "Node.js", "Express.js", "Redis", "PostgreSQL"],
  //   preview: "map",
  // },
  // {
  //   number: "03",
  //   title: "Invoiced",
  //   category: "Payments Platform",
  //   year: "2025",
  //   status: "Shipped concept",
  //   subtitle:
  //     "A lightweight invoice and payment workflow for independent builders who need clarity without enterprise noise.",
  //   story:
  //     "Invoiced focuses on the practical details that make a tool feel reliable: clean invoice states, fast PDF generation, payment visibility, multi-currency thinking, and a UI that keeps money conversations professional.",
  //   signals: [
  //     "Built around real freelancer workflows: draft, send, follow up, settle, archive.",
  //     "Keeps financial state legible while leaving room for Stripe Connect and automation.",
  //     "Balances a minimalist interface with the operational detail users need.",
  //   ],
  //   stack: ["React", "Node.js", "Express.js", "Stripe", "PostgreSQL"],
  //   preview: "terminal",
  // },
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

export const SERVICES = [
  {
    number: "01",
    title: "Full-Stack Product Build",
    category: "End-to-end development",
    tagline: "From empty repo to production-ready product. no hand-offs, no gaps.",
    description:
      "I design, architect, and ship complete web products. Database schema, auth system, REST API, payment integration, email workflows, file handling, and a polished UI — all in one engagement. You get a system that is ready to grow, not just ready to demo.",
    deliverables: [
      "Next.js application with server and client components",
      "PostgreSQL schema with Prisma ORM and migration history",
      "Authentication system (session, magic-link, or OAuth)",
      "Payment integration via Stripe (subscriptions or one-off)",
      "Transactional email via Resend with branded templates",
      "Deployment pipeline on Vercel with environment config",
    ],
    tags: ["Next.js", "React", "Node.js", "PostgreSQL", "Prisma", "Stripe", "Resend"],
    rate: "Project-based",
  },
  {
    number: "02",
    title: "SaaS Architecture & Build",
    category: "Multi-tenant systems",
    tagline: "Structured around the decisions that are expensive to undo.",
    description:
      "SaaS products live or die by the choices made in the first sprint: data model, tenant isolation, permission system, billing model. I build these foundations correctly then layer the product on top so you never have to rewrite the core.",
    deliverables: [
      "Multi-tenant schema with proper row-level isolation",
      "Plan enforcement layer (FREE / PRO / ENTERPRISE tiers)",
      "Role-based access control across all API routes",
      "Stripe billing: subscriptions, upgrades, webhooks, idempotency",
      "Admin dashboard for user and plan management",
      "Caching strategy with Redis for hot paths",
    ],
    tags: ["SaaS", "Next.js", "PostgreSQL", "Prisma", "Redis", "Stripe"],
    rate: "Project-based",
  },
  {
    number: "03",
    title: "API & Backend Engineering",
    category: "Backend systems",
    tagline: "Reliable, documented APIs that teams can build on with confidence.",
    description:
      "REST APIs designed around clear contracts, consistent error shapes, auth middleware, rate limiting, and a caching strategy that scales. I focus on the details that matter in production: idempotency, graceful degradation, and systems other developers enjoy working with.",
    deliverables: [
      "RESTful API with consistent response and error contracts",
      "JWT or session-based auth with refresh token rotation",
      "Redis caching layer with TTL and invalidation strategy",
      "Rate limiting and abuse-prevention middleware",
      "Background job queue for async processing",
      "API documentation with route reference and examples",
    ],
    tags: ["Node.js", "Express.js", "PostgreSQL", "Redis", "JWT", "BullMQ"],
    rate: "Hourly · Project",
  },
  {
    number: "04",
    title: "Frontend Engineering & UI",
    category: "Interface build",
    tagline: "Interfaces that feel as good as they look — and stay maintainable.",
    description:
      "Component architecture, design system implementation, scroll animations, dark mode, performance optimisation, and the kind of UI precision that clients notice and competitors copy. I treat the frontend as a product decision, not a delivery step.",
    deliverables: [
      "React component library with consistent prop API",
      "Design token system (CSS custom properties or Tailwind config)",
      "GSAP animation layer: scroll reveals, entrance timelines, hover states",
      "Dark and light mode with zero flash on load",
      "Core Web Vitals audit and performance pass",
      "Fully responsive layout from 320px to ultrawide",
    ],
    tags: ["React", "Next.js", "Tailwind CSS", "GSAP", "TypeScript", "CSS"],
    rate: "Hourly · Project",
  },
  {
    number: "05",
    title: "Technical Consultation",
    category: "Advisory & review",
    tagline: "Sharp thinking before the expensive decision, not after.",
    description:
      "Architecture reviews, stack decisions, database modelling, system design sessions, and code audits. I work with founders and small teams to make the right call early so you build the correct thing rather than fixing the wrong one.",
    deliverables: [
      "Architecture review with written findings and recommendations",
      "System design document (schema, service map, data flow)",
      "Stack recommendation with trade-off analysis",
      "Code audit: patterns, security gaps, performance issues",
      "1-on-1 sessions (async Loom or live call)",
    ],
    tags: ["System Design", "Architecture", "Code Review", "PostgreSQL", "Strategy"],
    rate: "Hourly",
  },
];

export const TECHNOLOGIES = [
  {
    group: "Frontend",
    kicker: "01",
    headline: "What the user sees, touches, and feels.",
    items: [
      { name: "Next.js", level: "Core", years: "2+ yrs", note: "App Router, RSC, server actions, middleware, ISR, streaming." },
      { name: "React", level: "Core", years: "3+ yrs", note: "Hooks, context, compound patterns, performance profiling." },
      { name: "TypeScript", level: "Proficient", years: "2+ yrs", note: "Strict mode, Zod schemas, type-safe API contracts." },
      { name: "JavaScript", level: "Core", years: "3+ yrs", note: "ES2024+, async/await, closures, event loop, modules." },
      { name: "CSS", level: "Core", years: "3+ yrs", note: "Custom properties, grid, keyframes, dark mode systems." },
      { name: "Tailwind CSS", level: "Core", years: "2+ yrs", note: "JIT, design token systems, responsive utility patterns." },
      { name: "GSAP", level: "Proficient", years: "1+ yrs", note: "ScrollTrigger, entrance timelines, motion systems." },
      { name: "Shadcn UI", level: "Proficient", years: "1+ yrs", note: "Component library, theming, accessible primitives." },
    ],
  },
  {
    group: "Backend",
    kicker: "02",
    headline: "The engine running beneath the interface.",
    items: [
      { name: "Node.js", level: "Core", years: "2+ yrs", note: "Event loop, streams, module system, performance." },
      { name: "Express.js", level: "Core", years: "2+ yrs", note: "REST APIs, middleware chains, structured error handling." },
      { name: "REST APIs", level: "Core", years: "3+ yrs", note: "Contract design, versioning, idempotency, rate limiting." },
      { name: "Authentication", level: "Proficient", years: "2+ yrs", note: "JWT, sessions, magic-link, OAuth, token rotation." },
      { name: "Redis", level: "Proficient", years: "1+ yrs", note: "Cache layer, TTL strategy, pub/sub, rate limiting." },
      { name: "BullMQ", level: "Familiar", years: "1+ yrs", note: "Background job queues, retries, concurrency." },
    ],
  },
  {
    group: "Data",
    kicker: "03",
    headline: "Decisions that cost the most to undo.",
    items: [
      { name: "PostgreSQL", level: "Core", years: "2+ yrs", note: "Schema design, indexes, joins, constraints, migrations." },
      { name: "Prisma ORM", level: "Core", years: "2+ yrs", note: "Schema-first workflow, type-safe queries, relations." },
      { name: "Schema Design", level: "Proficient", years: "2+ yrs", note: "Normalisation, multi-tenancy patterns, soft deletes." },
      { name: "Query Perf.", level: "Proficient", years: "1+ yrs", note: "EXPLAIN ANALYSE, N+1 elimination, selective loading." },
    ],
  },
  {
    group: "Tooling & Product",
    kicker: "04",
    headline: "The craft layer that ships and sustains.",
    items: [
      { name: "Stripe", level: "Proficient", years: "1+ yrs", note: "Subscriptions, one-off payments, webhooks, idempotency." },
      { name: "Resend", level: "Proficient", years: "1+ yrs", note: "Transactional email, React Email templates, deliverability." },
      { name: "Cloudinary", level: "Familiar", years: "1+ yrs", note: "Image upload, on-the-fly transforms, CDN delivery." },
      { name: "Vercel", level: "Core", years: "2+ yrs", note: "Deployment pipelines, preview envs, edge config." },
      { name: "Git", level: "Core", years: "3+ yrs", note: "Branching strategy, conventional commits, PR workflow." },
      { name: "System Design", level: "Proficient", years: "2+ yrs", note: "Service maps, data flow diagrams, failure mode analysis." },
      { name: "HTML", level: "Core", years: "3+ yrs", note: "Semantic markup, ARIA, accessibility, SEO structure." },
    ],
  },
];
