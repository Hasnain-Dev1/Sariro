// Centralized content data for the Sariro multi-page site.
// Each "page" view reads from here.

import type { RouteId } from "./nav";

/* ----------------------------------------------------------------------------
 * NAVIGATION
 * ------------------------------------------------------------------------- */

export const NAV_LINKS: { label: string; view: RouteId }[] = [
  { label: "Courses", view: "courses" },
  { label: "Schools", view: "schools" },
  { label: "Events", view: "events" },
  { label: "Pricing", view: "pricing" },
  { label: "YouTube", view: "youtube" },
  { label: "Resources", view: "resources" },
  { label: "About", view: "about" },
];

export const TRUSTED_BY = [
  "McGraw-Hill",
  "Google Student Club",
  "Codingal",
] as const;

/* ----------------------------------------------------------------------------
 * STATS
 * ------------------------------------------------------------------------- */

export const HERO_STATS = [
  { value: 5000, suffix: "+", label: "Students" },
  { value: 65, suffix: "+", label: "Nationalities" },
  { value: 36, suffix: "", label: "Research Papers" },
  { value: 7, suffix: "", label: "Patents" },
] as const;

/* ----------------------------------------------------------------------------
 * WHAT WE DO (tracks)
 * ------------------------------------------------------------------------- */

export const TRACKS = [
  {
    id: "students",
    tag: "For Students",
    icon: "GraduationCap",
    title: "Build strong foundations",
    description:
      "Computational thinking and AI literacy for grades 6–12 and college students. We teach how to think like an engineer — not just how to type syntax.",
    bullets: [
      "Grades 6–12 & college pathways",
      "Project-based, cohort learning",
      "From first Python loop to building real AI projects",
    ],
    accent: "blue" as const,
    cta: "Explore student courses",
    view: "courses" as RouteId,
  },
  {
    id: "schools",
    tag: "For Schools",
    icon: "School",
    title: "Bring the future into class",
    description:
      "Curriculum consultation, hackathons, and immersive workshops that turn your classrooms into AI-ready labs.",
    bullets: [
      "Curriculum design & consultation",
      "On-site & virtual workshops",
      "School-wide hackathons",
    ],
    accent: "green" as const,
    cta: "Book a school workshop",
    view: "schools" as RouteId,
  },
  {
    id: "professionals",
    tag: "For Professionals",
    icon: "Briefcase",
    title: "Upskill with practical AI",
    description:
      "Learn how to leverage modern AI tools to supercharge your career — finish your daily work in half the time.",
    bullets: [
      "No coding skills required to start",
      "Real-world AI workflows & automations",
      "Cohort-based, mentor-led",
    ],
    accent: "blue" as const,
    cta: "Join the next cohort",
    view: "courses" as RouteId,
  },
] as const;

/* ----------------------------------------------------------------------------
 * COURSES CATALOG
 * ------------------------------------------------------------------------- */

export type Level = "Beginner" | "Intermediate" | "Advanced";
export type Audience = "Students" | "Schools" | "Professionals" | "All";

export interface Course {
  id: string;
  title: string;
  tagline: string;
  level: Level;
  audience: Audience;
  format: "Cohort" | "Self-paced";
  durationWeeks: number;
  modules: number;
  price: number;
  priceLabel: string;
  nextCohort: string;
  featured: boolean;
  accent: "blue" | "green";
  syllabus: string[];
  outcomes: string[];
}

