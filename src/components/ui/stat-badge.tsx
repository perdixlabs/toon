type StatBadgeProps = {
  readonly label: string;
  readonly value: number;
  readonly compact?: boolean;
};

export function StatBadge({ label, value, compact }: StatBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-3 rounded-full border border-white/15 bg-black/30 ${
        compact ? "px-3 py-1 text-sm" : "px-4 py-2"
      }`}
    >
      <span
        className={`uppercase tracking-[0.25em] text-white/50 ${
          compact ? "text-[0.55rem]" : "text-[0.6rem]"
        }`}
      >
        {label}
      </span>
      <span
        className={`font-semibold text-white ${compact ? "text-lg" : "text-xl"}`}
      >
        {value}
      </span>
    </span>
  );
}

