import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 

export default function DailyQuestions() {
  const [todayQuestions, setTodayQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [solved, setSolved] = useState({});
  const [authError, setAuthError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setAuthError("Please login to view today's questions.");
      setTimeout(() => navigate("/signin"), 1500);
      return;
    }

    (async () => {
      try {
        const res = await fetch("http://localhost:3000/daily-questions/today-questions", {
          cache: "no-store",
          headers: { 
            "Content-Type": "application/json",
            "token": token
          },
          credentials: "include"
        });

        if (res.status === 401) {
          setAuthError("Session expired. Redirecting to login...");
          setTimeout(() => navigate("/signin"), 1500);
          return;
        }

        const data = await res.json();
        setTodayQuestions(data.questions);

        data.questions.forEach(async (q) => {
          try {
            const res = await fetch("http://localhost:3000/daily-questions/submit", {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "token": token
              },
              credentials: "include",
              body: JSON.stringify({ titleSlug: q.titleSlug , difficulty : q.difficulty})
            });

            if (res.status === 401) {
              setAuthError("Session expired. Redirecting to login...");
              setTimeout(() => navigate("/signin"), 1500);
              return;
            }

            const result = await res.json();
            if (result?.data?.solvedToday) {
              setSolved(prev => ({ ...prev, [q.title]: true }));
            }
          } catch (err) {
            console.log("Error checking solved:", err);
          }
        });

      } catch (err) {
        console.log("Error while fetching problems", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy": return "text-green-400 bg-green-900/40";
      case "medium": return "text-yellow-400 bg-yellow-900/40";
      case "hard": return "text-red-400 bg-red-900/40";
      default: return "text-gray-400 bg-gray-800";
    }
  };

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-lg">
        {authError}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10 pt-20">
      <h1 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
        Today’s Coding Questions 🧠🔥
      </h1>

      {loading ? (
        <p className="text-gray-400 animate-pulse">Loading today's questions...</p>
      ) : (
        <div className="space-y-6">
          {todayQuestions.map((q, i) => {
            const isSolved = solved[q.title];

            return (
              <div
                key={i}
                className="
                  relative bg-gray-800 rounded-xl p-5 flex flex-col gap-3 shadow-lg
                  hover:bg-gray-700 hover:scale-[1.02] transition-all duration-200 cursor-pointer
                "
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                        w-6 h-6 flex items-center justify-center rounded-full border-2 transition-all
                        ${isSolved
                          ? "bg-green-500 border-green-400 shadow-md shadow-green-500/60 scale-110"
                          : "border-gray-500"
                        }
                      `}
                    >
                      {isSolved && <span className="text-black font-bold text-sm">✓</span>}
                    </div>

                    <h2 className={`text-lg font-semibold ${isSolved ? "line-through text-gray-400" : ""}`}>
                      {q.title}
                    </h2>
                  </div>

                  <span className={`rounded-md px-2 py-1 text-sm font-medium ${getDifficultyColor(q.difficulty)}`}>
                    {q.difficulty}
                  </span>
                </div>

                <div className="flex gap-4 mt-2">
                  <a
                    href={q.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105 shadow-md hover:shadow-blue-500/30"
                  >
                    Solve
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
