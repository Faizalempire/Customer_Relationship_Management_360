import React from "react";

export const Logo = ({ size = "md", withText = true }) => {
  const dims = size === "sm" ? "h-7 w-7" : size === "lg" ? "h-10 w-10" : "h-8 w-8";
  const text = size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";
  return (
    <div className="flex items-center gap-2.5" data-testid="brand-logo">
      <div className={`${dims} rounded-lg bg-emerald-500 relative overflow-hidden glow-emerald flex items-center justify-center`}>
        <span className="text-black font-bold font-display text-sm">C</span>
        <div className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full bg-emerald-300 blur-[2px]" />
      </div>
      {withText && (
        <span className={`font-display font-bold ${text} tracking-tight text-white`}>
          CRM<span className="text-emerald-400">360</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