export const COURSES: Course[] = [
  {
    id: "ai-literacy",
    title: "AI Literacy Fundamentals",
    tagline: "Understand what AI is, what it isn't, and how to use it ethically.",
    level: "Beginner",
    audience: "All",
    format: "Cohort",
    durationWeeks: 4,
    modules: 6,
    price: 149,
    priceLabel: "$149",
    nextCohort: "Jan 12, 2026",
    featured: true,
    accent: "blue",
    syllabus: [
      "How machines actually learn — without the math",
      "Prompting like a pro: patterns that work",
      "Spotting AI bias, hallucinations & risks",
      "Building your first AI workflow",
      "Ethics: when NOT to use AI",
      "Capstone: ship a real AI-powered tool",
    ],
    outcomes: [
      "Confidently explain AI to anyone",
      "Cut daily tasks in half with AI tools",
      "Make ethical AI decisions at work",
    ],
  },
  {
    id: "python-thinkers",
    title: "Python for Thinkers",
    tagline: "Your first programming language — taught through problem-solving, not memorization.",
    level: "Beginner",
    audience: "Students",
    format: "Cohort",
    durationWeeks: 8,
    modules: 10,
    price: 199,
    priceLabel: "$199",
    nextCohort: "Jan 19, 2026",
    featured: true,
    accent: "green",
    syllabus: [
      "Variables, loops & the art of decomposition",
      "Functions: packaging your thinking",
      "Lists, dicts & data you can touch",
      "Conditionals & decision trees",
      "Reading errors like a detective",
      "Mini-projects: calculator, quiz game, to-do app",
      "Intro to APIs & real data",
      "Capstone: build a useful tool for yourself",
      "Code review & giving feedback",
      "Where to go next — your learning roadmap",
    ],
    outcomes: [
      "Write real Python from scratch",
      "Think in steps a computer can follow",
      "Ready for intermediate AI courses",
    ],
  },
  {
    id: "building-with-llms",
    title: "Building with LLMs",
    tagline: "Go from API key to shipping a production-grade AI feature.",
    level: "Intermediate",
    audience: "Professionals",
    format: "Cohort",
    durationWeeks: 6,
    modules: 8,
    price: 349,
    priceLabel: "$349",
    nextCohort: "Feb 02, 2026",
    featured: true,
    accent: "blue",
    syllabus: [
      "LLM anatomy: tokens, context & cost",
      "Prompt engineering at scale",
      "RAG: giving models your data",
      "Function calling & agents",
      "Streaming, latency & UX",
      "Evaluation & guardrails",
      "Cost optimization & caching",
      "Capstone: ship a deployed AI feature",
    ],
    outcomes: [
      "Ship a real AI feature end-to-end",
      "Architect RAG pipelines that work",
      "Control cost, latency & quality",
    ],
  },
  {
    id: "ai-educators",
    title: "AI for Educators",
    tagline: "Bring AI into your classroom — confidently and ethically.",
    level: "Beginner",
    audience: "Schools",
    format: "Cohort",
    durationWeeks: 3,
    modules: 5,
    price: 129,
    priceLabel: "$129",
    nextCohort: "Jan 26, 2026",
    featured: false,
    accent: "green",
    syllabus: [
      "AI literacy for teachers (no coding)",
      "Lesson planning with AI assistants",
      "Assessment & academic integrity",
      "Age-appropriate AI activities for K–12",
      "Building your school's AI policy",
    ],
    outcomes: [
      "Save hours on lesson prep",
      "Design AI-integrated lessons",
      "Lead your school's AI strategy",
    ],
  },
  {
    id: "ct-6-8",
    title: "Computational Thinking · Grades 6–8",
    tagline: "The mental models behind coding — built for young minds.",
    level: "Beginner",
    audience: "Students",
    format: "Cohort",
    durationWeeks: 10,
    modules: 12,
    price: 179,
    priceLabel: "$179",
    nextCohort: "Feb 09, 2026",
    featured: false,
    accent: "blue",
    syllabus: [
      "Decomposition: breaking big problems",
      "Pattern recognition",
      "Abstraction & algorithms",
      "Block-based to text-based coding",
      "Logic puzzles & games",
      "Build a simple AI chatbot",
      "Internet safety & digital citizenship",
      "Capstone: a project you're proud of",
    ],
    outcomes: [
      "Think in structured steps",
      "Build simple programs & games",
      "Ready for advanced coding tracks",
    ],
  },
  {
    id: "ct-9-12",
    title: "Computational Thinking · Grades 9–12",
    tagline: "From algorithms to your first AI project — college-ready skills.",
    level: "Intermediate",
    audience: "Students",
    format: "Cohort",
    durationWeeks: 12,
    modules: 14,
    price: 229,
    priceLabel: "$229",
    nextCohort: "Feb 16, 2026",
    featured: false,
    accent: "blue",
    syllabus: [
      "Algorithms & data structures basics",
      "Python fluency",
      "How ML models learn",
      "Training a model on your data",
      "Ethics, bias & responsible AI",
      "Building a portfolio project",
      "College & career pathways in AI",
      "Capstone: end-to-end AI project",
    ],
    outcomes: [
      "College-ready programming skills",
      "Train & evaluate a real ML model",
      "A portfolio project that stands out",
    ],
  },
  {
    id: "devops-ai",
    title: "DevOps & Modern AI Deployment",
    tagline: "Ship AI systems that don't break at 3am.",
    level: "Advanced",
    audience: "Professionals",
    format: "Cohort",
    durationWeeks: 5,
    modules: 7,
    price: 399,
    priceLabel: "$399",
    nextCohort: "Feb 23, 2026",
    featured: false,
    accent: "green",
    syllabus: [
      "Containerizing AI services",
      "Model serving & inference optimization",
      "CI/CD for ML pipelines",
      "Observability & monitoring models",
      "Scaling & cost control",
      "Security & compliance",
      "Capstone: deploy a fault-tolerant AI service",
    ],
    outcomes: [
      "Deploy AI to production safely",
      "Monitor models in the wild",
      "Cut inference costs by 40%+",
    ],
  },
  {
    id: "research-methods",
    title: "Research Methods in AI",
    tagline: "From hypothesis to published paper — Mimo's playbook.",
    level: "Advanced",
    audience: "Professionals",
    format: "Cohort",
    durationWeeks: 6,
    modules: 8,
    price: 299,
    priceLabel: "$299",
    nextCohort: "Mar 02, 2026",
    featured: false,
    accent: "blue",
    syllabus: [
      "Finding research questions that matter",
      "Literature review without drowning",
      "Experiment design & reproducibility",
      "Statistical rigor (the useful parts)",
      "Writing papers reviewers love",
      "The publication process",
      "Patents: protecting your work",
      "Capstone: a publishable draft",
    ],
    outcomes: [
      "Design rigorous AI experiments",
      "Write papers that get accepted",
      "Navigate patents & IP",
    ],
  },
];

