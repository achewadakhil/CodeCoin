// App.jsx
import HeroHome from "../components/HeroHome";
import Footer from "../components/Footer";
import Features from "../components/Features";

export default function Home() {
  return <>
    <div className="bg-[#003e77]">
        <HeroHome />
        <Features />
        <Footer />
    </div>
  </>
}
