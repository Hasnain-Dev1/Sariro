-- ============================================================================
--  Sariro — Supabase Database Schema
--  ----------------------------------------------------------------------------
--  Run this in your Supabase Dashboard → SQL Editor → New query → Paste → Run
--
--  Creates all tables needed for: auth, profiles (with is_admin boolean),
--  newsletter subscribers, contact inquiries, chatbot logs, CMS pages
--  (support/blog editable from admin), courses, events, and enrollments.
--
--  Includes: auto-profile creation on signup, Row Level Security policies,
--  and seed data for the 5 support pages.
--
--  ⚠️  BEFORE RUNNING THIS:
--     For email/password login to work without email verification:
--     Supabase Dashboard → Authentication → Sign In / Providers → Email
--     → Turn OFF "Confirm email" (for development).
--     Turn it back ON when going to production.
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. PROFILES  (linked 1-to-1 with Supabase auth.users)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  email         text not null,
  display_name  text,
  is_admin      boolean not null default false,   -- ← manually flipped in Supabase
  avatar_initial text,
  created_at    timestamptz not null default now()
);

comment on column public.profiles.is_admin is
  'Admin flag. Default false. Manually flipped to true in Supabase dashboard by another admin. Never auto-set by code.';

-- Auto-create a profile row whenever a new user signs up (via Supabase Auth).
-- Extracts display_name from the email local-part: ali@eg.com → "Ali"
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  local_part text;
  clean_name text;
  initial text;
begin
  local_part := split_part(new.email, '@', 1);
  -- strip digits, dots, underscores, dashes → first word
  clean_name := regexp_replace(local_part, '[0-9._-]+', ' ', 'g');
  clean_name := split_part(trim(clean_name), ' ', 1);
  clean_name := initcap(clean_name);
  initial := upper(left(coalesce(nullif(clean_name, ''), 'X'), 1));

  insert into public.profiles (id, email, display_name, avatar_initial)
  values (new.id, new.email, clean_name, initial);

  return new;
end;
$$;

-- Drop existing trigger if re-running, then create fresh
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ────────────────────────────────────────────────────────────────────────────
-- 2. SUBSCRIBERS  (newsletter signups — migrated from SQLite)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  name        text,
  source      text default 'community',
  created_at  timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────────────────────
-- 3. INQUIRIES  (contact form + school inquiries — migrated from SQLite)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.inquiries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  type        text default 'general',   -- general | media | courses | schools
  message     text not null,
  status      text default 'new',        -- new | responded | closed
  created_at  timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────────────────────
