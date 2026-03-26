"use client";

import * as React from "react";
import { motion } from "framer-motion";

function cn(...c: Array<string | undefined | false>) {
  return c.filter(Boolean).join(" ");
}

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "accent" | "ghost";
};

export default function BrandButton({
  variant = "primary",
  className,
  ...props
}: Props) {
  const styles =
    variant === "primary"
      ? "bg-[rgb(var(--brand-primary))] text-white hover:bg-[rgb(var(--brand-primary)/0.9)]"
      : variant === "accent"
      ? "bg-[rgb(var(--brand-accent))] text-white hover:bg-[rgb(var(--brand-accent)/0.92)]"
      : "bg-white/5 text-white/80 border border-white/10 hover:bg-white/10";

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      className={cn(
        "rounded-xl px-4 py-2 text-sm font-medium transition shadow-[0_8px_30px_rgba(0,0,0,0.25)]",
        styles,
        className
      )}
      {...props}
    />
  );
}