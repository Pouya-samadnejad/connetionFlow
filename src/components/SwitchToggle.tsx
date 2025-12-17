import { useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";

type SwitchToggleProps = {
  initial?: boolean;
  fromColor?: string;
  toColor?: string;
  shadowColor?: string;
};

export default function SwitchToggle({
  initial = false,
  fromColor = "#FDE047",
  toColor = "#FB923C",
  shadowColor,
}: SwitchToggleProps) {
  const [on, setOn] = useState<boolean>(initial);

  const toggle = () => setOn((v) => !v);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={on ? "نمایش فعال" : "نمایش غیرفعال"}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      className={`relative inline-flex outline-none items-center w-44 h-12 p-1 rounded-full transition-colors duration-300 focus:outline-none overflow-hidden ${
        on ? "" : "bg-gray-300"
      }`}
      style={
        on
          ? {
              backgroundImage: `linear-gradient(to right, ${fromColor}, ${toColor})`,
              boxShadow: `0 0 28px ${shadowColor ?? "rgba(253,224,71,0.45)"}`,
            }
          : undefined
      }
    >
      <span
        className={`absolute inset-0 flex items-center justify-center pointer-events-none text-sm font-medium transition-colors duration-200 z-20 ${
          on ? "text-white" : "text-gray-700"
        }`}
      >
        {on ? "حالت نمایشی" : "حالت عادی"}
      </span>

      <motion.span
        aria-hidden="true"
        className="absolute top-1 h-10 w-10 rounded-full bg-white shadow z-10"
        style={{ left: 4 }}
        initial={{ x: 0 }}
        animate={{ x: on ? 128 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 15, mass: 0.5 }}
        whileTap={{ scale: 0.95 }}
      />
    </button>
  );
}