/* ----------------------------------------------------------------------------
 * SCHOOL PACKAGES
 * ------------------------------------------------------------------------- */

export interface SchoolPackage {
  id: string;
  name: string;
  duration: string;
  audience: string;
  priceLabel: string;
  description: string;
  features: string[];
  accent: "blue" | "green";
  popular?: boolean;
}

export const SCHOOL_PACKAGES: SchoolPackage[] = [
  {
    id: "workshop",
    name: "Immersive Workshop",
    duration: "1 day · 6 hours",
    audience: "Up to 60 students",
    priceLabel: "From $1,200",
    description:
      "A high-energy single day that demystifies AI and gets every student hands-on with real tools.",
    features: [
      "On-site or virtual delivery",
      "Hands-on AI activity stations",
      "Grade-tailored content (6–12)",
      "Take-home project for each student",
      "Teacher debrief & resource pack",
    ],
    accent: "blue",
  },
  {
    id: "hackathon",
    name: "AI Hackathon",
    duration: "Weekend · 2 days",
    audience: "Up to 120 students",
    priceLabel: "From $3,500",
    description:
      "A weekend of building. Students form teams, get mentorship, and ship real AI prototypes.",
    features: [
      "48-hour build sprint",
      "Mentor-led team coaching",
      "Judging & prizes",
      "All materials & platform access",
      "Showcase event for parents & staff",
      "Post-event impact report",
    ],
    accent: "green",
    popular: true,
  },
  {
    id: "curriculum",
    name: "Curriculum Consultation",
    duration: "1 semester",
    audience: "Whole department",
    priceLabel: "Custom",
    description:
      "We co-design an AI literacy strand that fits your school's existing curriculum — sustainably.",
    features: [
      "Curriculum audit & gap analysis",
      "Custom AI literacy scope & sequence",
      "Teacher training sessions",
      "Lesson plan library (30+ lessons)",
      "Assessment rubrics",
      "Quarterly review & iteration",
    ],
    accent: "blue",
  },
  {
    id: "ai-lab",
    name: "Full AI Lab Setup",
    duration: "Full academic year",
    audience: "School-wide",
    priceLabel: "Custom",
    description:
      "Turnkey transformation — from curriculum to a functioning AI lab your teachers own.",
    features: [
      "Everything in Curriculum Consultation",
      "Physical/virtual AI lab setup",
      "4 immersive workshops across the year",
      "School-wide hackathon",
      "Teacher certification program",
      "Dedicated Sariro success manager",
      "Annual impact & outcomes report",
    ],
    accent: "green",
  },
];

export const SCHOOL_OUTCOMES = [
  { value: 120, suffix: "+", label: "Schools engaged" },
  { value: 15000, suffix: "+", label: "Students reached" },
  { value: 98, suffix: "%", label: "Would recommend" },
  { value: 4, suffix: "x", label: "Avg engagement lift" },
] as const;

/* ----------------------------------------------------------------------------
 * RESOURCES
 * ------------------------------------------------------------------------- */

export interface Resource {
  id: string;
  type: "paper" | "blog" | "download";
  title: string;
  description: string;
  tag: string;
  date: string;
  readTime?: string;
}

