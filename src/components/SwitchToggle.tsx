"use client";

import * as motion from "motion/react-client";

export default function SwitchToggle() {
  return (
    <button
      className={`
          relative flex w-20 h-10 p-1 cursor-pointer rounded-full items-center
          bg-[#3C0061] outline-none transition-colors duration-500
      `}
      aria-label="Toggle Dark Mode"
    >
      <span>حالت فعال</span>

      <span>حالت غیر فعال</span>

      <motion.div
        className="h-8 w-8 rounded-full bg-white shadow-sm z-10"
        layout
        transition={{
          type: "spring",
          visualDuration: 0.2,
          bounce: 0.2,
        }}
      />
    </button>
  );
}
