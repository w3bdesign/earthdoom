import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import {
  LuShieldAlert,
  LuShieldCheck,
  LuInfo,
  LuTriangleAlert,
} from "react-icons/lu";

type AlertTone = "hostile" | "friendly" | "caution" | "info";

const TONES: Record<AlertTone, { box: string; icon: IconType }> = {
  hostile: {
    box: "border-hostile/40 bg-hostile/10 [&_svg]:text-hostile",
    icon: LuShieldAlert,
  },
  friendly: {
    box: "border-friendly/35 bg-friendly/10 [&_svg]:text-friendly",
    icon: LuShieldCheck,
  },
  caution: {
    box: "border-caution/40 bg-caution/10 [&_svg]:text-caution",
    icon: LuTriangleAlert,
  },
  info: {
    box: "border-accent/35 bg-accent/10 [&_svg]:text-accent",
    icon: LuInfo,
  },
};

interface AlertProps {
  tone: AlertTone;
  title: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
}

/** A notice with an icon, a title, optional details and an optional action. */
const Alert = ({ tone, title, children, action }: AlertProps) => {
  const { box, icon: Icon } = TONES[tone];
  return (
    <div
      role={tone === "hostile" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${box}`}
    >
      <Icon aria-hidden className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-ink">{title}</p>
        {children && <div className="mt-0.5 text-ink/80">{children}</div>}
      </div>
      {action && <div className="shrink-0 self-center">{action}</div>}
    </div>
  );
};

export default Alert;
