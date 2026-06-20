// ============================================================================
//  Sariro chatbot — the "brain"
//  ----------------------------------------------------------------------------
//  This is a plain file of question + answer pairs. NO LLM. NO database.
//  To teach the bot a new question: add an entry below.
//  To make it recognise a new phrasing: add a variant.
//
//  How matching works (see match.ts):
//    1. The user's message is normalised (lowercase, strip punctuation).
//    2. Each entry is scored against it:
//         - exact variant match  → very strong
//         - canonical contains   → strong
//         - keyword overlap      → medium
//         - fuzzy similarity     → light
//    3. The highest-scoring entry above the threshold wins → its `answer`
//       is sent back. Below threshold → friendly fallback.
// ============================================================================

export interface QALink {
  label: string;
  route: string; // e.g. "/courses", "/pricing"
}

export interface QAEntry {
  id: string;
  category: "Courses" | "Pricing" | "Schools" | "Events" | "About" | "Access" | "Certificates" | "Contact" | "Careers" | "Philosophy" | "Greeting";
  canonical: string; // the "official" phrasing
  variants: string[]; // other ways users ask
  keywords: string[]; // boost words
  answer: string; // YOUR pre-written reply
  links?: QALink[]; // quick-reply chips shown under the answer
}

export const QA_ENTRIES: QAEntry[] = [
  // ── GREETINGS ──────────────────────────────────────────────────────────────
  {
    id: "greeting-hi",
    category: "Greeting",
    canonical: "hi",
    variants: ["hello", "hey", "yo", "hi there", "hey there", "salam", "assalam", "good morning", "good evening", "good afternoon"],
    keywords: ["hi", "hello", "hey"],
    answer: "Hey! 👋 I'm the Sariro assistant. Ask me about courses, pricing, schools, events, or anything else about the platform. No pressure at all — what's on your mind?",
    links: [
      { label: "Browse courses", route: "/courses" },
      { label: "See pricing", route: "/pricing" },
    ],
  },
  {
    id: "greeting-thanks",
    category: "Greeting",
    canonical: "thank you",
    variants: ["thanks", "thx", "ty", "thank u", "appreciate it", "cheers"],
    keywords: ["thanks", "thank"],
    answer: "Anytime! 😊 Anything else I can help with — courses, pricing, schools? Just ask.",
  },
  {
    id: "greeting-bye",
    category: "Greeting",
    canonical: "bye",
    variants: ["goodbye", "see ya", "later", "cya", "gtg", "im done"],
    keywords: ["bye", "goodbye"],
    answer: "See you soon! 👋 Hope to welcome you into a Sariro cohort. Have a great day!",
  },
  {
    id: "greeting-who-are-you",
    category: "Greeting",
    canonical: "who are you",
    variants: ["what are you", "are you a bot", "are you human", "what can you do", "help me", "what do you do"],
    keywords: ["who", "bot", "human", "assistant"],
    answer: "I'm the Sariro assistant — a friendly little bot that answers questions about our AI courses, pricing, school programs, events, and more. I'm not a human, but I know the platform inside out. What would you like to know? 🙂",
  },

  // ── PLATFORM OVERVIEW (most common first questions) ─────────────────────────
  {
    id: "platform-what-is",
    category: "Greeting",
    canonical: "what is this platform",
    variants: [
      "what is sariro", "what is this site", "what is this", "what is this website",
      "tell me about sariro", "about sariro", "what is sariro about", "what do you do",
      "what is this platform about", "explain sariro", "what exactly is sariro",
      "what is this all about", "what are you guys", "what does sariro do",
      "tell me about this platform", "what is this thing",
    ],
    keywords: ["what", "platform", "sariro", "site", "website", "about"],
    answer: "Sariro is an AI & technology education platform 🎓 — we teach students, schools, and professionals how to thrive in an AI-driven future.\n\nOur thing: we teach THINKING, not just coding. Syntax is Googleable — mental models aren't.\n\n• 8 cohort-based courses (AI Literacy → Building with LLMs)\n• School workshops, hackathons & curriculum design\n• Free YouTube, blog & downloads\n• Taught by Mimo Patra (21 yrs coding, 36 papers, 7 patents, 5,000+ students)\n\nWant me to point you to the right starting point?",
    links: [
      { label: "Browse courses", route: "/courses" },
      { label: "About Mimo", route: "/about" },
    ],
  },
  {
    id: "platform-who-is-it-for",
    category: "Greeting",
    canonical: "who is this for",
    variants: [
      "who can join", "who is sariro for", "is this for me", "who is it for",
      "is this for students", "is this for professionals", "is this for kids",
      "am i eligible", "can anyone join", "who can take these courses",
    ],
    keywords: ["who", "for", "eligible", "anyone", "join", "me"],
    answer: "Sariro is for everyone curious about AI 👥:\n\n👧 Students (Grades 1 → PhD) — computational thinking & AI literacy tracks\n🏫 Schools — workshops, hackathons, curriculum design\n💼 Professionals — upskill with practical AI (no coding needed to start)\n\nWhoever you are, there's a path for you. Tell me which group you're in and I'll recommend the right starting point!",
    links: [{ label: "See all tracks", route: "/courses" }],
  },
  {
    id: "platform-how-it-works",
    category: "Greeting",
    canonical: "how does it work",
    variants: [
      "how do cohorts work", "how does sariro work", "how does it work",
      "whats the format", "how do the courses work", "how does learning work here",
      "how do i learn", "what is the format",
    ],
    keywords: ["how", "work", "format", "cohort"],
    answer: "Here's how Sariro works ⚙️:\n\n1️⃣ Pick a course (or ask me to recommend one)\n2️⃣ Join a cohort — runs on a fixed schedule with a group of peers\n3️⃣ Attend 2 live sessions/week (recorded if you miss one)\n4️⃣ Get mentor feedback + community support between sessions\n5️⃣ Finish with a REAL shipped project (not just a certificate)\n\nCohorts beat self-paced because of momentum + accountability + mentorship. Our completion rate is 4x higher than typical online courses.",
    links: [{ label: "See how to start", route: "/courses" }],
  },
  {
    id: "platform-why-sariro",
    category: "Philosophy",
    canonical: "why should i choose sariro",
    variants: [
      "why sariro", "what makes you different", "why you", "why this",
      "how are you different", "what makes sariro special", "why not coursera",
      "why not udemy", "why not youtube", "why pay for this", "what sets you apart",
    ],
    keywords: ["why", "different", "special", "apart", "choose", "vs", "coursera", "udemy"],
    answer: "What makes Sariro different 💪:\n\n• Cohort-based + live + mentor-led (not lonely pre-recorded videos)\n• We teach THINKING first — coding is the easy part\n• Every cohort ends with a SHIPPED project, not a PDF certificate\n• Real instructor: Mimo (21 yrs coding, 36 papers, 7 patents)\n• Ethics woven through every lesson, not bolted on\n• Small cohorts → real mentorship\n• 4x higher completion rate than typical online courses\n\nFree YouTube is great for dabbling. Sariro is for actually becoming someone who builds with AI.",
    links: [{ label: "Read our philosophy", route: "/about" }],
  },
  {
    id: "platform-is-legit",
    category: "Greeting",
    canonical: "is sariro legit",
    variants: [
      "is this a scam", "is it real", "is it trustworthy", "is this legit",
      "can i trust this", "is sariro legit", "is this genuine", "is it safe",
      "are you legit", "is this fake",
    ],
    keywords: ["legit", "scam", "trust", "real", "genuine", "safe", "fake"],
    answer: "Totally fair to ask 🤝. Yes, Sariro is real:\n\n• Featured by McGraw-Hill, Google Student Club, Codingal\n• Mimo has published 36 research papers + 7 patents\n• 5,000+ students taught across 65+ nationalities\n• 98th percentile teacher 2 years running\n• 14-day money-back guarantee on every paid cohort\n\nWe'd rather you try a free webinar first (no card needed) than take our word for it. Want the link?",
    links: [{ label: "See free events", route: "/events" }],
  },
  {
    id: "platform-how-to-join",
    category: "Greeting",
    canonical: "how do i sign up",
    variants: [
      "how do i join", "how do i enroll", "how do i register", "how to join",
      "how to sign up", "how to enroll", "how do i get started", "how do i start",
      "how can i join", "sign up", "register me", "enroll me",
    ],
    keywords: ["sign up", "join", "enroll", "register", "start", "how"],
    answer: "Joining is easy ✨:\n\n1. Browse courses on /courses\n2. Click the course you want → \"Reserve my seat\"\n3. Enter your email + secure checkout (Stripe)\n4. Get instant access instructions + cohort calendar\n\nNot sure which course? Hit \"Book a free 15-min consult\" on /courses and we'll guide you. Or tell me your background here and I'll point you to the right one!",
    links: [{ label: "Browse courses", route: "/courses" }],
  },
  {
    id: "platform-what-included",
    category: "Greeting",
    canonical: "what is included",
    variants: [
      "what do i get", "whats included", "what comes with it", "what is in the course",
      "what do i get for my money", "whats in it", "what is covered",
    ],
    keywords: ["included", "get", "covered", "come", "money"],
    answer: "Every paid cohort includes 📦:\n\n• Live sessions (2/week, recorded)\n• Module-by-module curriculum\n• Community forum + peer accountability\n• Mentor feedback on your work\n• Office hours for 1:1 help\n• Capstone project (you build + ship something real)\n• Verified certificate of completion\n• Builder tier adds: 1:1 mentor sessions, deployed project, lifetime alumni\n\nCheck /pricing for the full feature-by-feature breakdown.",
    links: [{ label: "Compare what's included", route: "/pricing" }],
  },
  {
    id: "platform-time-commitment",
    category: "Access",
    canonical: "what is the time commitment",
    variants: [
      "how much time", "time commitment", "how many hours", "hours per week",
      "how much time do i need", "is it full time", "can i do it with a job",
      "fit around work", "time required",
    ],
    keywords: ["time", "hours", "commitment", "week", "fit", "work"],
    answer: "Most learners spend 4–6 hours/week ⏰:\n\n• 2 live sessions × ~90 min = 3 hrs\n• 1–2 hrs on exercises + project work\n\nYou can absolutely do it with a full-time job — most of our professional students do. Sessions are recorded, so if you miss one you catch up on your own time. Cohorts are designed for busy adults, not full-time students.",
  },
  {
    id: "platform-1on1",
    category: "Greeting",
    canonical: "do you offer 1 on 1 mentorship",
    variants: [
      "personal mentor", "1 on 1", "1on1", "one on one", "private tutoring",
      "individual sessions", "personal coaching", "private lessons", "dedicated mentor",
    ],
    keywords: ["1 on 1", "1on1", "personal", "private", "individual", "tutoring", "coaching"],
    answer: "Yes! 🎯\n\n• Every cohort includes office hours (group Q&A with mentors)\n• Builder tier adds 2 dedicated 1:1 mentor sessions\n• Builder also includes a portfolio review\n\nFor fully private 1-on-1 tutoring (outside a cohort), email courses@sariro.com — we occasionally take on private students based on Mimo's availability.",
    links: [{ label: "Email courses@sariro.com", route: "mailto:courses@sariro.com" }],
  },
  {
    id: "platform-community",
    category: "Greeting",
    canonical: "is there a community",
    variants: [
      "do you have a community", "alumni network", "discord", "slack", "forum",
      "where do students talk", "is there a group", "community access",
    ],
    keywords: ["community", "alumni", "discord", "slack", "forum", "group", "network"],
    answer: "Yes! 💬 Every cohort gets:\n\n• Private cohort forum (chat with your peers + mentors between sessions)\n• Alumni community after you finish\n• Builder + School Pro → LIFETIME alumni access\n\nThe cohort community is honestly half the value — you learn as much from peers as from instructors. That's why our completion rate is 4x higher than self-paced courses.",
  },
  {
    id: "platform-after-finish",
    category: "Certificates",
    canonical: "what happens after i finish",
    variants: [
      "after the course", "what next", "after i graduate", "what happens after",
      "do i keep access", "after completion", "post course",
    ],
    keywords: ["after", "finish", "next", "graduate", "completion", "post"],
    answer: "After you finish a cohort 🎓:\n\n• Keep access to all recordings + materials (1 year on Starter, lifetime on Builder)\n• Join the alumni community (networking, referrals, job leads)\n• Get your verified certificate\n• Builder tier: portfolio review to prep for job hunts\n• Many alumni jump into the next course (e.g. AI Literacy → Building with LLMs)\n\nYou're never \"done\" — you graduate into a community.",
  },
  {
    id: "platform-demo-trial",
    category: "Greeting",
    canonical: "can i try it first",
    variants: [
      "free trial", "demo", "try before i buy", "sample", "can i try",
      "is there a trial", "test it out", "preview", "free sample",
    ],
    keywords: ["try", "trial", "demo", "sample", "preview", "test"],
    answer: "Yes! 3 ways to try before you buy 🎁:\n\n1. Free live webinars (next: AI Trends 2026, Jan 05) — meet Mimo, see the teaching style\n2. Free YouTube channel — 9+ deep-dive videos, no signup\n3. 14-day money-back guarantee on any paid cohort — full refund if it's not for you\n\nNo card needed for options 1 & 2. Want the webinar link?",
    links: [
      { label: "Free events", route: "/events" },
      { label: "Watch YouTube", route: "/youtube" },
    ],
  },

  // ── COURSES ────────────────────────────────────────────────────────────────
  {
    id: "course-list",
    category: "Courses",
    canonical: "what courses do you have",
    variants: ["what do you teach", "list of courses", "show me courses", "what courses", "which courses", "courses available", "what can i learn"],
    keywords: ["courses", "teach", "learn", "list"],
    answer: "We've got 8 cohort-based courses 🎓:\n\n• AI Literacy Fundamentals (Beginner, 4w)\n• Python for Thinkers (Beginner, 8w)\n• Building with LLMs (Intermediate, 6w)\n• AI for Educators (Beginner, 3w)\n• Computational Thinking · Grades 6–8 (10w)\n• Computational Thinking · Grades 9–12 (12w)\n• DevOps & Modern AI Deployment (Advanced, 5w)\n• Research Methods in AI (Advanced, 6w)\n\nEach one is cohort-based, mentor-led, and ends with a real project. Want details on any of them?",
    links: [{ label: "Browse all courses", route: "/courses" }],
  },
  {
    id: "course-where-start",
    category: "Courses",
    canonical: "where should i start",
    variants: ["which course should i take", "where do i begin", "im new", "best course for me", "what should i learn first", "recommend a course", "im a beginner"],
    keywords: ["start", "begin", "beginner", "recommend", "first", "new"],
    answer: "Great question! Here's the simple path:\n\n👶 Total beginner → AI Literacy Fundamentals (no coding needed, 4 weeks)\n🐍 Want to learn coding → Python for Thinkers (8 weeks)\n🤖 Already build stuff → Building with LLMs (6 weeks)\n\nNot sure? Tell me your background and I'll point you to the right one. 🙂",
    links: [{ label: "See all courses", route: "/courses" }],
  },
  {
    id: "course-no-coding-needed",
    category: "Courses",
    canonical: "do i need to know coding first",
    variants: ["do i need coding experience", "i dont know how to code", "no coding background", "is coding required", "can i join without coding", "zero coding"],
    keywords: ["coding", "code", "experience", "required", "background", "programming"],
    answer: "Nope, not at all! 🙅 Our AI Literacy Fundamentals and AI for Educators courses need zero coding. We teach thinking first — coding is the language we use later, when you're ready. You're in safe hands.",
    links: [{ label: "See beginner courses", route: "/courses" }],
  },
  {
    id: "course-ai-literacy",
    category: "Courses",
    canonical: "tell me about ai literacy",
    variants: ["what is ai literacy", "ai literacy course", "fundamentals course", "beginner ai course", "intro to ai"],
    keywords: ["ai literacy", "fundamentals", "beginner", "intro"],
    answer: "AI Literacy Fundamentals is our flagship beginner course 🧠:\n\n• Level: Beginner (no coding)\n• Duration: 4 weeks, 6 live modules\n• Price: $149\n• Next cohort: Jan 12, 2026\n\nYou'll learn how machines learn (without the math), how to prompt like a pro, spot bias & hallucinations, build your first AI workflow, and ship a real AI-powered tool. Ends with a capstone project.",
    links: [{ label: "Reserve my seat", route: "/courses" }],
  },
  {
    id: "course-llms",
    category: "Courses",
    canonical: "tell me about the llm course",
    variants: ["building with llms", "llm course", "rag course", "ship ai features", "advanced ai course", "llm bootcamp"],
    keywords: ["llm", "rag", "agents", "deploy", "feature", "api"],
    answer: "Building with LLMs is for intermediate builders 🚀:\n\n• Level: Intermediate (some coding)\n• Duration: 6 weeks, 8 modules\n• Price: $349\n• Next cohort: Feb 02, 2026\n\nSyllabus: LLM anatomy, prompt engineering at scale, RAG, function calling & agents, streaming/latency, evaluation & guardrails, cost optimization, and a deployed capstone. You'll ship a real production AI feature.",
    links: [{ label: "Reserve my seat", route: "/courses" }],
  },
  {
    id: "course-python",
    category: "Courses",
    canonical: "do you teach python",
    variants: ["python course", "learn python", "python for thinkers", "coding for beginners", "first programming language"],
    keywords: ["python", "coding", "programming", "loop"],
    answer: "Yes! 🐍 Python for Thinkers is our beginner coding course — 8 weeks, 10 modules, $199. We teach Python through problem-solving, not memorization. You'll write real code from scratch, build mini-projects (calculator, quiz game, to-do app), and finish with a capstone tool you actually use. Next cohort: Jan 19, 2026.",
    links: [{ label: "See course", route: "/courses" }],
  },
  {
    id: "course-duration",
    category: "Courses",
    canonical: "how long is each course",
    variants: ["course length", "how many weeks", "duration", "time commitment", "how long do cohorts run"],
    keywords: ["long", "weeks", "duration", "length", "time"],
    answer: "Course lengths vary ⏱️:\n\n• 3 weeks → AI for Educators\n• 4 weeks → AI Literacy Fundamentals\n• 5 weeks → DevOps & AI Deployment\n• 6 weeks → Building with LLMs · Research Methods\n• 8 weeks → Python for Thinkers\n• 10 weeks → Computational Thinking (Grades 6–8)\n• 12 weeks → Computational Thinking (Grades 9–12)\n\nLive sessions are usually 2x per week, ~90 minutes each.",
  },
  {
    id: "course-live-or-recorded",
    category: "Courses",
    canonical: "is it live or recorded",
    variants: ["live sessions", "are classes live", "recorded videos", "self paced", "asynchronous", "do i have to attend live"],
    keywords: ["live", "recorded", "self", "paced", "asynchronous"],
    answer: "All cohorts are LIVE and mentor-led 🎥 — usually 2 sessions per week. But every session is recorded and posted within 24 hours, so if you miss one (or want to rewatch), you're covered. You also get a community forum + office hours for between-session help.",
  },
  {
    id: "course-miss-session",
    category: "Courses",
    canonical: "what if i miss a session",
    variants: ["miss a class", "cant attend live", "skip a session", "what if i miss", "missed session"],
    keywords: ["miss", "skip", "cant attend", "catch up"],
    answer: "No worries at all! 😊 Every live session is recorded and posted within 24 hours. You can watch it back anytime, ask questions in the community forum, and join the next office hours for 1:1 help. You won't fall behind.",
  },
  {
    id: "course-syllabus",
    category: "Courses",
    canonical: "what is the syllabus",
    variants: ["course outline", "what will i learn", "curriculum", "modules", "topics covered", "what do you cover"],
    keywords: ["syllabus", "outline", "curriculum", "modules", "topics"],
    answer: "Each course has a detailed syllabus on its course page 📚. Tell me which course you're eyeing (AI Literacy, Python, LLMs, etc.) and I'll give you the module-by-module breakdown. Or hit the button below to see them all.",
    links: [{ label: "Browse courses", route: "/courses" }],
  },
  {
    id: "course-capstone",
    category: "Courses",
    canonical: "what is the capstone",
    variants: ["final project", "capstone project", "what will i build", "do i build something", "portfolio project"],
    keywords: ["capstone", "project", "build", "portfolio"],
    answer: "Every cohort ends with a capstone — a REAL project you build and ship 🚀. Not a certificate, an actual thing:\n\n• AI Literacy → an AI-powered tool you use\n• Python → a useful app (calculator, game, to-do)\n• LLMs → a deployed AI feature in production\n• Research Methods → a publishable paper draft\n\nThis is what makes Sariro different. You leave with something you made, not just a PDF.",
  },
  {
    id: "course-kids",
    category: "Courses",
    canonical: "do you have courses for kids",
    variants: ["courses for children", "kids course", "for my child", "grade 6", "grade 9", "high school", "middle school"],
    keywords: ["kids", "children", "child", "grade", "school", "high", "middle"],
    answer: "Yes! 👧👦 We have two tracks for young learners:\n\n• Computational Thinking · Grades 6–8 (10 weeks, $179) — block-to-text coding, logic puzzles, build a chatbot\n• Computational Thinking · Grades 9–12 (12 weeks, $229) — algorithms, Python, ML basics, college-ready portfolio\n\nBoth are cohort-based, mentor-led, and age-appropriate. Parents love them.",
    links: [{ label: "See student courses", route: "/courses" }],
  },

  // ── PRICING ────────────────────────────────────────────────────────────────
  {
    id: "pricing-cost",
    category: "Pricing",
    canonical: "how much does it cost",
    variants: ["price", "pricing", "how much", "cost", "fees", "how much money", "what do you charge"],
    keywords: ["price", "cost", "how much", "fees", "pricing", "charge", "$"],
    answer: "Prices range from free to $399 💰:\n\n• Free → weekly webinars, YouTube, blog, downloads\n• $129 → AI for Educators\n• $149 → AI Literacy Fundamentals (Starter tier)\n• $179–$229 → Computational Thinking (kids)\n• $199 → Python for Thinkers\n• $299 → Research Methods in AI\n• $349 → Building with LLMs (Builder tier)\n• $399 → DevOps & AI Deployment\n• Custom → School Pro (full lab setup)\n\nEvery paid cohort has a 14-day money-back guarantee.",
    links: [{ label: "See full pricing", route: "/pricing" }],
  },
  {
    id: "pricing-free",
    category: "Pricing",
    canonical: "is anything free",
    variants: ["free courses", "free stuff", "do you have free content", "free trial", "anything free", "free webinar"],
    keywords: ["free", "trial"],
    answer: "Yes, plenty! 🎁\n\n• Free live webinars (next one: AI Trends 2026, Jan 05)\n• Free YouTube videos (9+ deep-dives)\n• Free blog posts & downloadable cheatsheets\n• Free educator workshop (Jan 22)\n\nAnd every paid cohort has a 14-day money-back guarantee — so you can try risk-free.",
    links: [
      { label: "Watch YouTube", route: "/youtube" },
      { label: "Free resources", route: "/resources" },
    ],
  },
  {
    id: "pricing-refund",
    category: "Pricing",
    canonical: "what is your refund policy",
    variants: ["money back", "can i get a refund", "refund", "guarantee", "i want my money back", "cancel and refund", "refund window"],
    keywords: ["refund", "money back", "guarantee", "cancel", "reimburse"],
    answer: "Every paid cohort comes with a 14-day, no-questions-asked money-back guarantee 🛡️. If it's not for you in the first 2 weeks, we refund 100%. Just reply to your confirmation email. No drama.",
  },
  {
    id: "pricing-scholarship",
    category: "Pricing",
    canonical: "do you offer scholarships",
    variants: ["financial aid", "scholarship", "i cant afford", "discount", "need help paying", "free seat", "aid"],
    keywords: ["scholarship", "financial", "aid", "discount", "afford", "free seat"],
    answer: "Yes! 💜 We reserve 10% of every cohort for scholarships, prioritizing students from underrepresented backgrounds and regions. Email courses@sariro.com with a short note about your situation — we read every one.",
    links: [{ label: "Email courses@sariro.com", route: "mailto:courses@sariro.com" }],
  },
  {
    id: "pricing-tiers",
    category: "Pricing",
    canonical: "what are the pricing tiers",
    variants: ["starter vs builder", "which tier", "pricing plans", "subscription", "tiers", "plans"],
    keywords: ["tier", "plan", "starter", "builder", "school pro", "subscription"],
    answer: "We have 3 tiers 📊:\n\n🟦 Starter ($149) — AI Literacy cohort, 4 weeks, cert + community\n🟩 Builder ($349, most popular) — LLMs cohort, 6 weeks, 1:1 mentors, deployed project, lifetime alumni\n🟦 School Pro (custom) — full AI lab, curriculum, teacher training, year-long\n\nCheck the comparison table on /pricing for every feature side by side.",
    links: [{ label: "Compare tiers", route: "/pricing" }],
  },
  {
    id: "pricing-installments",
    category: "Pricing",
    canonical: "can i pay in installments",
    variants: ["payment plan", "installments", "pay monthly", "split payment", "pay in parts"],
    keywords: ["installment", "plan", "monthly", "split", "parts"],
    answer: "We don't have a formal installment plan yet, but we're flexible. Email courses@sariro.com explaining what you need and we'll figure something out. No judgment, ever.",
    links: [{ label: "Email courses@sariro.com", route: "mailto:courses@sariro.com" }],
  },

  // ── SCHOOLS ────────────────────────────────────────────────────────────────
  {
    id: "schools-workshops",
    category: "Schools",
    canonical: "do you do school workshops",
    variants: ["school program", "bring sariro to school", "for schools", "school partnership", "workshop at school"],
    keywords: ["school", "workshop", "partnership", "k-12", "k12"],
    answer: "Absolutely! 🏫 We have 4 school packages:\n\n• Immersive Workshop — 1 day, from $1,200, up to 60 students\n• AI Hackathon — weekend, from $3,500, up to 120 students (most popular)\n• Curriculum Consultation — 1 semester, custom\n• Full AI Lab Setup — full academic year, custom\n\nAll available on-site (travel permitting) or virtual. Tell me about your school and I'll point you to the right fit.",
    links: [{ label: "See school packages", route: "/schools" }],
  },
  {
    id: "schools-cost",
    category: "Schools",
    canonical: "how much is a school workshop",
    variants: ["school pricing", "workshop cost", "how much for schools", "school fees"],
    keywords: ["school", "workshop", "cost", "price"],
    answer: "School packages 💰:\n\n• Immersive Workshop — from $1,200 (1 day, up to 60 students)\n• AI Hackathon — from $3,500 (weekend, up to 120 students)\n• Curriculum Consultation — custom (1 semester)\n• Full AI Lab Setup — custom (full year, school-wide)\n\nUse the inquiry form on /schools for a tailored quote — we reply within 2 business days.",
    links: [{ label: "Request a quote", route: "/schools" }],
  },
  {
    id: "schools-in-person",
    category: "Schools",
    canonical: "can you come to our school in person",
    variants: ["on site", "in person workshop", "come to us", "travel to school", "visit our school"],
    keywords: ["in person", "on site", "travel", "visit", "come"],
    answer: "Yes! ✈️ Our Workshop and Hackathon packages are available on-site (travel permitting within the region) or fully virtual. For multi-day engagements we travel anywhere. Email schools@sariro.com with your location and we'll confirm.",
    links: [{ label: "Email schools@sariro.com", route: "mailto:schools@sariro.com" }],
  },
  {
    id: "schools-curriculum",
    category: "Schools",
    canonical: "can you design our curriculum",
    variants: ["curriculum consultation", "ai curriculum", "lesson plans for school", "align with standards", "school curriculum"],
    keywords: ["curriculum", "lesson", "standards", "align", "design"],
    answer: "Yes — that's our Curriculum Consultation package 📐. Over 1 semester we co-design an AI literacy strand that fits YOUR school's structure:\n\n• Curriculum audit & gap analysis\n• Custom scope & sequence (mapped to Cambridge/IB/national standards)\n• 30+ lesson plans\n• Teacher training sessions\n• Assessment rubrics\n• Quarterly review\n\nEmail schools@sariro.com to start the conversation.",
    links: [{ label: "See school packages", route: "/schools" }],
  },

  // ── EVENTS ─────────────────────────────────────────────────────────────────
  {
    id: "events-next",
    category: "Events",
    canonical: "when is the next cohort",
    variants: ["next event", "upcoming cohort", "when does it start", "next start date", "when can i join"],
    keywords: ["next", "cohort", "start", "date", "upcoming", "when"],
    answer: "Upcoming cohorts & events 📅:\n\n• Jan 05 — AI Trends 2026 (FREE webinar)\n• Jan 12 — AI Literacy Fundamentals cohort\n• Jan 19 — Python for Thinkers cohort\n• Jan 22 — AI for Educators (FREE workshop)\n• Feb 02 — Building with LLMs cohort\n• Feb 14–15 — Spring AI Hackathon (schools)\n\nAll times are PKT (Asia/Karachi). Recordings provided for everything.",
    links: [{ label: "See all events", route: "/events" }],
  },
  {
    id: "events-free-webinar",
    category: "Events",
    canonical: "is there a free webinar",
    variants: ["free webinar", "free live session", "free class", "try before i buy"],
    keywords: ["free", "webinar", "live"],
    answer: "Yes! 🎉 Our next free webinar is **AI Trends 2026** on January 05, 8:00 PM PKT (60 min, live on YouTube). Mimo breaks down where the industry is heading + live Q&A. Unlimited seats, totally free. There's also a free AI for Educators workshop on Jan 22.",
    links: [{ label: "Register for events", route: "/events" }],
  },
  {
    id: "events-timezone",
    category: "Events",
    canonical: "what time zone",
    variants: ["timezone", "what time", "pkt", "est", "pst", "gmt", "my time zone"],
    keywords: ["timezone", "time zone", "pkt", "est", "pst", "gmt"],
    answer: "All live sessions are scheduled in PKT (Asia/Karachi time) 🌏. But don't worry — every session is recorded, so you can watch on your own time no matter where you are. We have students across 65+ countries. If you tell me your country I can help you convert the time.",
  },

  // ── ABOUT MIMO ─────────────────────────────────────────────────────────────
  {
    id: "about-mimo",
    category: "About",
    canonical: "who is mimo",
    variants: ["who is the teacher", "who is the instructor", "tell me about mimo", "mimo patra", "who teaches"],
    keywords: ["mimo", "teacher", "instructor", "patra"],
    answer: "Mimo Patra is the educator behind Sariro 👨‍🏫:\n\n• 21 years coding experience\n• 36 research papers published\n• 7 technology patents granted\n• Books published with McGraw-Hill\n• 5,000+ students taught across 65+ nationalities\n• 98th percentile teacher (2 consecutive years) at Codingal\n• Started teaching at Google Student Club in 2019\n\nHis philosophy: \"I don't teach coding. I teach thinking. Coding is just the language we use.\"",
    links: [{ label: "Read Mimo's full story", route: "/about" }],
  },
  {
    id: "about-qualifications",
    category: "About",
    canonical: "what are mimos qualifications",
    variants: ["is mimo qualified", "mimo credentials", "credentials", "is he a real teacher", "experience"],
    keywords: ["qualified", "credentials", "experience", "background"],
    answer: "Mimo's track record 📜:\n\n• 21 years of coding (since 2004)\n• 36 research papers in international journals\n• 7 granted technology patents\n• Books published with McGraw-Hill\n• 98th percentile teacher 2 years running (Codingal)\n• 5,000+ students, 65+ nationalities\n• Formal teaching since 2019 (Google Student Club)\n\nNot just an instructor — a practitioner. Full bibliography available on request.",
    links: [{ label: "About Mimo", route: "/about" }],
  },
  {
    id: "about-research",
    category: "About",
    canonical: "can i see mimos research",
    variants: ["research papers", "publications", "patents", "bibliography", "academic work"],
    keywords: ["research", "papers", "publications", "patents", "bibliography"],
    answer: "Yes! 📚 We have a free resources page with selected papers and patents. Topics include neural network optimization, edge AI, AI literacy frameworks, bias detection in LLMs, and more. A full bibliography (all 36 papers + 7 patents) is available on request for academic review.",
    links: [
      { label: "Browse resources", route: "/resources" },
      { label: "Email mimo@sariro.com", route: "mailto:mimo@sariro.com" },
    ],
  },

  // ── ACCESS & LOGISTICS ─────────────────────────────────────────────────────
  {
    id: "access-any-country",
    category: "Access",
    canonical: "can i join from any country",
    variants: ["any country", "international", "join from abroad", "where are you based", "location"],
    keywords: ["country", "international", "abroad", "location", "based"],
    answer: "Yes! 🌍 We have students across 65+ nationalities. All cohorts are online, so you can join from anywhere with an internet connection. Live sessions are in PKT time but always recorded. You're welcome wherever you are.",
  },
  {
    id: "access-english",
    category: "Access",
    canonical: "is it english only",
    variants: ["other languages", "urdu", "arabic", "subtitles", "language"],
    keywords: ["english", "language", "urdu", "arabic", "subtitles"],
    answer: "Live cohorts are in English 🗣️. We're piloting subtitled recordings and select cohorts in Urdu and Arabic in 2026 — join the newsletter (scroll to the community section on the home page) to be notified when they launch.",
  },
  {
    id: "access-computer",
    category: "Access",
    canonical: "do i need a special computer",
    variants: ["system requirements", "what laptop", "computer specs", "do i need a pc", "device"],
    keywords: ["computer", "laptop", "specs", "requirements", "device"],
    answer: "Nope! 💻 Any laptop with a modern browser (Chrome, Firefox, Safari, Edge) works. No installs needed for most courses. For the LLMs and DevOps courses you'll use free cloud tools (we'll guide you). A stable internet connection is the main requirement.",
  },

  // ── CERTIFICATES & OUTCOMES ────────────────────────────────────────────────
  {
    id: "cert-yes",
    category: "Certificates",
    canonical: "do i get a certificate",
    variants: ["certificate", "certification", "will i get a cert", "diploma", "credential"],
    keywords: ["certificate", "cert", "certification", "diploma", "credential"],
    answer: "Yes! 🎓 Every cohort graduate receives a verified certificate of completion. Our Builder and School Pro tiers also include a portfolio review — which, honestly, is far more valuable to employers than the certificate itself.",
  },
  {
    id: "cert-job",
    category: "Certificates",
    canonical: "will this help me get a job",
    variants: ["job guarantee", "career", "employment", "will i get hired", "placements"],
    keywords: ["job", "career", "employment", "hired", "placement"],
    answer: "No program can honestly guarantee a job — and we won't pretend otherwise. 🤝 What we CAN do:\n\n• Builder tier includes a portfolio review (real shipped projects beat certs)\n• Lifetime alumni community with referrals\n• Real projects you can show in interviews\n• Mentorship from working professionals\n\nOur students have landed AI roles, freelanced, and leveled up at their jobs. Your effort + our structure = outcomes.",
  },

  // ── CONTACT ────────────────────────────────────────────────────────────────
  {
    id: "contact-email",
    category: "Contact",
    canonical: "how do i contact you",
    variants: ["contact", "email", "reach you", "phone number", "talk to someone", "get in touch"],
    keywords: ["contact", "email", "phone", "reach", "talk"],
    answer: "Here's how to reach us 📧:\n\n• Media & collab → mimo@sariro.com\n• Courses & students → courses@sariro.com\n• Schools & institutions → schools@sariro.com\n\nWe reply to every email within 2 business days. No bots on the other end — real humans. 🙂",
  },
  {
    id: "contact-call",
    category: "Contact",
    canonical: "can i book a call",
    variants: ["talk to a human", "call you", "phone call", "1 on 1", "consultation"],
    keywords: ["call", "phone", "human", "consultation", "1 on 1"],
    answer: "Yes! 📞 You can book a free 15-minute path consult — we'll help you pick the right course or school package. Just head to the courses page and click the CTA at the bottom, or email courses@sariro.com with a couple of time slots that work for you.",
    links: [{ label: "Go to courses", route: "/courses" }],
  },
  {
    id: "contact-reply-time",
    category: "Contact",
    canonical: "how fast do you reply",
    variants: ["response time", "when will you reply", "how long to reply", "reply time"],
    keywords: ["reply", "response", "fast", "time"],
    answer: "Within 2 business days, always ⏱️. Usually faster. We read every email — real humans, no auto-responders (except me, the little bot, but I only answer platform questions).",
  },

  // ── CAREERS ────────────────────────────────────────────────────────────────
  {
    id: "careers-hiring",
    category: "Careers",
    canonical: "are you hiring",
    variants: ["jobs", "careers", "work at sariro", "open positions", "job openings"],
    keywords: ["hiring", "jobs", "careers", "work", "positions"],
    answer: "Yes! 🤝 We currently have 4 open roles:\n\n• AI Cohort Instructor (Contract, remote)\n• Curriculum Designer — K-12 (Full-time, remote)\n• Full-stack Engineer (Full-time, remote)\n• Community Manager (Part-time, PKT)\n\nRemote-first, global. Click a role on /careers to see the full description + apply.",
    links: [{ label: "See open roles", route: "/careers" }],
  },

  // ── PHILOSOPHY ─────────────────────────────────────────────────────────────
  {
    id: "philosophy-thinking",
    category: "Philosophy",
    canonical: "what does teaching thinking mean",
    variants: ["teaching thinking", "thinking not coding", "your method", "teaching style", "philosophy"],
    keywords: ["thinking", "method", "philosophy", "style", "syntax"],
    answer: "Our core belief 🧠: syntax is Googleable — mental models are not. We teach the thinking first (decomposition, patterns, abstraction, algorithms), and coding becomes the easy part. Every lesson also weaves in AI ethics — not as a chapter, but as a habit. And every cohort ends with a shipped project, because making beats memorizing.",
    links: [{ label: "Read Mimo's principles", route: "/about" }],
  },

  // ── OUT OF SCOPE (caught by fallback, but a couple of explicit deflectors) ─
  {
    id: "oos-write-code",
    category: "Greeting",
    canonical: "write me code",
    variants: ["fix my code", "debug this", "write a function", "do my homework", "build me an app"],
    keywords: ["write", "fix", "debug", "homework"],
    answer: "I'm the Sariro assistant — I only help with questions about our courses, pricing, schools, events, and platform. I can't write or debug code for you. 🙏 But if you want to LEARN to write code, our Python for Thinkers course is a great start!",
    links: [{ label: "See Python course", route: "/courses" }],
  },
];

// The greeting message shown when the chat first opens.
export const CHAT_GREETING =
  "Hey buddy! 👋 Need help? Just ask — no pressure. I can tell you about courses, pricing, schools, events, or anything Sariro. What's on your mind?";

// Suggestion chips shown before the user's first message.
export const CHAT_STARTERS: { label: string; message: string }[] = [
  { label: "Where should I start?", message: "I'm new — where should I start?" },
  { label: "How much does it cost?", message: "How much does it cost?" },
  { label: "Do I need to know coding?", message: "Do I need to know coding first?" },
  { label: "When's the next cohort?", message: "When is the next cohort?" },
];
