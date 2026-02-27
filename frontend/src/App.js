import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Layout from "./Component/Layout";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Career from "./Pages/Career";
import CareerAcc from "./Component/Career/CareerAcc";

function App() {
  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // const [ring1Position, setRing1Position] = useState({ x: 0, y: 0 });
  // const [ring2Position, setRing2Position] = useState({ x: 0, y: 0 });
  // const [ring3Position, setRing3Position] = useState({ x: 0, y: 0 });
  // const [isHovered, setIsHovered] = useState(false);
  // const [isClicked, setIsClicked] = useState(false);
  // const animationRef = useRef();

  // useEffect(() => {
  //   const updateMousePosition = (e) => {
  //     setMousePosition({ x: e.clientX, y: e.clientY });
  //   };

  //   document.addEventListener("mousemove", updateMousePosition);
  //   return () => document.removeEventListener("mousemove", updateMousePosition);
  // }, []);

  // useEffect(() => {
  //   const animateRings = () => {
  //     setRing1Position((prev) => {
  //       const dx = mousePosition.x - prev.x;
  //       const dy = mousePosition.y - prev.y;
  //       const ease = 0.15;

  //       return {
  //         x: prev.x + dx * ease,
  //         y: prev.y + dy * ease,
  //       };
  //     });

  //     setRing2Position((prev) => {
  //       const dx = mousePosition.x - prev.x;
  //       const dy = mousePosition.y - prev.y;
  //       const ease = 0.08;

  //       return {
  //         x: prev.x + dx * ease,
  //         y: prev.y + dy * ease,
  //       };
  //     });

  //     setRing3Position((prev) => {
  //       const dx = mousePosition.x - prev.x;
  //       const dy = mousePosition.y - prev.y;
  //       const ease = 0.04; // Slow

  //       return {
  //         x: prev.x + dx * ease,
  //         y: prev.y + dy * ease,
  //       };
  //     });

  //     animationRef.current = requestAnimationFrame(animateRings);
  //   };

  //   animationRef.current = requestAnimationFrame(animateRings);

  //   return () => {
  //     if (animationRef.current) {
  //       cancelAnimationFrame(animationRef.current);
  //     }
  //   };
  // }, [mousePosition]);

  // useEffect(() => {
  //   const handleMouseDown = () => setIsClicked(true);
  //   const handleMouseUp = () => setIsClicked(false);

  //   const handleMouseOver = (e) => {
  //     if (e.target.matches("button, a, .hoverable, input, textarea")) {
  //       setIsHovered(true);
  //     }
  //   };

  //   const handleMouseOut = (e) => {
  //     if (e.target.matches("button, a, .hoverable, input, textarea")) {
  //       setIsHovered(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleMouseDown);
  //   document.addEventListener("mouseup", handleMouseUp);
  //   document.addEventListener("mouseover", handleMouseOver);
  //   document.addEventListener("mouseout", handleMouseOut);

  //   return () => {
  //     document.removeEventListener("mousedown", handleMouseDown);
  //     document.removeEventListener("mouseup", handleMouseUp);
  //     document.removeEventListener("mouseover", handleMouseOver);
  //     document.removeEventListener("mouseout", handleMouseOut);
  //   };
  // }, []);

  // const dotStyle = {
  //   position: "fixed",
  //   left: mousePosition.x - 4,
  //   top: mousePosition.y - 4,
  //   width: 8,
  //   height: 8,
  //   backgroundColor: "#ffffff",
  //   borderRadius: "50%",
  //   pointerEvents: "none",
  //   zIndex: 10003,
  //   transform: `scale(${isClicked ? 0.5 : 1})`,
  //   transition: "transform 0.1s ease",
  //   mixBlendMode: "difference",
  // };

  // const ring1Style = {
  //   position: "fixed",
  //   left: ring1Position.x - 15,
  //   top: ring1Position.y - 15,
  //   width: 30,
  //   height: 30,
  //   border: "2px solid #ff0080",
  //   borderRadius: "50%",
  //   pointerEvents: "none",
  //   zIndex: 10002,
  //   transform: `scale(${isClicked ? 0.7 : isHovered ? 1.3 : 1}) rotate(0deg)`,
  //   transition: "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  //   borderColor: isHovered ? "#00ff80" : isClicked ? "#ff4080" : "#ff0080",
  //   opacity: 0.9,
  //   animation: "ring1Spin 3s linear infinite",
  // };

  // const ring2Style = {
  //   position: "fixed",
  //   left: ring2Position.x - 25,
  //   top: ring2Position.y - 25,
  //   width: 50,
  //   height: 50,
  //   border: "2px solid #8000ff",
  //   borderRadius: "50%",
  //   pointerEvents: "none",
  //   zIndex: 10001,
  //   transform: `scale(${isClicked ? 0.8 : isHovered ? 1.2 : 1}) rotate(0deg)`,
  //   transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  //   borderColor: isHovered ? "#00ffff" : isClicked ? "#ff8000" : "#8000ff",
  //   opacity: 0.7,
  //   animation: "ring2Spin 4s linear infinite reverse",
  // };

  // const ring3Style = {
  //   position: "fixed",
  //   left: ring3Position.x - 35,
  //   top: ring3Position.y - 35,
  //   width: 70,
  //   height: 70,
  //   border: "2px solid #0080ff",
  //   borderRadius: "50%",
  //   pointerEvents: "none",
  //   zIndex: 10000,
  //   transform: `scale(${isClicked ? 0.9 : isHovered ? 1.1 : 1}) rotate(0deg)`,
  //   transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  //   borderColor: isHovered ? "#80ff00" : isClicked ? "#ffff00" : "#0080ff",
  //   opacity: 0.5,
  //   animation: "ring3Spin 5s linear infinite",
  // };

  // const keyframesStyle = `
  //     @keyframes ring1Spin {
  //       from { transform: rotate(0deg); }
  //       to { transform: rotate(360deg); }
  //     }
      
  //     @keyframes ring2Spin {
  //       from { transform: rotate(0deg); }
  //       to { transform: rotate(-360deg); }
  //     }
      
  //     @keyframes ring3Spin {
  //       from { transform: rotate(0deg); }
  //       to { transform: rotate(360deg); }
  //     }
  //   `;
  return (
    <>
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
