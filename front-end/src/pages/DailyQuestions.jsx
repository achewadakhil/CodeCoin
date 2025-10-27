import { useEffect } from "react";

export default function DailyQuestions() {
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch("http://localhost:3000/daily-questions/today-questions", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        console.log(data);
      } catch (err) {
        console.error("Error fetching daily questions:", err);
      }
    }

    fetchQuestions();
  }, []);

  return (
    <>
      <div className="min-h-screen">
        {/* You can render fetched questions here later */}
      </div>
    </>
  );
}
