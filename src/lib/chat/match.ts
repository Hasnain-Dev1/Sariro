// ============================================================================
//  Sariro chatbot — matching engine (NO LLM, pure string scoring)
//  ----------------------------------------------------------------------------
//  Pipeline:
//    1. normalize(message)  → lowercase, strip punctuation, collapse spaces
//    2. score every QAEntry against the normalized message
//    3. pick the highest score → return its answer (or a fallback)
// ============================================================================

import { QA_ENTRIES, type QAEntry } from "./qa";

// ── 1. Normalize ────────────────────────────────────────────────────────────

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "am", "i", "you", "we", "they", "he", "she",
  "do", "does", "did", "can", "could", "would", "should", "will", "shall",
  "my", "your", "our", "their", "his", "her", "its", "me", "us", "them",
  "to", "for", "of", "in", "on", "at", "by", "with", "from", "and", "or",
  "but", "if", "then", "so", "as", "it", "this", "that", "these", "those",
  "what", "which", "who", "whom", "whose", "where", "when", "why", "how",
  "have", "has", "had", "be", "been", "being", "was", "were", "about",
  "into", "out", "up", "down", "over", "under", "again", "just", "also",
  "there", "here", "any", "some", "all", "no", "not", "yes", "ok", "okay",
  "please", "pls", "plz", "hey", "hi", "hello", "thanks", "thank",
]);

export function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s@.]/g, " ") // keep word chars, spaces, @, . (for emails)
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(normalized: string): string[] {
  return normalized
    .split(" ")
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

// ── 2. Fuzzy similarity (Levenshtein-based token-sort ratio) ────────────────

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[] = new Array(n + 1);
  for (let j = 0; j <= n; j++) dp[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(
        dp[j] + 1, // deletion
        dp[j - 1] + 1, // insertion
        prev + (a[i - 1] === b[j - 1] ? 0 : 1) // substitution
      );
      prev = tmp;
    }
  }
  return dp[n];
}

/** Returns a 0..1 similarity ratio between two strings (1 = identical). */
function similarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const dist = levenshtein(a, b);
  return 1 - dist / Math.max(a.length, b.length);
}

/** Token-sort ratio: sort tokens alphabetically, compare. Catches rephrasings. */
function tokenSortRatio(a: string, b: string): number {
  const ta = tokenize(a).sort().join(" ");
  const tb = tokenize(b).sort().join(" ");
  if (!ta || !tb) return 0;
  return similarity(ta, tb);
}

// ── 3. Score a single entry ─────────────────────────────────────────────────

interface ScoredEntry {
  entry: QAEntry;
  score: number;
}

function scoreEntry(entry: QAEntry, normalized: string, tokens: string[]): number {
  let score = 0;

  // (a) exact variant match — very strong
  for (const v of entry.variants) {
    const nv = normalize(v);
    if (normalized === nv) return 100; // near-certain
    if (normalized.includes(nv) && nv.length > 3) score += 60;
    if (nv.includes(normalized) && normalized.length > 3) score += 50;
  }

  // (b) canonical contains / is contained
  const nc = normalize(entry.canonical);
  if (normalized === nc) return 100;
  if (nc.length > 3 && normalized.includes(nc)) score += 60;
  if (normalized.length > 3 && nc.includes(normalized)) score += 45;

  // (c) keyword overlap (TF-style)
  let keywordHits = 0;
  for (const kw of entry.keywords) {
    const nkw = normalize(kw);
    if (!nkw) continue;
    if (tokens.some((t) => t === nkw || (nkw.length > 3 && t.includes(nkw)))) {
      score += 14;
      keywordHits++;
    } else if (normalized.includes(nkw)) {
      score += 10;
      keywordHits++;
    }
  }
  // all-keywords-present bonus
  if (entry.keywords.length > 0 && keywordHits === entry.keywords.length) {
    score += 20;
  }

  // (d) fuzzy similarity against canonical + variants (catches typos)
  let bestFuzzy = 0;
  const candidates = [nc, ...entry.variants.map(normalize)];
  for (const c of candidates) {
    const r = Math.max(similarity(normalized, c), tokenSortRatio(normalized, c));
    if (r > bestFuzzy) bestFuzzy = r;
  }
  if (bestFuzzy >= 0.95) score += 45;
  else if (bestFuzzy >= 0.85) score += 35;
  else if (bestFuzzy >= 0.7) score += 22;
  else if (bestFuzzy >= 0.55) score += 12;

  return score;
}

