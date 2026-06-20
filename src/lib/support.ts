// ============================================================================
//  Sariro — Support pages data
//  ----------------------------------------------------------------------------
//  Single source of truth for the 5 support/legal pages. Used by:
//    - the navbar "Support" dropdown (reads SUPPORT_PAGES for links)
//    - the /support/[slug] route (reads the matching entry for content)
//    - the cookie banner (links to /support/privacy-policy)
//
//  When the admin panel is built, this data will also live in the Supabase
//  `pages` table (see supabase/schema.sql). The route will read from Supabase
//  first and fall back to this file. For now, this file IS the content.
// ============================================================================

import type { RouteId } from "./nav";

export interface SupportPage {
  slug: string;
  title: string;
  category: "Support";
  excerpt: string;
  icon: "ShieldCheck" | "AlertCircle" | "ScrollText" | "RotateCcw" | "Mail";
  lastUpdated: string;
  content: string; // plain text with \n\n separators; the page renders <pre>-style
}

export const SUPPORT_PAGES: SupportPage[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    category: "Support",
    excerpt: "How Sariro collects, uses, and protects your data.",
    icon: "ShieldCheck",
    lastUpdated: "June 2026",
    content: `Last updated: June 2026

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
For privacy questions, email mimo@sariro.com. We respond within 2 business days.`,
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    category: "Support",
    excerpt: "Important notices about the information provided on Sariro.",
    icon: "AlertCircle",
    lastUpdated: "June 2026",
    content: `Last updated: June 2026

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
Questions about this disclaimer? Email mimo@sariro.com.`,
  },
  {
    slug: "code-of-conduct",
    title: "Code of Conduct",
    category: "Support",
    excerpt: "The standards we expect from every member of the Sariro community.",
    icon: "ScrollText",
    lastUpdated: "June 2026",
    content: `Last updated: June 2026

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
- Respect others' privacy and intellectual property
- Credit others' work and ideas

3. Unacceptable Behavior
- Harassment, discrimination, or hate speech of any kind
- Personal attacks, trolling, or bullying
- Sharing others' personal information without consent
- Recording or distributing cohort sessions without permission
- Plagiarism or passing off others' work as your own
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
Questions? Email mimo@sariro.com. We reply within 2 business days.`,
  },
  {
    slug: "refund-cancellation",
    title: "Refund & Cancellation Policy",
    category: "Support",
    excerpt: "Our 14-day money-back guarantee and cancellation terms.",
    icon: "RotateCcw",
    lastUpdated: "June 2026",
    content: `Last updated: June 2026

We want you to learn with confidence. This policy explains our refund and cancellation terms for Sariro cohorts.

1. 14-Day Money-Back Guarantee
Every paid cohort comes with a 14-day, no-questions-asked money-back guarantee.
- The 14-day window starts from the cohort's first live session
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
Refund questions? Email courses@sariro.com. We reply within 2 business days.`,
  },
  {
    slug: "contact",
    title: "Contact Us",
    category: "Support",
    excerpt: "How to reach the Sariro team.",
    icon: "Mail",
    lastUpdated: "June 2026",
    content: `Last updated: June 2026

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

We look forward to hearing from you!`,
  },
];

// Quick lookup helper for the dynamic route
export function getSupportPage(slug: string): SupportPage | undefined {
  return SUPPORT_PAGES.find((p) => p.slug === slug);
}

// Related pages (for the sidebar on each support page) — all except current
export function getRelatedPages(currentSlug: string): SupportPage[] {
  return SUPPORT_PAGES.filter((p) => p.slug !== currentSlug);
}

// Icon component name → lucide import mapping (used by navbar + pages)
export const SUPPORT_ICON_MAP = {
  ShieldCheck: "ShieldCheck",
  AlertCircle: "AlertCircle",
  ScrollText: "ScrollText",
  RotateCcw: "RotateCcw",
  Mail: "Mail",
} as const;

// Export the route paths for the navbar dropdown (data-driven)
export const SUPPORT_NAV: { label: string; href: string; icon: string }[] =
  SUPPORT_PAGES.map((p) => ({
    label: p.title,
    href: `/support/${p.slug}`,
    icon: p.icon,
  }));

// Add Support to the nav system (so it can be referenced as a route id)
export const SUPPORT_ROUTE_ID = "support" as const;
export type SupportRouteId = typeof SUPPORT_ROUTE_ID;
