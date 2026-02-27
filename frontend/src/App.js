import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Layout from "./Component/Layout";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Career from "./Pages/Career";
import CareerAcc from "./Component/Career/CareerAcc";

import { Toaster } from 'react-hot-toast';

function App() {
  // ... existing commented code untouched, just jump below
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {/* <div className="from-gray-900 via-purple-900 to-black text-white cursor-none overflow-hidden">
        <style>{keyframesStyle}</style>
        <div style={ring3Style} />
        <div style={ring2Style} />
        <div style={ring1Style} />
        <div style={dotStyle} />
      </div> */}
      <Routes>
        <Route path="" element={<Layout />}>
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/career" element={<Career />}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