// ── 4. Pick the best ────────────────────────────────────────────────────────

export interface MatchResult {
  matched: boolean;
  entry: QAEntry | null;
  score: number;
  // when no confident match: suggest the top candidates as clarifications
  suggestions: QAEntry[];
}

export interface ChatResponse {
  reply: string;
  matchedId: string | null;
  score: number;
  links: { label: string; route: string }[];
  suggestions: { id: string; label: string }[]; // clarify chips
}

const CONFIDENCE_THRESHOLD = 55; // >= → answer directly
const CLARIFY_THRESHOLD = 30; // 30-54 → ask "did you mean?"
// < 30 → fallback

export function matchAnswer(message: string): ChatResponse {
  const normalized = normalize(message);

  // empty / gibberish guard
  if (!normalized || normalized.length < 2) {
    return {
      reply:
        "Hmm, I didn't catch that. 🤔 Try asking about courses, pricing, schools, events, or anything about Sariro. For example: \"How much does it cost?\"",
      matchedId: null,
      score: 0,
      links: [
        { label: "Browse courses", route: "/courses" },
        { label: "See pricing", route: "/pricing" },
      ],
      suggestions: [],
    };
  }

  const tokens = tokenize(normalized);

  // score every entry
  const scored: ScoredEntry[] = QA_ENTRIES.map((entry) => ({
    entry,
    score: scoreEntry(entry, normalized, tokens),
  })).sort((a, b) => b.score - a.score);

  const best = scored[0];

  // out-of-scope deflector: if user asks to write/fix code, force that entry
  const codeHelp = QA_ENTRIES.find((e) => e.id === "oos-write-code");
  if (codeHelp) {
    const codeWords = ["write", "fix", "debug", "code", "function", "script", "program", "build me", "do my"];
    if (codeWords.some((w) => normalized.includes(w)) && (best.score < 70 || best.entry.id === "oos-write-code")) {
      return {
        reply: codeHelp.answer,
        matchedId: codeHelp.id,
        score: 100,
        links: codeHelp.links ?? [],
        suggestions: [],
      };
    }
  }

  // high confidence → answer directly
  if (best && best.score >= CONFIDENCE_THRESHOLD) {
    return {
      reply: best.entry.answer,
      matchedId: best.entry.id,
      score: best.score,
      links: best.entry.links ?? [],
      suggestions: [],
    };
  }

  // medium confidence → clarify
  if (best && best.score >= CLARIFY_THRESHOLD) {
    const top = scored
      .filter((s) => s.score >= CLARIFY_THRESHOLD)
      .slice(0, 3)
      .map((s) => s.entry);
    return {
      reply: `I think you might be asking about: "${best.entry.canonical}". Is that right? 🙂 Here are some related topics:`,
      matchedId: null,
      score: best.score,
      links: [],
      suggestions: top.map((e) => ({ id: e.id, label: e.canonical })),
    };
  }

  // fallback
  const fallbackLinks = [
    { label: "Browse courses", route: "/courses" },
    { label: "See pricing", route: "/pricing" },
    { label: "Email us", route: "mailto:courses@sariro.com" },
  ];
  return {
    reply:
      "I'm not 100% sure I caught that. 🙏 I can help with courses, pricing, schools, events, certificates, or anything about Sariro. Try rephrasing, or pick a topic below — and if you'd rather talk to a human, email courses@sariro.com (we reply within 2 business days).",
    matchedId: null,
    score: best?.score ?? 0,
    links: fallbackLinks,
    suggestions: [],
  };
}
