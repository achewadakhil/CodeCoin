import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/NavBar";
import Test from "./pages/Test";
import Signin from "./pages/Signin";
import Signup from "./pages/SIgnup";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="bg-[#003e77]">
          <Routes >
            <Route path="/" element={<Home />} />
            <Route path="/test" element = {<Test />}> </Route>
            <Route path="/signin" element = {<Signin />} />
            <Route path = "/signup" element = {<Signup />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