export const RESOURCES: Resource[] = [
  // Research papers
  {
    id: "p1",
    type: "paper",
    title: "Neural Network Optimization via Layer-wise Pruning",
    description:
      "A novel pruning strategy that reduces model size by 60% with negligible accuracy loss.",
    tag: "Neural Networks",
    date: "2025",
  },
  {
    id: "p2",
    type: "paper",
    title: "Computational Efficiency in Edge AI Deployment",
    description:
      "Techniques for running inference-heavy models on resource-constrained devices.",
    tag: "Edge AI",
    date: "2024",
  },
  {
    id: "p3",
    type: "paper",
    title: "Educational Frameworks for AI Literacy in K-12",
    description:
      "A structured framework for introducing AI concepts across grade levels — the basis of Sariro's curriculum.",
    tag: "EdTech",
    date: "2024",
  },
  {
    id: "p4",
    type: "paper",
    title: "Adaptive Learning Rate Schedules for Transformer Models",
    description: "Empirical study of scheduling strategies for stable large-model training.",
    tag: "Training",
    date: "2023",
  },
  {
    id: "p5",
    type: "paper",
    title: "Patent: Real-time Multi-agent Orchestration System",
    description: "Granted patent for a system that coordinates multiple AI agents with conflict resolution.",
    tag: "Patent",
    date: "2023",
  },
  {
    id: "p6",
    type: "paper",
    title: "Bias Detection in Generative AI Outputs",
    description: "A measurement framework for quantifying and mitigating bias in LLM responses.",
    tag: "AI Ethics",
    date: "2023",
  },
  // Blog
  {
    id: "b1",
    type: "blog",
    title: "Why I Teach Thinking, Not Coding",
    description:
      "The philosophy behind Sariro — and why syntax is the easy part.",
    tag: "Philosophy",
    date: "Dec 2025",
    readTime: "6 min",
  },
  {
    id: "b2",
    type: "blog",
    title: "5 Prompt Patterns That Actually Work in 2026",
    description: "Battle-tested prompting strategies from real cohort projects.",
    tag: "Practical AI",
    date: "Nov 2025",
    readTime: "8 min",
  },
  {
    id: "b3",
    type: "blog",
    title: "How to Talk to Kids About AI (Without Scaring Them)",
    description: "A parent's guide to honest, hopeful AI conversations.",
    tag: "For Parents",
    date: "Oct 2025",
    readTime: "5 min",
  },
  {
    id: "b4",
    type: "blog",
    title: "The Cohort Effect: Why Learning Together Beats Learning Alone",
    description: "The learning science behind our cohort model.",
    tag: "Learning",
    date: "Sep 2025",
    readTime: "7 min",
  },
  // Downloads
  {
    id: "d1",
    type: "download",
    title: "AI Literacy Cheatsheet (PDF)",
    description: "A 2-page reference covering the 20 AI terms every professional should know.",
    tag: "Cheatsheet",
    date: "2026",
  },
  {
    id: "d2",
    type: "download",
    title: "Prompt Engineering Template Pack",
    description: "12 ready-to-use prompt templates for work, study, and creativity.",
    tag: "Templates",
    date: "2026",
  },
  {
    id: "d3",
    type: "download",
    title: "School AI Policy Starter Kit",
    description: "A draft AI policy document schools can adapt in under a day.",
    tag: "For Schools",
    date: "2025",
  },
  {
    id: "d4",
    type: "download",
    title: "Learning Roadmap: From Beginner to AI Builder",
    description: "A visual 12-month roadmap for self-directed AI learners.",
    tag: "Roadmap",
    date: "2025",
  },
];

/* ----------------------------------------------------------------------------
 * VIDEO LIBRARY
 * ------------------------------------------------------------------------- */

export interface Video {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  category: string;
  views: string;
  featured?: boolean;
}

export const VIDEOS: Video[] = [
  {
    id: "trends",
    title: "AI Trends 2026",
    description: "Where the industry is heading — and what to learn now to stay ahead.",
    image: "/images/yt-trends.png",
    duration: "14:22",
    category: "AI Trends",
    views: "82K",
    featured: true,
  },
  {
    id: "logic",
    title: "Logic Over Syntax",
    description: "Why thinking matters more than memorizing code — the Sariro philosophy.",
    image: "/images/yt-logic.png",
    duration: "09:48",
    category: "Philosophy",
    views: "64K",
    featured: true,
  },
  {
    id: "future",
    title: "Future of Education",
    description: "How AI is rewiring the classroom — the right way.",
    image: "/images/yt-future.png",
    duration: "18:05",
    category: "Education",
    views: "71K",
    featured: true,
  },
  {
    id: "rag",
    title: "RAG Explained Simply",
    description: "Retrieval-augmented generation without the jargon — with a live demo.",
    image: "/images/yt-logic.png",
    duration: "22:10",
    category: "Practical AI",
    views: "45K",
  },
  {
    id: "prompts",
    title: "Prompt Patterns That Scale",
    description: "The 5 patterns I use daily — and why most people get prompting wrong.",
    image: "/images/yt-trends.png",
    duration: "11:33",
    category: "Practical AI",
    views: "58K",
  },
  {
    id: "kids",
    title: "Teaching AI to a 10-Year-Old",
    description: "A real classroom session — watch curiosity ignite.",
    image: "/images/yt-future.png",
    duration: "16:47",
    category: "Education",
    views: "93K",
  },
  {
    id: "agents",
    title: "Building Your First AI Agent",
    description: "From idea to working agent in 20 minutes — no frameworks required.",
    image: "/images/yt-logic.png",
    duration: "19:58",
    category: "Build Along",
    views: "39K",
  },
  {
    id: "ethics",
    title: "The Ethics Question Nobody Asks",
    description: "When should you NOT use AI? A framework for hard decisions.",
    image: "/images/yt-future.png",
    duration: "13:21",
    category: "AI Ethics",
    views: "27K",
  },
  {
    id: "roadmap",
    title: "The 2026 AI Learning Roadmap",
    description: "Exactly what to learn, in what order — for students and pros.",
    image: "/images/yt-trends.png",
    duration: "24:02",
    category: "Learning",
    views: "76K",
  },
];

