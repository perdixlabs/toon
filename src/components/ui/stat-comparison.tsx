type StatComparisonProps = {
  readonly label: string;
  readonly jsonValue: number;
  readonly toonValue: number;
};

export function StatComparison({
  label,
  jsonValue,
  toonValue,
}: StatComparisonProps) {
  const difference = jsonValue - toonValue;
  const percentReduction =
    jsonValue > 0 ? ((difference / jsonValue) * 100).toFixed(1) : "0.0";

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs uppercase tracking-[0.2em] text-white/40">
        {label}
      </p>
      <div className="flex gap-3">
        <div className="flex flex-1 items-center gap-2">
          <img
            src="/json.png"
            alt="JSON"
            width={16}
            height={16}
            className="opacity-60"
          />
          <span className="text-sm font-semibold text-white">{jsonValue}</span>
        </div>
        <div className="flex flex-1 items-center gap-2">
          <img
            src="/toon.png"
            alt="TOON"
            width={16}
            height={16}
            className="opacity-60"
          />
          <span className="text-sm font-semibold text-white">{toonValue}</span>
        </div>
      </div>
      <div
        className={`flex items-center gap-1.5 text-xs ${
          difference > 0 ? "text-green-400" : "text-transparent"
        }`}
      >
        <svg
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
        <span>
          {difference > 0
            ? `${difference} fewer (${percentReduction}% smaller)`
            : "\u00A0"}
        </span>
      </div>
    </div>
  );
}


