import React from "react";

type Props = {
  size?: number;        // icon size
  showText?: boolean;   // show "NOVA"
  className?: string;
};

export function NovaLogo({ size = 28, showText = true, className }: Props) {
  return (
    <div className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      {/* Icon (simplified from your SVG branding) */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="novaG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <filter id="novaGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="32" cy="32" r="22" fill="none" stroke="url(#novaG)" strokeWidth="2.5" opacity="0.9" />
        <circle cx="32" cy="32" r="16" fill="url(#novaG)" opacity="0.10" />

        {/* Stylized N */}
        <path
          d="M24 44V20h4v14l12-14h4v24h-4V30L28 44h-4z"
          fill="url(#novaG)"
          filter="url(#novaGlow)"
        />
      </svg>

      {showText && (
        <span className="text-2xl font-semibold tracking-wide nova-text nova-glow">
          Nova
        </span>
      )}
    </div>
  );
}