/* ----------------------------------------------------------------------------
 * MIMO — FULL BIO (About page)
 * ------------------------------------------------------------------------- */

export const MIMO_NUMBERS = [
  { value: 36, suffix: "", label: "Research Papers" },
  { value: 7, suffix: "", label: "Patents" },
  { value: 5000, suffix: "+", label: "Students" },
  { value: 65, suffix: "+", label: "Nationalities" },
  { value: 21, suffix: "", label: "Years Coding" },
  { value: 98, suffix: "th", label: "Percentile Teacher" },
] as const;

export const MIMO_EXPERTISE = [
  "Modern AI Tools",
  "App Development",
  "Backend Development",
  "DevOps",
  "Modern Technologies",
] as const;

export const MIMO_JOURNEY = [
  {
    year: "2004",
    title: "First lines of code",
    text: "The journey began over two decades ago — long before AI was a household word.",
  },
  {
    year: "2019",
    title: "Google Student Club",
    text: "Formal teaching journey began. Discovered the impact of peer-to-peer knowledge sharing and structured mentorship.",
  },
  {
    year: "Now",
    title: "Codingal — 2.3 years",
    text: "Ranked in the 98th percentile of teachers for two consecutive years.",
  },
  {
    year: "Total",
    title: "5,000+ students · 65+ nationalities",
    text: "Classrooms range from Grade 1 beginners to PhD-level researchers.",
  },
] as const;

export const MIMO_FULL_STORY = [
  "I wrote my first lines of code over two decades ago. Since then, the landscape of technology has shifted entirely, moving from static web pages to generative AI and autonomous systems. But one thing has remained constant: the need for clear, foundational thinking.",
  "Throughout my career, I've had the privilege of authoring 36 research papers and securing 7 patents. I've published books with McGraw-Hill and built scalable software. Yet, my greatest passion has always been in the classroom — breaking down complex, intimidating concepts into accessible, powerful mental models.",
  "Sariro was born from a simple realization: the traditional education system is struggling to keep pace with technological advancement. We don't just need people who know how to type syntax; we need problem solvers who understand how to leverage AI, analyze data, and build ethically.",
  "Whether I'm teaching a middle school student their first Python loop or guiding a seasoned professional through AI integration, the mission is the same. Teach thinking. Foster curiosity. Build the future.",
];

export const MIMO_PRINCIPLES = [
  {
    title: "Teach thinking, not syntax",
    text: "Syntax is Googleable. Mental models are not. We build the models first.",
  },
  {
    title: "Ship real things",
    text: "Every cohort ends with something you built — not a certificate, a project.",
  },
  {
    title: "Ethics is not a chapter",
    text: "Responsible AI is woven through every lesson, not bolted on at the end.",
  },
  {
    title: "Curiosity over coverage",
    text: "We'd rather go deep on one idea that fascinates you than skim ten.",
  },
];

/* ----------------------------------------------------------------------------
 * TESTIMONIALS
 * ------------------------------------------------------------------------- */

export const TESTIMONIALS = [
  {
    quote:
      "Sariro doesn't just teach syntax. They taught my son how to approach problems like an engineer.",
    name: "David M.",
    role: "Parent",
  },
  {
    quote:
      "The AI Literacy course completely changed my perspective on where the industry is heading. Invaluable.",
    name: "Sarah Jenkins",
    role: "Product Manager",
  },
  {
    quote:
      "We brought Sariro in for a school workshop and the student engagement was off the charts.",
    name: "Principal Thomas",
    role: "Oakridge Academy",
  },
  {
    quote:
      "Mimo breaks down intimidating concepts into mental models that actually stick. Rare teacher.",
    name: "Aisha R.",
    role: "CS Undergrad",
  },
  {
    quote:
      "I went from AI-curious to shipping automations at work in 6 weeks. The cohort momentum is real.",
    name: "Marcus L.",
    role: "Operations Lead",
  },
  {
    quote:
      "Our teachers left the workshop empowered, not overwhelmed. That's the magic of Sariro.",
    name: "Dr. Lena F.",
    role: "Curriculum Director",
  },
] as const;

/* ----------------------------------------------------------------------------
 * FOOTER
 * ------------------------------------------------------------------------- */

export const FOOTER_LINKS: { label: string; view: RouteId }[] = [
  { label: "About Mimo", view: "about" },
  { label: "Our Courses", view: "courses" },
  { label: "For Schools", view: "schools" },
  { label: "Events", view: "events" },
  { label: "Pricing", view: "pricing" },
  { label: "Free Resources", view: "resources" },
  { label: "YouTube", view: "youtube" },
  { label: "FAQ", view: "faq" },
  { label: "Careers", view: "careers" },
];

