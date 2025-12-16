import { cn } from "../lib/utils";

interface CardProps {
  children: React.ReactNode;
  glowColor: string;
  className?: string;
}

export default function Card({ children, glowColor, className }: CardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border-2 p-6 transition-all duration-300",

        "bg-black/20 border-white/10 text-white",

        "backdrop-blur-md shadow-sm hover:shadow-md",

        className
      )}
    >
      <div
        className="absolute -top-[20%] left-1/2 -translate-x-1/2 h-25 w-full blur-[80px] opacity-40 pointer-events-none"
        style={{ backgroundColor: glowColor }}
      />

      {children}
    </div>
  );
}
