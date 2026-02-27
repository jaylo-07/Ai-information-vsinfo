import gsap from "gsap";
import React, { useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import img1 from "../Asset/About/about_bg.webp";
import img2 from "../Asset/About/about-bg2.webp";
import img3 from "../Asset/About/about_bg3.webp";

import { FaArrowRight } from "react-icons/fa";

const cardData = [
  { title: "AlphaProteo", text: " In order to expedite advances in biology and medicine, AlphaProteo focuses on comprehending and simulating protein structures." , img:img1 },
  { title: "AlphaGeometry", text: "AlphaGeometry uses sophisticated algorithms to accurately and efficiently tackle challenging geometric problems." , img:img2 },
  { title: "AlphaMissense", text: "AlphaMissense helps in disease research by using AI to forecast how genetic changes would affect protein function." , img:img3 },
];

const AboutCard = () => {
  const cardRefs = useRef([]);
  const imgRefs = useRef([]);
  const textRefs = useRef([]);
  const arrowRefs = useRef([]);

  useEffect(() => {
    cardRefs.current.forEach((card, i) => {
      const img = imgRefs.current[i];
      const text = textRefs.current[i];
      const arrow = arrowRefs.current[i];

      const handleMove = (e) => {
        const bounds = card.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;
        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;
        const rotateX = ((y - centerY) / centerY) * 8;
        const rotateY = ((x - centerX) / centerX) * 8;

        gsap.to(card, {
          rotateX: -rotateX,
          rotateY: rotateY,
          transformPerspective: 1000,
          ease: "power2.out",
          duration: 0.4
        });

        gsap.to(img, {
          x: (rotateY / 8) * 20,
          y: (-rotateX / 8) * 20,
          scale: 1.15,
          duration: 0.4,
          ease: "power2.out"
        });
      };

      const handleEnter = () => {
        gsap.to(card, {
          scale: 1.05,
          boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
          borderColor: "#AECBFA",
          duration: 0.5,
          ease: "power3.out"
        });
        gsap.to(text, { y: -10, opacity: 1, duration: 0.5, ease: "power3.out" });
        gsap.to(arrow, { x: 15, opacity: 1, duration: 0.4, ease: "power3.out" });
      };

      const handleLeave = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          boxShadow: "0 0 0 rgba(0,0,0,0)",
          borderColor: "#AECBFA",
          duration: 0.5,
          ease: "power3.inOut"
        });
        gsap.to(img, { x: 0, y: 0, scale: 1, duration: 0.5, ease: "power3.inOut" });
        gsap.to(text, { y: 0, opacity: 0.9, duration: 0.5, ease: "power3.inOut" });
        gsap.to(arrow, { x: 0, opacity: 0.7, duration: 0.4, ease: "power3.inOut" });
      };

      card.addEventListener("mousemove", handleMove);
      card.addEventListener("mouseenter", handleEnter);
      card.addEventListener("mouseleave", handleLeave);

      return () => {
        card.removeEventListener("mousemove", handleMove);
        card.removeEventListener("mouseenter", handleEnter);
        card.removeEventListener("mouseleave", handleLeave);
      };
    });
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,  // animation duration
      once: false,     // animate every time you scroll into view
      mirror: true,    // animate again when scrolling back up
    });

    const handleScroll = () => {
      AOS.refresh();
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex lg:flex-nowrap flex-wrap justify-center items-stretch lg:mt-11 sm:mt-0 mt-3">
      {cardData.map((card, i) => (
        <div key={i} className="3xl:w-1/4 lg:w-1/3 md:w-1/2 w-full px-5 cursor-pointer lg:mt-4 sm:mt-10 mt-5" data-aos="fade-up">
          <div
            ref={(el) => (cardRefs.current[i] = el)}
            className="bg-themeblack border border-gray-500 rounded-[5px] overflow-hidden transform-gpu transition-colors duration-300 h-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="overflow-hidden">
              <img
                ref={(el) => (imgRefs.current[i] = el)}
                src={card.img}
                alt=""
                className="w-full transform-gpu"
              />
            </div>
            <div
              ref={(el) => (textRefs.current[i] = el)}
              className="px-6 mt-4 opacity-90"
            >
              <p className="text-white sm:text-[20px] text-[18px]">{card.title}</p>
              <p className="text-[#9aa0a6] sm:text-[16px] text-[14px] leading-[20px] mt-2">{card.text}</p>
              <p className="flex justify-end">
                <p
                  ref={(el) => (arrowRefs.current[i] = el)}
                  className="text-white mt-6 mb-4 opacity-70 transform-gpu"
                />
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AboutCard;