export const FOOTER_CONTACTS = [
  { label: "Media & Collab", value: "mimo@sariro.com", type: "media" },
  { label: "Courses & Students", value: "courses@sariro.com", type: "courses" },
  { label: "Schools & Institutions", value: "schools@sariro.com", type: "schools" },
] as const;

/* ----------------------------------------------------------------------------
 * EVENTS
 * ------------------------------------------------------------------------- */

export interface SariroEvent {
  id: string;
  title: string;
  type: "Cohort" | "Webinar" | "Hackathon" | "Workshop";
  date: string;
  time: string;
  format: "Online" | "In-person" | "Hybrid";
  location: string;
  description: string;
  capacity: string;
  price: string;
  status: "open" | "filling" | "waitlist";
  accent: "blue" | "green";
}

export const EVENTS: SariroEvent[] = [
  {
    id: "ai-literacy-jan",
    title: "AI Literacy Fundamentals — Jan 2026 Cohort",
    type: "Cohort",
    date: "Jan 12, 2026",
    time: "Mon & Wed, 7:00 PM PKT",
    format: "Online",
    location: "Live, interactive",
    description: "4-week cohort. Understand what AI is, what it isn't, and how to use it ethically. Ends with a shipped project.",
    capacity: "30 seats",
    price: "$149",
    status: "filling",
    accent: "blue",
  },
  {
    id: "ai-trends-webinar",
    title: "AI Trends 2026 — Free Live Webinar",
    type: "Webinar",
    date: "Jan 05, 2026",
    time: "8:00 PM PKT · 60 min",
    format: "Online",
    location: "YouTube Live",
    description: "Where the industry is heading — and exactly what to learn now. Live Q&A with Mimo.",
    capacity: "Unlimited",
    price: "Free",
    status: "open",
    accent: "green",
  },
  {
    id: "school-hackathon-spring",
    title: "Spring AI Hackathon for Schools",
    type: "Hackathon",
    date: "Feb 14–15, 2026",
    time: "48 hours",
    format: "Hybrid",
    location: "Online + Karachi",
    description: "Schools across the region send teams to build real AI prototypes over a weekend. Mentors, prizes, showcase.",
    capacity: "120 students",
    price: "$25/student",
    status: "open",
    accent: "blue",
  },
  {
    id: "llms-feb",
    title: "Building with LLMs — Feb 2026 Cohort",
    type: "Cohort",
    date: "Feb 02, 2026",
    time: "Tue & Thu, 8:00 PM PKT",
    format: "Online",
    location: "Live, interactive",
    description: "6 weeks. Go from API key to shipping a production-grade AI feature — RAG, agents, evaluation, cost control.",
    capacity: "25 seats",
    price: "$349",
    status: "open",
    accent: "blue",
  },
  {
    id: "python-thinkers-jan",
    title: "Python for Thinkers — Jan 2026 Cohort",
    type: "Cohort",
    date: "Jan 19, 2026",
    time: "Sat, 11:00 AM PKT",
    format: "Online",
    location: "Live, interactive",
    description: "8 weeks. Your first programming language — taught through problem-solving, not memorization. For students.",
    capacity: "30 seats",
    price: "$199",
    status: "filling",
    accent: "green",
  },
  {
    id: "educators-workshop",
    title: "AI for Educators — Free Workshop",
    type: "Workshop",
    date: "Jan 22, 2026",
    time: "4:00 PM PKT · 90 min",
    format: "Online",
    location: "Zoom",
    description: "Bring AI into your classroom — confidently and ethically. Lesson planning, assessment, and age-appropriate activities.",
    capacity: "100 teachers",
    price: "Free",
    status: "open",
    accent: "green",
  },
];

/* ----------------------------------------------------------------------------
 * PRICING
 * ------------------------------------------------------------------------- */

export interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  audience: string;
  features: string[];
  cta: string;
  accent: "blue" | "green";
  popular?: boolean;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Dip your toes into AI literacy.",
    price: "$149",
    period: "per cohort",
    audience: "Beginners · All ages",
    features: [
      "4-week AI Literacy Fundamentals cohort",
      "6 live modules + recordings",
      "Capstone project",
      "Community access",
      "Certificate of completion",
    ],
    cta: "Join Starter",
    accent: "blue",
  },
  {
    id: "builder",
    name: "Builder",
    tagline: "Ship real AI projects.",
    price: "$349",
    period: "per cohort",
    audience: "Intermediate · Professionals",
    features: [
      "Building with LLMs cohort (6 weeks)",
      "8 modules + live office hours",
      "RAG, agents, evaluation labs",
      "1:1 mentor sessions (x2)",
      "Deployed capstone + portfolio review",
      "Lifetime alumni community",
    ],
    cta: "Join Builder",
    accent: "green",
    popular: true,
  },
  {
    id: "school-pro",
    name: "School Pro",
    tagline: "Transform a whole school.",
    price: "Custom",
    period: "per year",
    audience: "K-12 schools",
    features: [
      "Full AI lab setup",
      "Curriculum design + 30+ lesson plans",
      "4 immersive workshops",
      "School-wide hackathon",
      "Teacher certification program",
      "Dedicated success manager",
      "Annual impact report",
    ],
    cta: "Request quote",
    accent: "blue",
  },
];

