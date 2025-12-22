import { type KeyboardEvent } from "react";
import { motion } from "framer-motion";

type SwitchToggleProps = {
  value: boolean; // تغییر نام از initial به value
  fromColor?: string;
  toColor?: string;
  shadowColor?: string;
  toggle: (value: boolean) => void;
};

export default function SwitchToggle({
  value = false, // استفاده مستقیم از value
  fromColor = "#FDE047",
  toColor = "#FB923C",
  shadowColor,
  toggle,
}: SwitchToggleProps) {
  // هندلر ساده‌شده: فقط مقدار معکوس را به والد می‌فرستد
  const toggleHandler = () => {
    toggle(!value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleHandler();
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={value ? "نمایش فعال" : "نمایش غیرفعال"}
      onClick={toggleHandler}
      onKeyDown={handleKeyDown}
      className={`relative inline-flex outline-none items-center w-44 h-12 p-1 rounded-full transition-colors duration-300 focus:outline-none overflow-hidden ${
        value ? "" : "bg-gray-300"
      }`}
      style={
        value
          ? {
              backgroundImage: `linear-gradient(to right, ${fromColor}, ${toColor})`,
              boxShadow: `0 0 28px ${shadowColor ?? "rgba(253,224,71,0.45)"}`,
            }
          : undefined
      }
    >
      <span
        className={`absolute inset-0 flex items-center justify-center pointer-events-none text-sm font-medium transition-colors duration-200 z-20 ${
          value ? "text-white" : "text-gray-700"
        }`}
      >
        {value ? "حالت نمایشی" : "حالت عادی"}
      </span>

      <motion.span
        aria-hidden="true"
        className="absolute top-1 h-10 w-10 rounded-full bg-white shadow z-10"
        style={{ left: 4 }}
        initial={false} // انیمیشن اولیه غیرفعال تا پرش نداشته باشد
        animate={{ x: value ? 128 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 15, mass: 0.5 }}
        whileTap={{ scale: 0.95 }}
      />
    </button>
  );
}
