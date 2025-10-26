import { useState } from "react";

export default function Features() {
  const modules = [
  {
    heading: "LeaderBoard",
    content:
      "View and compare your ranking with other users. Track your performance and see top contributors in real-time.",
    color: "bg-yellow-100",
  },
  {
    heading: "Stats in Profile",
    content:
      "Check your personal stats, achievements, and progress over time. Get insights into your performance trends.",
    color: "bg-blue-100",
  },
  {
    heading: "Daily Question",
    content:
      "Solve a new coding question every day to sharpen your problem-solving skills and stay consistent in learning.",
    color: "bg-green-100",
  },
];


  const [currentIndex, setCurrentIndex] = useState(0);
  const currentModule = modules[currentIndex];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-8 py-20 space-y-16">
      <div className="flex flex-col md:flex-row gap-6">
        {modules.map((module, index) => (
          <div
            key={index}
            className={`cursor-pointer p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105 ${
              currentIndex === index ? "border-4 border-blue-500" : "border"
            } ${module.color}`}
            onClick={() => setCurrentIndex(index)}
          >
            <h3 className="text-2xl font-bold mb-2">{module.heading}</h3>
            <p className="text-gray-700">{module.content.substring(0, 60)}...</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              onClick={() => setCurrentIndex(index)}
            >
              View
            </button>
          </div>
        ))}
      </div>
      <div className="mt-12 p-8 w-full md:w-2/3 rounded-xl shadow-2xl bg-white">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
          {currentModule.heading}
        </h2>
        <p className="text-gray-700 text-lg">{currentModule.content}</p>
        <button className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
          Start Learning
        </button>
      </div>
    </section>
  );
}
