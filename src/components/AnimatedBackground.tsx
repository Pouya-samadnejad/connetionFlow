import { motion } from "motion/react";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden transition-colors duration-500 bg-[#0a0a0a]">
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]
        bg-size-[24px_24px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute 
          top-[15%] left-[10%] 
          h-[250px] w-[250px] sm:h-[350px] sm:w-[350px] md:h-[500px] md:w-[500px]
          rounded-full blur-[80px] sm:blur-[100px]
        bg-[#3C0061]
        "
      />

      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -30, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="
          absolute 
          top-[30%] right-[5%] 
          h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] md:h-[400px] md:w-[400px]
          rounded-full blur-[70px] sm:blur-[100px]
          bg-[#FDB813]
        "
      />

      {/* بلاب سوم */}
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, 30, -30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="
          absolute 
          top-1/2 right-1/4 
          h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] md:h-[400px] md:w-[400px]
          rounded-full blur-[80px] sm:blur-[110px]
          bg-[#a50d0d]
        "
      />
    </div>
  );
}
