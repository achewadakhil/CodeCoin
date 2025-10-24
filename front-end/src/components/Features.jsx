import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
//not done have to write the whole code
export default function LearningSection() {
  const modules = [
    {
      heading: "Learn JavaScript",
      content: "Master the fundamentals of JavaScript and build interactive web pages using modern techniques.",
    },
    {
      heading: "React Essentials",
      content: "Understand React components, state, and hooks to build dynamic web applications.",
    },
    {
      heading: "Data Structures & Algorithms",
      content: "Improve problem-solving skills for coding interviews and real-world projects.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleWheel = (event) => {
      const len = modules.length;

      if (event.deltaY > 0) {
        if (currentIndex < len - 1) {
          event.preventDefault();
          setCurrentIndex((prev) => Math.min(prev + 1, len - 1));
        }
      } else {
        if (currentIndex > 0) {
          event.preventDefault();
          setCurrentIndex((prev) => Math.max(prev - 1, 0));
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentIndex, modules.length]);


  const module = modules[currentIndex];

  return (
    <section className="min-h-screen flex flex-col md:flex-row items-center justify-center px-8 md:px-20 py-20 ">
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.7 }}
          className="md:w-1/2 mb-8 md:mb-0"
        >
          <h2 className="text-5xl font-bold text-gray-800">
            {module.heading}
          </h2>
        </motion.div>
      </AnimatePresence>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.7 }}
          className="md:w-1/2 bg-white p-8 rounded-lg shadow-lg"
        >
          <p className="text-gray-700 text-lg">{module.content}</p>
          <button className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
            Start Learning
          </button>
        </motion.div>
      </AnimatePresence>

    </section>
  );
}
