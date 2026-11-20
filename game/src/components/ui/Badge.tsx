import type { ReactNode } from "react";

export type Tone = "neutral" | "accent" | "hostile" | "friendly" | "caution";

const TONES: Record<Tone, string> = {
  neutral: "border-line-strong bg-raised text-muted",
  accent: "border-accent/40 bg-accent/10 text-accent",
  hostile: "border-hostile/40 bg-hostile/10 text-hostile",
  friendly: "border-friendly/40 bg-friendly/10 text-friendly",
  caution: "border-caution/40 bg-caution/10 text-caution",
};

/** A small status label. */
const Badge = ({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium ${TONES[tone]} ${className}`}
  >
    {children}
  </span>
);

export default Badge;
