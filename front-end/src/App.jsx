import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/NavBar";
import Test from "./pages/Test";
import Signin from "./pages/Signin";
import Signup from "./pages/SIgnup";
import { AuthProvider } from "./contexts/AuthContext";
import DailyQuestions from "./pages/DailyQuestions";
import ProfilePage from "./pages/Profile";

export default function App() {
  
  const date = new Date();
  const dd = String(date.getDate()).padStart(2,"0");
  const mm = String(date.getMonth()).padStart(2,"0");
  const yy = String(date.getFullYear());
  const formattedDate = `/${dd}-${mm}-${yy}/daily-questions`
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="bg-[#003e77]">
          <Routes >
            <Route path = "/" element={<Home />} />
            <Route path = "/profile" element = {<ProfilePage />} />
            <Route path = "/test" element = {<Test />} />
            <Route path = "/signin" element = {<Signin />} />
            <Route path = "/signup" element = {<Signup />}/>
            <Route path = {formattedDate} element = {<DailyQuestions />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
