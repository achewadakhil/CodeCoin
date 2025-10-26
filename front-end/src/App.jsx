import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/NavBar";
import Test from "./pages/Test";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
		      <Route path="/test" element = {<Test />}> </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