-- 4. CHAT_LOGS  (every chatbot turn — for KB improvement)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.chat_logs (
  id          uuid primary key default gen_random_uuid(),
  session_id  text,
  message     text not null,
  matched_id  text,          -- which QA entry matched (null = fallback)
  score       integer,
  feedback    text,           -- thumbsup | thumbsdown | null
  created_at  timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────────────────────
-- 5. PAGES  (CMS — support pages, blog posts, editable from admin panel)
-- ────────────────────────────────────────────────────────────────────────────
-- This is the key table for Sir Mimo's vision: "content team publishes
-- directly, no dev team interference." Admin panel will CRUD these rows.
create table if not exists public.pages (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,     -- e.g. 'privacy-policy'
  title         text not null,
  category      text default 'Support',   -- Support | Blog | Legal | etc.
  excerpt       text,                      -- short description
  content       text,                      -- full content (markdown/plain text)
  last_updated  timestamptz not null default now(),
  published     boolean default true
);

-- ────────────────────────────────────────────────────────────────────────────
-- 6. COURSES  (editable from admin panel)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.courses (
  id               uuid primary key default gen_random_uuid(),
  course_id        text unique not null,   -- e.g. 'ai-literacy'
  title            text not null,
  tagline          text,
  level            text,                    -- Beginner | Intermediate | Advanced
  audience         text,                    -- Students | Schools | Professionals | All
  format           text,                    -- Cohort | Self-paced
  duration_weeks   integer,
  modules          integer,
  price            integer,
  next_cohort      text,
  featured         boolean default false,
  syllabus         jsonb,                   -- array of strings
  outcomes         jsonb,                   -- array of strings
  created_at       timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────────────────────
-- 7. EVENTS  (editable from admin panel)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.events (
  id           uuid primary key default gen_random_uuid(),
  event_id     text unique not null,
  title        text not null,
  type         text,                        -- Cohort | Webinar | Hackathon | Workshop
  date         text,
  time         text,
  format       text,                        -- Online | In-person | Hybrid
  location     text,
  description  text,
  capacity     text,
  price        text,
  status       text,                        -- open | filling | waitlist
  created_at   timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────────────────────
-- 8. ENROLLMENTS  (student ↔ course link, with progress)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.enrollments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles (id) on delete cascade,
  course_id   text,                          -- references courses.course_id
  progress    integer default 0,             -- 0..100
  status      text default 'active',         -- active | completed | dropped
  created_at  timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) — who can read/write what
-- ============================================================================
-- Principle: public can read published content + submit forms.
-- Logged-in users can read/update their own data.
-- Admins (is_admin = true) can do everything.

alter table public.profiles    enable row level security;
alter table public.subscribers enable row level security;
alter table public.inquiries   enable row level security;
alter table public.chat_logs   enable row level security;
alter table public.pages       enable row level security;
alter table public.courses     enable row level security;
alter table public.events      enable row level security;
alter table public.enrollments enable row level security;

-- Helper: check if current user is admin
create or replace function public.is_current_user_admin()
returns boolean
language sql
security definer set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- PROFILES
drop policy if exists "profiles_read_own_or_admin" on public.profiles;
create policy "profiles_read_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_current_user_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles_admin_update_all" on public.profiles;
create policy "profiles_admin_update_all" on public.profiles
  for update using (public.is_current_user_admin());

-- SUBSCRIBERS (anyone can subscribe; admins can read)
drop policy if exists "subscribers_insert_anyone" on public.subscribers;
create policy "subscribers_insert_anyone" on public.subscribers
  for insert with check (true);

drop policy if exists "subscribers_read_admin" on public.subscribers;
create policy "subscribers_read_admin" on public.subscribers
  for select using (public.is_current_user_admin());

-- INQUIRIES (anyone can submit; admins can read/update)
drop policy if exists "inquiries_insert_anyone" on public.inquiries;
create policy "inquiries_insert_anyone" on public.inquiries
  for insert with check (true);

drop policy if exists "inquiries_read_admin" on public.inquiries;
create policy "inquiries_read_admin" on public.inquiries
  for select using (public.is_current_user_admin());

drop policy if exists "inquiries_update_admin" on public.inquiries;
create policy "inquiries_update_admin" on public.inquiries
  for update using (public.is_current_user_admin());

-- CHAT_LOGS (anyone can log; admins can read)
drop policy if exists "chat_logs_insert_anyone" on public.chat_logs;
create policy "chat_logs_insert_anyone" on public.chat_logs
  for insert with check (true);

drop policy if exists "chat_logs_read_admin" on public.chat_logs;
create policy "chat_logs_read_admin" on public.chat_logs
  for select using (public.is_current_user_admin());

-- PAGES (public reads published; admins write all)
drop policy if exists "pages_read_published" on public.pages;
create policy "pages_read_published" on public.pages
  for select using (published = true or public.is_current_user_admin());

drop policy if exists "pages_admin_all" on public.pages;
create policy "pages_admin_all" on public.pages
  for all using (public.is_current_user_admin()) with check (public.is_current_user_admin());

-- COURSES (public reads; admins write)
drop policy if exists "courses_read_public" on public.courses;
create policy "courses_read_public" on public.courses
  for select using (true);

drop policy if exists "courses_admin_all" on public.courses;
create policy "courses_admin_all" on public.courses
  for all using (public.is_current_user_admin()) with check (public.is_current_user_admin());

-- EVENTS (public reads; admins write)
drop policy if exists "events_read_public" on public.events;
create policy "events_read_public" on public.events
  for select using (true);

drop policy if exists "events_admin_all" on public.events;
create policy "events_admin_all" on public.events
  for all using (public.is_current_user_admin()) with check (public.is_current_user_admin());

-- ENROLLMENTS (users see own; admins see all; users insert own)
drop policy if exists "enrollments_read_own_or_admin" on public.enrollments;
create policy "enrollments_read_own_or_admin" on public.enrollments
  for select using (auth.uid() = user_id or public.is_current_user_admin());

drop policy if exists "enrollments_insert_own" on public.enrollments;
create policy "enrollments_insert_own" on public.enrollments
  for insert with check (auth.uid() = user_id);

drop policy if exists "enrollments_update_own_or_admin" on public.enrollments;
create policy "enrollments_update_own_or_admin" on public.enrollments
  for update using (auth.uid() = user_id or public.is_current_user_admin());

-- ============================================================================
-- SEED DATA — the 5 support pages (with real default content)
-- ============================================================================
-- Admins can edit these later from the admin panel. Content team publishes
-- directly — no dev team needed.

insert into public.pages (slug, title, category, excerpt, content) values
(
  'privacy-policy',
  'Privacy Policy',
  'Support',
  'How Sariro collects, uses, and protects your data.',
  'Last updated: June 2026

Sariro ("we", "us", "our") operates the Sariro education platform at sariro.com ("the Platform"). This Privacy Policy explains how we collect, use, and protect your information when you use our Platform.

1. Information We Collect
- Account information: email address and password (managed securely by Supabase Auth)
- Profile information: display name (auto-derived from your email), which you can edit
- Communication data: messages you send via contact forms, school inquiries, or the chatbot
- Usage data: pages visited, courses enrolled in, progress (used to improve the Platform)
- Cookie consent data: your accept/reject choice (stored in localStorage + a cookie)

2. How We Use Your Information
- To provide and manage your account and enrollments
- To process payments and issue certificates
- To send you cohort updates, recordings, and support communications
- To improve our courses, chatbot knowledge base, and Platform features
- To respond to your inquiries and provide customer support

3. What We Do NOT Do
- We do not sell your personal data to third parties
- We do not use your data for unrelated advertising
- We do not store payment card details (processed by Stripe)
- We do not share your data except where required by law

4. Data Security
- Passwords are hashed by Supabase Auth (we never see them)
- The Platform uses HTTPS encryption
- Row Level Security policies protect user data in the database
- Access to personal data is restricted to authorized administrators

5. Your Rights
- Access: you can request a copy of your data
- Correction: you can edit your profile or email us to fix inaccuracies
- Deletion: you can request account deletion at any time
- Withdraw consent: you can clear cookies or change consent in your browser

6. Cookies
We use essential cookies to operate the Platform and optional analytics cookies (only with your consent). See our cookie consent banner for details.

7. Contact
For privacy questions, email mimo@sariro.com. We respond within 2 business days.'
),
(
  'disclaimer',
  'Disclaimer',
  'Support',
  'Important notices about the information provided on Sariro.',
  'Last updated: June 2026

The information provided by Sariro on sariro.com is for general educational purposes only. By using the Platform, you accept this disclaimer in full.

1. Educational Content
All courses, materials, videos, and resources on the Platform are provided for educational purposes. While we strive for accuracy, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information.

2. No Guarantees of Outcomes
Sariro courses are designed to build skills and understanding. However, we do not guarantee specific outcomes including (but not limited to):
- Employment or job placement
- Specific salary increases
- Certification of professional competency recognized by third parties
- Success in passing external examinations

Your results depend on your effort, application, and circumstances.

3. AI Tools & Technology
Courses may teach the use of AI tools (including large language models). These tools can produce inaccurate, biased, or harmful outputs. Sariro is not responsible for the outputs of third-party AI tools or how you apply them.

4. External Links
The Platform may contain links to external websites. We have no control over the nature, content, and availability of those sites. Inclusion of any links does not necessarily imply endorsement.

5. Course Availability
We reserve the right to modify, suspend, or discontinue any course, cohort, or feature at any time. Cohort schedules and pricing are subject to change.

6. Intellectual Property
All course content, videos, materials, and resources are the intellectual property of Sariro and Mimo Patra. Unauthorized recording, distribution, or reproduction is strictly prohibited. Violations may be pursued legally.

7. No Professional Advice
Content on the Platform does not constitute professional advice (medical, legal, financial, or otherwise). Always seek the advice of a qualified professional for such matters.

8. Contact
Questions about this disclaimer? Email mimo@sariro.com.'
),
(
  'code-of-conduct',
  'Code of Conduct',
  'Support',
  'The standards we expect from every member of the Sariro community.',
  'Last updated: June 2026

Sariro is committed to providing a respectful, inclusive, and safe learning environment for everyone — students, educators, administrators, and partners. By participating in our cohorts, community, or Platform, you agree to this Code of Conduct.

1. Our Values
- Teach thinking, not just syntax
- Foster curiosity over coverage
- Ethics is not a chapter — it is a habit
- Ship real things, not certificates

2. Expected Behavior
- Be respectful and kind in all interactions
- Embrace diverse perspectives and backgrounds (we serve 65+ nationalities)
- Give constructive, helpful feedback
- Ask questions — there are no "dumb" questions
- Respect others'' privacy and intellectual property
- Credit others'' work and ideas

3. Unacceptable Behavior
- Harassment, discrimination, or hate speech of any kind
- Personal attacks, trolling, or bullying
- Sharing others'' personal information without consent
- Recording or distributing cohort sessions without permission
- Plagiarism or passing off others'' work as your own
- Disrupting sessions, forums, or community spaces
- Any conduct that could be considered inappropriate in a professional/educational setting

4. Consequences
Violations may result in:
- A warning from moderators
- Temporary removal from community spaces
- Permanent removal from the cohort without refund
- Account termination
- Legal action in cases of intellectual property theft or harassment

5. Reporting
To report a violation, email mimo@sariro.com with details. All reports are confidential. We investigate every report and take appropriate action.

6. Scope
This Code applies to all Sariro spaces: live sessions, recorded content comments, community forums, direct messages between participants, and any Platform interactions.

7. Amendments
We may update this Code as our community grows. Significant changes will be communicated to active participants.

8. Contact
Questions? Email mimo@sariro.com. We reply within 2 business days.'
),
(
  'refund-cancellation',
  'Refund & Cancellation Policy',
  'Support',
  'Our 14-day money-back guarantee and cancellation terms.',
  'Last updated: June 2026

We want you to learn with confidence. This policy explains our refund and cancellation terms for Sariro cohorts.

1. 14-Day Money-Back Guarantee
Every paid cohort comes with a 14-day, no-questions-asked money-back guarantee.
- The 14-day window starts from the cohort''s first live session
- Request a refund by replying to your confirmation email or emailing courses@sariro.com
- Refunds are processed to the original payment method within 5-7 business days
- No reasons or justification required

2. After the 14-Day Window
- Refunds are generally not available after 14 days from the cohort start
- Exception: if we cancel a cohort, you receive a full refund regardless of timing
- Exception: medical or family emergencies — contact us and we will work with you

3. Cancellation by You
- You can cancel your enrollment before the cohort starts for a full refund
- To cancel, email courses@sariro.com with your registered email
- Cancellations within the 14-day window = full refund (same as money-back guarantee)

4. Cancellation by Sariro
- If we cancel a cohort before it starts: full refund
- If we cancel a cohort mid-way: pro-rated refund for remaining sessions
- We reserve the right to cancel cohorts with insufficient enrollment (rare)

5. School & Institutional Bookings
- Custom packages have their own cancellation terms in the booking agreement
- Standard: cancellations 30+ days before = full refund; 14-30 days = 50%; <14 days = non-refundable
- Contact schools@sariro.com for school-specific terms

6. Non-Refundable Items
- Certificates of completion (issued only when earned)
- Downloadable resources already accessed
- Custom consultations already delivered

7. How to Request a Refund
1. Email courses@sariro.com (or schools@sariro.com for school bookings)
2. Include your registered email and cohort name
3. We confirm within 1 business day
4. Refund processed within 5-7 business days to original payment method

8. Scholarship Seats
Scholarship recipients who withdraw forfeit the seat (it goes to another applicant). No cash value.

9. Contact
Refund questions? Email courses@sariro.com. We reply within 2 business days.'
),
(
  'contact',
  'Contact Us',
  'Support',
  'How to reach the Sariro team.',
  'Last updated: June 2026

We are real humans and we read every message. Here is how to reach us.

1. By Email (fastest)
- Media & collaborations: mimo@sariro.com
- Courses & student support: courses@sariro.com
- Schools & institutions: schools@sariro.com
- General inquiries: hello@sariro.com

2. Response Time
- We reply to every email within 2 business days (usually faster)
- Business days: Monday to Friday, 9 AM - 6 PM PKT (Asia/Karachi)
- Urgent issues (payment failures, access problems) get priority

3. For Students
- Course access issues → email courses@sariro.com
- Technical problems → include screenshots and your browser/OS
- Cohort schedule questions → check /events first, then email
- Certificate issues → include your full name and cohort name

4. For Schools
- Workshop/hackathon inquiries → use the form on /schools
- Curriculum consultation → email schools@sariro.com
- We travel anywhere in the region for multi-day engagements

5. For Media & Press
- Interview requests → mimo@sariro.com
- Press kit available on request
- Mimo is available for keynotes, panels, and expert commentary on AI education

6. For Careers
- Open roles: /careers
- General career inquiries: mimo@sariro.com

7. Office Hours
- Live chat support via the chat bubble (bottom-right) — for platform questions only
- The chatbot answers instantly; humans reply via email

8. Mailing Address
Sariro is a remote-first team. For legal correspondence, email mimo@sariro.com for our registered address.

9. Connect
- YouTube: /youtube
- Twitter/X: @sariro
- LinkedIn: /company/sariro

We look forward to hearing from you!'
)
on conflict (slug) do nothing;

-- ============================================================================
-- DONE. Verify with:
--   select slug, title, category from pages;       -- should show 5 rows
--   select email, is_admin from profiles;          -- empty until users sign up
-- ============================================================================
