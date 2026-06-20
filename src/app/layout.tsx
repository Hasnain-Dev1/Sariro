import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/sariro/navbar";
import { Footer } from "@/components/sariro/footer";
import { ChatWidget } from "@/components/sariro/chat/chat-widget";
import { CookieConsent } from "@/components/sariro/cookie-consent";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sariro — Teaching the Future | AI & Technology Education",
  description:
    "Sariro prepares students, schools, and professionals for an AI-driven future. Cohort-based AI courses, school workshops, and free resources by educator Mimo Patra. 5000+ students across 65+ nationalities.",
  keywords: [
    "Sariro",
    "AI education",
    "AI courses",
    "cohort based learning",
    "Mimo Patra",
    "AI literacy",
    "coding for kids",
    "AI for schools",
    "AI for professionals",
  ],
  authors: [{ name: "Mimo Patra" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Sariro — Teaching the Future",
    description:
      "Preparing students, schools, and professionals for an AI-driven future. We teach thinking and problem-solving, not just coding.",
    siteName: "Sariro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sariro — Teaching the Future",
    description:
      "AI & technology education for students, schools, and professionals.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-background text-foreground`}
      >
        <div className="flex min-h-screen flex-col bg-background">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <ChatWidget />
        <CookieConsent />
        <SonnerToaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
