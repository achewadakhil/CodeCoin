import { useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", points: 10 },
  { day: "Tue", points: 20 },
  { day: "Wed", points: 40 },
  { day: "Thu", points: 30 },
  { day: "Fri", points: 50 },
  { day: "Sat", points: 70 },
  { day: "Sun", points: 90 },
];




export default function ProfilePage() {

    useEffect(()=>{

        (async ()=>{

            const res = await fetch("http://localhost:3000/auth/profile/",{
                method : "GET",
                headers :{
                    "Content-Type" : "application/json",
                    "token" : localStorage.getItem("authToken"),
                }
            });
            const data = await res.json();

        })();
    },[]);

    return (
        <div className="min-h-screen bg-gray-900 p-32 text-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="relative bg-gray-800 shadow-xl rounded-2xl p-6 space-y-6 lg:col-span-1">
            <div className="absolute top-3 right-3 animate-pulse bg-green-600/20 text-green-300 border border-green-600 text-xs font-semibold px-3 py-1 rounded-full shadow shadow-green-500/30">
                Top 7% 🔥
            </div>

            <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-700 overflow-hidden flex-shrink-0"></div>
                <div>
                <h2 className="text-xl font-semibold">Akhil Achewad</h2>
                <p className="text-gray-400 text-sm">MERN & DSA Developer</p>
                </div>
            </div>
            <div className="space-y-2 text-sm text-gray-200">
                <p>
                <span className="font-semibold">Solved Problems:</span> <span className="ml-1">248</span>
                </p>
                <p>
                <span className="font-semibold">Current Points:</span> <span className="ml-1">920</span>
                </p>
                <p>
                <span className="font-semibold">Level:</span> <span className="ml-1">5</span>
                </p>
            </div>
            <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400 font-medium">
                <span>920 / 1200 XP</span>
                <span>Next Level</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full" style={{ width: "76%" }}></div>
                </div>
            </div>
            </div>
            <div className="bg-gray-800 shadow-xl rounded-2xl p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Weekly Points Progress</h3>
            <div className="relative w-full h-64 overflow-hidden rounded-lg" aria-hidden>
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/2 to-transparent opacity-10 animate-[slide_6s_linear_infinite]"></div>
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                    <XAxis dataKey="day" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" />
                    <Tooltip wrapperStyle={{ background: "#0f172a", border: "1px solid #334155", color: "#fff" }} />
                    <Line type="monotone" dataKey="points" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
                </ResponsiveContainer>
            </div>
            </div>
        </div>

        {/* Tailwind keyframes for slide animation (paste into your global CSS if using Tailwind config) */}
        {/*
            @keyframes slide {
            0% { transform: translateX(-25%); }
            50% { transform: translateX(25%); }
            100% { transform: translateX(-25%); }
            }
        */}
        </div>
    );
}
