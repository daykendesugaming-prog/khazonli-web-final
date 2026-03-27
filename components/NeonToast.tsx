"use client";

interface NeonToastProps {
  open: boolean;
  type?: "success" | "error" | "info";
  title: string;
  message?: string;
  onClose: () => void;
}

const toastStyles = {
  success: {
    ring: "border-[#00A8FF]/40",
    glow: "shadow-[0_0_30px_rgba(0,168,255,0.18)]",
    badge: "bg-[#00A8FF]/15 text-[#7dd3fc] border border-[#00A8FF]/30",
    icon: "✦",
  },
  error: {
    ring: "border-red-500/40",
    glow: "shadow-[0_0_30px_rgba(239,68,68,0.18)]",
    badge: "bg-red-500/15 text-red-300 border border-red-500/30",
    icon: "⚠",
  },
  info: {
    ring: "border-[#FBB03B]/40",
    glow: "shadow-[0_0_30px_rgba(251,176,59,0.18)]",
    badge: "bg-[#FBB03B]/15 text-[#FCD58B] border border-[#FBB03B]/30",
    icon: "●",
  },
};

export default function NeonToast({ open, type = "success", title, message, onClose }: NeonToastProps) {
  if (!open) return null;

  const style = toastStyles[type];

  return (
    <div className="fixed top-5 right-5 z-[999] w-[calc(100%-2rem)] max-w-md">
      <div
        className={`relative overflow-hidden rounded-2xl border bg-[#121826]/95 backdrop-blur-xl p-4 md:p-5 ${style.ring} ${style.glow}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,168,255,0.14),transparent_35%)] pointer-events-none" />
        <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-40" />

        <div className="relative flex items-start gap-3">
          <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${style.badge}`}>
            {style.icon}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gray-500">Khazonli System</p>
            <h3 className="mt-1 text-sm md:text-base font-black uppercase tracking-wide text-white">{title}</h3>
            {message ? <p className="mt-1 text-xs md:text-sm leading-relaxed text-gray-300">{message}</p> : null}
          </div>

          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-gray-400 transition hover:border-white/20 hover:text-white"
            aria-label="Cerrar notificación"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