export interface PricingComparison {
  feature: string;
  starter: boolean | string;
  builder: boolean | string;
  school: boolean | string;
}

export const PRICING_COMPARISON: PricingComparison[] = [
  { feature: "Cohort access", starter: "4 weeks", builder: "6 weeks", school: "Full year" },
  { feature: "Live modules", starter: true, builder: true, school: true },
  { feature: "Recordings", starter: true, builder: true, school: true },
  { feature: "Capstone project", starter: true, builder: true, school: true },
  { feature: "1:1 mentor sessions", starter: false, builder: "2 sessions", school: "Unlimited" },
  { feature: "Deployed project", starter: false, builder: true, school: true },
  { feature: "Alumni community", starter: "1 year", builder: "Lifetime", school: "Lifetime" },
  { feature: "Teacher training", starter: false, builder: false, school: true },
  { feature: "Curriculum license", starter: false, builder: false, school: true },
  { feature: "Dedicated success manager", starter: false, builder: false, school: true },
];

/* ----------------------------------------------------------------------------
 * FAQ
 * ------------------------------------------------------------------------- */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "q1",
    category: "Courses",
    question: "Do I need to know how to code before joining?",
    answer: "No. Our AI Literacy Fundamentals and AI for Educators courses require zero coding. We teach thinking first — coding is the language we use later, when you're ready.",
  },
  {
    id: "q2",
    category: "Courses",
    question: "How are cohorts different from self-paced courses?",
    answer: "Cohorts run on a fixed schedule with live sessions, peer accountability, and mentor feedback. You learn alongside a group, ship a real project, and graduate together. It's why our completion rates are 4x higher than typical online courses.",
  },
  {
    id: "q3",
    category: "Courses",
    question: "What if I miss a live session?",
    answer: "Every session is recorded and posted within 24 hours. You also get a community forum to ask questions between sessions, and office hours for 1:1 help.",
  },
  {
    id: "q4",
    category: "Pricing",
    question: "Is there a money-back guarantee?",
    answer: "Yes. Every paid cohort comes with a 14-day, no-questions-asked money-back guarantee. If it's not for you, we refund 100%.",
  },
  {
    id: "q5",
    category: "Pricing",
    question: "Do you offer scholarships or financial aid?",
    answer: "We reserve 10% of every cohort for scholarships, prioritizing students from underrepresented backgrounds and regions. Email courses@sariro.com with a short note about your situation.",
  },
  {
    id: "q6",
    category: "Schools",
    question: "Can Sariro come to our school in person?",
    answer: "Yes. Our Immersive Workshop and AI Hackathon packages are available on-site (travel permitting) or virtually. For multi-day engagements we travel anywhere in the region. Email schools@sariro.com.",
  },
  {
    id: "q7",
    category: "Schools",
    question: "Do you align with national curriculum standards?",
    answer: "Yes. Our curriculum consultation maps AI literacy to your existing standards (Cambridge, IB, national frameworks). You receive a scope-and-sequence document that fits your school's structure.",
  },
  {
    id: "q8",
    category: "Access",
    question: "What ages do you teach?",
    answer: "Grades 1 through PhD. Our Computational Thinking tracks are split by grade (6–8, 9–12), and our professional cohorts welcome adults at any career stage.",
  },
  {
    id: "q9",
    category: "Access",
    question: "Is the content available in languages other than English?",
    answer: "Live cohorts are in English. We're piloting subtitled recordings and select cohorts in Urdu and Arabic in 2026 — join the newsletter to be notified.",
  },
  {
    id: "q10",
    category: "Certificates",
    question: "Do I get a certificate?",
    answer: "Yes — every cohort graduate receives a verified certificate of completion. Our Builder and School Pro tiers also include a portfolio review that's far more valuable to employers than the certificate itself.",
  },
];

/* ----------------------------------------------------------------------------
 * CAREERS
 * ------------------------------------------------------------------------- */

export interface Job {
  id: string;
  title: string;
  team: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract";
  description: string;
  responsibilities: string[];
  requirements: string[];
  accent: "blue" | "green";
}

