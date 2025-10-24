// App.jsx
import React from "react";
import HeroHome from "../components/HeroHome";
import LearningSection from "../components/Features";

export default function Home() {
  return <>
    <div className="h-[300vh] bg-[#003e77]">
        <HeroHome />
        <LearningSection />
    </div>
  </>
}
