# Sariro — AI & Technology Education

> Teaching the future. Empowering students, schools, and professionals with essential AI literacy and technology skills.

A modern, multi-page Next.js 16 website for **Sariro** — an AI education platform by educator **Mimo Patra**. Cohort-based AI courses, school workshops, free YouTube content, Google One Tap auth, admin panel, and a file-based FAQ chatbot.

---

## ✨ Features

- **11+ public pages** — `/`, `/courses`, `/schools`, `/events`, `/pricing`, `/resources`, `/youtube`, `/faq`, `/careers`, `/about`, `/blog`
- **5 support/legal pages** — `/support/privacy-policy`, `/disclaimer`, `/code-of-conduct`, `/refund-cancellation`, `/contact`
- **Google One Tap login** (Privacy First — only email + name requested)
- **Student dashboard** (`/dashboard`) + **Settings** (`/settings`)
- **Admin panel** (`/admin`) — 7 tabs: Overview, Users, Courses, Events, Pages/CMS, Inquiries, Chat Logs
- **FAQ chatbot** — floating widget, ~48 Q&A entries, no LLM, ~1ms responses
- **Cookie consent banner** — persists across navigation
- **Supabase backend** — Postgres + Auth + Row Level Security
- **8-year-old & grandpa accessible** — literal buttons, high contrast, tactile 3D buttons
- **AI-generated brand imagery**, SEO metadata per route, sticky footer, fully responsive

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16** (App Router) + **TypeScript 5** |
| Styling | **Tailwind CSS 4** + **shadcn/ui** |
| Fonts | Plus Jakarta Sans · Inter · Space Grotesk |
| Database + Auth | **Supabase** (Postgres + Auth + RLS) |
| Icons | Lucide React |
| Toasts | sonner |
| Chatbot | File-based (no LLM) |

---

## 🚀 Run it on your PC

### Prerequisites

