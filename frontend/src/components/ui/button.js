import React from "react";
import clsx from "clsx";

export function Button({
  children,
  className = "",
  variant = "default",
  size = "md",
  asChild = false,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50";

  const variants = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700",
    outline:
      "border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white",
    ghost: "text-indigo-600 hover:bg-indigo-50",
    gradient:
      "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90",
    secondary:
      "bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
    xl: "h-14 px-8 text-lg",
  };

  const Comp = asChild ? "span" : "button";

  return (
    <Comp
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Comp>
  );
}
