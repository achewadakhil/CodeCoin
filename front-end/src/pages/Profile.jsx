import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function getDateNumber(date = new Date()) {
  return (
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  );
}

function lastNDatesNumbers(n = 7, fromDate = new Date()) {
  const arr = [];
  const base = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    arr.push(getDateNumber(d));
  }
  return arr;
}

function formatDayLabel(dateNumber) {
  const s = String(dateNumber).padStart(8, "0");
  const yyyy = +s.slice(0, 4);
  const mm = +s.slice(4, 6) - 1;
  const dd = +s.slice(6, 8);
  const d = new Date(yyyy, mm, dd);
  return d.toLocaleDateString(undefined, { weekday: "short" }); // "Mon"
}

function aggregateLastNDays(rawEvents = [], n = 7, today = new Date()) {
  const lastDates = lastNDatesNumbers(n, today); // oldest->newest

  const pointsMap = new Map();
  for (const ev of rawEvents) {
    let dn = undefined;
    if (ev.dateNumber != null) dn = Number(ev.dateNumber);
    else if (ev.date) dn = getDateNumber(new Date(ev.date));
    else if (ev.createdAt) dn = getDateNumber(new Date(ev.createdAt));
    if (dn != null) {
      const current = pointsMap.get(dn) ?? 0;
      pointsMap.set(dn, current + (ev.points ?? ev.score ?? 0));
    }
  }

  return lastDates.map((dn) => ({
    day: formatDayLabel(dn),
    dateNumber: dn,
    points: pointsMap.get(dn) ?? 0,
  }));
}

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scoreHistory, setScoreHistory] = useState([]); // raw from backend
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/auth/profile/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("authToken"),
          },
        });

        const data = await res.json();
        setUserInfo(data);
        // assume backend returns bucketed/row data as data.result
        setScoreHistory(data.result ?? []);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setScoreHistory([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setChartData(aggregateLastNDays(scoreHistory, 7));
  }, [scoreHistory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading profile...
      </div>
    );
  }

  // safe percent for XP bar
  const xp = userInfo?.rating?.computedXP ?? 0;
  const target = userInfo?.target ?? 1;
  const xpPercent = Math.max(0, Math.min(100, (xp * 100) / target));

  return (
    <div className="min-h-screen bg-gray-900 p-32 text-white">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="relative bg-gray-800 shadow-xl rounded-2xl p-6 space-y-6 lg:col-span-1">
          

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-700"></div>

            <div>
              <h2 className="text-xl font-semibold">{userInfo?.name || "User"}</h2>
              <p className="text-gray-400 text-sm">{userInfo?.bio || "DSA"}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-200">
            <p>
              <span className="font-semibold">Solved Problems:</span>
              <span className="ml-1">{userInfo?.totalProblems ?? 0}</span>
            </p>
            <p>
              <span className="font-semibold">Current Points:</span>
              <span className="ml-1">{xp}</span>
            </p>
            <p>
              <span className="font-semibold">Level:</span>
              <span className="ml-1">{userInfo?.level ?? "No Level"}</span>
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-400 font-medium">
              <span>
                {xp} / {userInfo?.target ?? 0} XP
              </span>
              <span>Next Level</span>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full"
                style={{ width: `${xpPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 shadow-xl rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Weekly Points Progress</h3>

          <div className="relative w-full h-64 overflow-hidden rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                <XAxis dataKey="day" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip
                  wrapperStyle={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="points"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