1. **Node.js 20+** — [nodejs.org](https://nodejs.org/)
2. **A free Supabase project** — [supabase.com](https://supabase.com) → New Project

### Setup (5 steps)

```bash
# 1. Unzip & enter the project
unzip sariro.zip
cd sariro

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env        # Windows: copy .env.example .env
#   → Edit .env and add your 3 Supabase keys (from Supabase Dashboard → Settings → API)

# 4. Create the database tables
#   → Go to Supabase Dashboard → SQL Editor → New query
#   → Paste the contents of supabase/schema.sql → Run
#   → (Optional) Enable Google Auth: Authentication → Providers → Google
#     → Add your Google OAuth Client ID + Secret from Google Cloud Console
#     → Add https://your-project.supabase.co/auth/v1/callback to Google authorized redirect URIs

# 5. Start the dev server
npm run dev
```

Open **http://localhost:3000** in your browser. 🎉

### Build for production

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
sariro/
├── src/
│   ├── app/                    # Next.js App Router — one folder per route
│   │   ├── layout.tsx          # Root layout (Navbar + Footer + Chat + Cookie banner)
│   │   ├── page.tsx            # Home (/)
│   │   ├── courses/page.tsx    # /courses
│   │   ├── schools/page.tsx    # /schools
│   │   ├── events/page.tsx     # /events
│   │   ├── pricing/page.tsx    # /pricing
│   │   ├── resources/page.tsx  # /resources
│   │   ├── youtube/page.tsx    # /youtube
│   │   ├── faq/page.tsx        # /faq
│   │   ├── careers/page.tsx    # /careers
│   │   ├── about/page.tsx      # /about
│   │   ├── blog/page.tsx       # /blog
│   │   ├── login/page.tsx      # Google One Tap login
│   │   ├── auth/callback/      # OAuth callback handler
│   │   ├── dashboard/page.tsx  # Student dashboard (auth-guarded)
│   │   ├── settings/page.tsx   # Profile settings (auth-guarded)
│   │   ├── admin/page.tsx      # Admin panel (admin-only)
│   │   ├── support/[slug]/     # Dynamic route for 5 support pages
│   │   └── api/
│   │       ├── chat/route.ts       # Chatbot (no LLM, pure matching)
│   │       ├── newsletter/route.ts # Subscribe → Supabase
│   │       └── contact/route.ts    # Inquiries → Supabase
│   ├── components/
│   │   ├── ui/                 # 8 shadcn/ui primitives (accordion, button, dialog, input, label, sheet, sonner, tooltip)
│   │   └── sariro/
│   │       ├── navbar.tsx, footer.tsx, user-menu.tsx, cookie-consent.tsx
│   │       ├── sections/       # Home-page sections (hero, stats, etc.)
│   │       ├── views/          # One view per route
│   │       ├── ui-bits/        # Shared: page-hero, section-header, breadcrumb
│   │       ├── chat/           # Floating chatbot widget
│   │       └── admin/          # Admin panel + 7 tab components
│   ├── lib/
│   │   ├── data.ts             # ALL content (courses, events, pricing, FAQ, jobs...)
│   │   ├── support.ts          # 5 support pages content
│   │   ├── nav.ts              # Route registry + navigation hooks
│   │   ├── auth.ts             # Server auth (getCurrentUser)
│   │   ├── auth-client.ts      # Client auth (signInWithGoogle, signOut)
│   │   └── chat/{qa,match}.ts  # Chatbot brain + matching engine
│   └── db/
│       ├── supabase.ts         # Server client (uses next/headers)
│       └── supabase-browser.ts # Browser client (safe for "use client")
├── supabase/
│   └── schema.sql              # Database schema (run in Supabase SQL Editor)
├── public/images/              # AI-generated brand images
├── scripts/
│   └── scaffold-sariro.sh      # Generate a new page/route
├── middleware.ts               # Session refresh on every request
├── .env.example
├── package.json
└── README.md
```

---

## 🗄 Database (Supabase)

The app uses **Supabase** (Postgres in the cloud) — no local database files.

**Tables** (see `supabase/schema.sql`):
- `profiles` — users (id, email, display_name, **is_admin boolean**, avatar_initial)
- `subscribers` — newsletter signups
- `inquiries` — contact/school form submissions
- `chat_logs` — every chatbot turn (for KB improvement)
- `pages` — CMS table (support pages + blog, editable from admin)
- `courses`, `events`, `enrollments` — catalog + student progress

**Setup:** Run `supabase/schema.sql` in your Supabase SQL Editor once. It creates all tables + Row Level Security policies + auto-profile trigger (extracts display name from email) + seed data for the 5 support pages.

**Roles:** `is_admin` boolean — default `false`, manually flipped to `true` in the admin panel (Users tab) or directly in Supabase. Never auto-set by code.

---

## 🧩 Add a new page

```bash
bash scripts/scaffold-sariro.sh podcast "Podcast" green
```

Creates a real `/podcast` route (page + view + data file + navbar link) automatically.

---

## 🎨 Customization

| What | Where |
|---|---|
| Colors & fonts | `src/app/globals.css` (CSS variables at top) |
| All copy & content | `src/lib/data.ts` |
| Support page content | `src/lib/support.ts` |
| Routes / nav | `src/lib/nav.ts` |
| Chatbot knowledge | `src/lib/chat/qa.ts` |
| Brand images | `public/images/` |

### Color tokens
| Token | Hex | Use |
|---|---|---|
| `--brand-blue` | `#2563EB` | Primary CTAs |
| `--brand-green` | `#16A34A` | Success / social proof |
| `--foreground` | `#0F172A` | Text |
| `--background` | `#FFFFFF` | Page canvas |

---

## 📜 Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server on http://localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `bash scripts/scaffold-sariro.sh <id> "<Name>" [blue\|green]` | Generate a new page |

---

## ❓ Troubleshooting

**Supabase not configured warning on /login**
→ Add your 3 Supabase keys to `.env` (copy from `.env.example`), then restart `npm run dev`.

**Google login not working**
→ In Supabase: Authentication → Providers → Google → enable + add your Google OAuth Client ID/Secret (from Google Cloud Console). Add `https://your-project.supabase.co/auth/v1/callback` to Google's authorized redirect URIs.

**Port 3000 already in use**
→ Kill the other process or change the port in `package.json` (`next dev -p 3000` → `-p 3001`).

**Can't access /admin**
→ Only users with `is_admin = true` can access `/admin`. Sign in, then flip your `is_admin` to `true` in the Supabase dashboard (Table Editor → profiles → edit your row). Or have another admin promote you from the admin Users tab.

**Images not showing**
→ They're in `public/images/`. Make sure they unzipped correctly.

---

## 📄 License

This project is yours to use, modify, and deploy. The Sariro brand, Mimo Patra likeness, and all copy are demo content — replace them with your own before going live.

---

**Built with ❤️ for the future of AI education.**