export const JOBS: Job[] = [
  {
    id: "ai-instructor",
    title: "AI Cohort Instructor",
    team: "Education",
    location: "Remote (PKT timezone ±4h)",
    type: "Contract",
    description: "Lead live cohort sessions for our AI Literacy and Building with LLMs courses. Teach thinking, not syntax.",
    responsibilities: [
      "Deliver 2 live sessions per week per cohort",
      "Grade capstone projects with meaningful feedback",
      "Hold weekly office hours",
      "Iterate on curriculum based on student outcomes",
    ],
    requirements: [
      "3+ years building with AI/ML in production",
      "Demonstrated teaching or mentorship experience",
      "Excellent live communication in English",
      "Empathy for beginners and experts alike",
    ],
    accent: "blue",
  },
  {
    id: "curriculum-designer",
    title: "Curriculum Designer — K-12",
    team: "Schools",
    location: "Remote (global)",
    type: "Full-time",
    description: "Design AI literacy curriculum that fits real schools. Turn research into lessons teachers can actually run.",
    responsibilities: [
      "Design lesson plans for grades 6–12",
      "Pilot and iterate with partner schools",
      "Create assessment rubrics and activities",
      "Collaborate with Mimo on pedagogy",
    ],
    requirements: [
      "Experience teaching K-12 STEM or CS",
      "Curriculum design portfolio",
      "Familiarity with AI/ML concepts",
      "Detail-obsessed and kid-empathetic",
    ],
    accent: "green",
  },
  {
    id: "fullstack-engineer",
    title: "Full-stack Engineer",
    team: "Product",
    location: "Remote (global)",
    type: "Full-time",
    description: "Build the platform that runs our cohorts — enrollments, live classrooms, progress tracking, and AI tooling.",
    responsibilities: [
      "Ship features across the Next.js + Prisma stack",
      "Build real-time classroom tools",
      "Integrate AI APIs for student tooling",
      "Own quality end-to-end",
    ],
    requirements: [
      "4+ years full-stack with React/Next.js",
      "Production database experience",
      "Comfort with AI integration (LLMs, RAG)",
      "Bias toward shipping",
    ],
    accent: "blue",
  },
  {
    id: "community-manager",
    title: "Community Manager",
    team: "Growth",
    location: "Remote (PKT timezone)",
    type: "Part-time",
    description: "Be the heartbeat of the Sariro alumni community. Run events, surface wins, and keep momentum high between cohorts.",
    responsibilities: [
      "Run weekly community rituals",
      "Moderate forums and channels",
      "Organize alumni showcases",
      "Collect and share student wins",
    ],
    requirements: [
      "Community management experience",
      "Genuine love for people",
      "Organized and self-directed",
    ],
    accent: "green",
  },
];

export const CAREERS_PERKS = [
  { title: "Teach the future", text: "Your work directly shapes how thousands learn AI." },
  { title: "Remote-first", text: "Work from anywhere, on a schedule that respects your life." },
  { title: "Learn on the job", text: "Free seats in every cohort + research access." },
  { title: "Real ownership", text: "Small team, big problems, real autonomy." },
];

/* ----------------------------------------------------------------------------
 * BLOG
 * ------------------------------------------------------------------------- */

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  accent: "blue" | "green";
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "teach-thinking",
    title: "Why I Teach Thinking, Not Coding",
    excerpt: "The philosophy behind Sariro — and why syntax is the easy part.",
    category: "Philosophy",
    date: "Dec 2025",
    readTime: "6 min",
    author: "Mimo Patra",
    accent: "blue",
  },
  {
    id: "prompt-patterns-2026",
    title: "5 Prompt Patterns That Actually Work in 2026",
    excerpt: "Battle-tested prompting strategies from real cohort projects.",
    category: "Practical AI",
    date: "Nov 2025",
    readTime: "8 min",
    author: "Mimo Patra",
    accent: "green",
  },
  {
    id: "kids-and-ai",
    title: "How to Talk to Kids About AI (Without Scaring Them)",
    excerpt: "A parent's guide to honest, hopeful AI conversations.",
    category: "For Parents",
    date: "Oct 2025",
    readTime: "5 min",
    author: "Mimo Patra",
    accent: "blue",
  },
  {
    id: "cohort-effect",
    title: "The Cohort Effect: Why Learning Together Beats Learning Alone",
    excerpt: "The learning science behind our cohort model.",
    category: "Learning",
    date: "Sep 2025",
    readTime: "7 min",
    author: "Mimo Patra",
    accent: "green",
  },
  {
    id: "rag-explained",
    title: "RAG Explained Without the Jargon",
    excerpt: "Retrieval-augmented generation, in plain English — with a live demo.",
    category: "Build Along",
    date: "Aug 2025",
    readTime: "10 min",
    author: "Mimo Patra",
    accent: "blue",
  },
  {
    id: "ai-ethics-hard-questions",
    title: "The AI Ethics Question Nobody Asks",
    excerpt: "When should you NOT use AI? A framework for hard decisions.",
    category: "AI Ethics",
    date: "Jul 2025",
    readTime: "6 min",
    author: "Mimo Patra",
    accent: "green",
  },
];
