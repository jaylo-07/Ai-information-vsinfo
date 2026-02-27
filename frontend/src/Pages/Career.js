import React, { useState, useEffect, useRef } from 'react'
import contact from '../Asset/Contact/contact.png'
import { FaRegUser } from "react-icons/fa";
import { LuStethoscope } from "react-icons/lu";
import { FaRegClock } from "react-icons/fa6";
import { TbWorld } from "react-icons/tb";
import { IoCalendarOutline } from "react-icons/io5";
import { GiSelfLove } from "react-icons/gi";
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { GiCheckMark } from "react-icons/gi";
import career from '../Asset/Career/career.png'
import AOS from "aos";

import slider_1 from '../Asset/Career/slider_1.png'
import slider_2 from '../Asset/Career/slider_2.png'
import slider_3 from '../Asset/Career/slider_3.png'
import slider_4 from '../Asset/Career/slider_4.png'
import slider_5 from '../Asset/Career/slider_5.png'
import slider_6 from '../Asset/Career/slider_6.png'
import slider_7 from '../Asset/Career/slider_3.png'

import '../style/Sujal.css'

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import CareerAcc from '../Component/Career/CareerAcc';

const Career = () => {
    const [currentIndex, setCurrentIndex] = useState(2);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef(null);
  
    const slides = [
      {
        src: slider_1,
        title: "Mountain Peak",
        subtitle: "Majestic Heights",
        color: "from-blue-600 to-purple-600"
      },
      {
        src: slider_2,
        title: "Forest Trail",
        subtitle: "Nature's Path",
        color: "from-green-600 to-teal-600"
      },
      {
        src: slider_3,
        title: "Ocean Waves",
        subtitle: "Endless Blue",
        color: "from-cyan-600 to-blue-600"
      },
      {
        src: slider_4,
        title: "Golden Valley",
        subtitle: "Sunset Magic",
        color: "from-orange-600 to-red-600"
      },
      {
        src: slider_5,
        title: "Rolling Hills",
        subtitle: "Green Paradise",
        color: "from-emerald-600 to-green-600"
      },
      {
        src: slider_6,
        title: "Starry Night",
        subtitle: "Cosmic Wonder",
        color: "from-indigo-600 to-purple-600"
      },
      {
        src: slider_7,
        title: "Desert Dunes",
        subtitle: "Golden Sands",
        color: "from-yellow-600 to-orange-600"
      }
    ];
  
    // Auto-play functionality
    useEffect(() => {
      if (isAutoPlaying && !isDragging) {
        const interval = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(interval);
      }
    }, [currentIndex, isAutoPlaying, isDragging, slides.length]);
  
    const goToSlide = (index) => {
      setCurrentIndex(index);
    };
  
    const goToPrevious = () => {
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };
  
    const goToNext = () => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    };
  
    const get3DTransform = (index) => {
      const diff = index - currentIndex;
      const totalSlides = slides.length;
      
      // Handle circular positioning
      let adjustedDiff = diff;
      if (Math.abs(diff) > totalSlides / 2) {
        adjustedDiff = diff > 0 ? diff - totalSlides : diff + totalSlides;
      }
  
      const absIndex = Math.abs(adjustedDiff);
      
      let transform = '';
      let opacity = 1;
      let zIndex = 100;
      let scale = 1;
      let rotateY = 0;
      let rotateX = 0;
      let translateX = 0;
      let translateZ = 0;
      let blur = 0;
  
      if (adjustedDiff === 0) {
        // Center slide - most prominent
        scale = 1.2;
        translateZ = 100;
        zIndex = 200;
        opacity = 1;
      } else if (absIndex === 1) {
        // Adjacent slides
        const side = adjustedDiff > 0 ? 1 : -1;
        translateX = side * 280;
        translateZ = -50;
        rotateY = -side * 35;
        rotateX = 5;
        scale = 0.85;
        opacity = 0.8;
        zIndex = 150;
        blur = 1;
      } else if (absIndex === 2) {
        // Second level slides
        const side = adjustedDiff > 0 ? 1 : -1;
        translateX = side * 480;
        translateZ = -120;
        rotateY = -side * 50;
        rotateX = 10;
        scale = 0.7;
        opacity = 0.6;
        zIndex = 100;
        blur = 2;
      } else if (absIndex === 3) {
        // Third level slides
        const side = adjustedDiff > 0 ? 1 : -1;
        translateX = side * 650;
        translateZ = -200;
        rotateY = -side * 65;
        rotateX = 15;
        scale = 0.55;
        opacity = 0.4;
        zIndex = 50;
        blur = 3;
      } else {
        // Far slides - barely visible
        const side = adjustedDiff > 0 ? 1 : -1;
        translateX = side * 800;
        translateZ = -300;
        rotateY = -side * 80;
        rotateX = 20;
        scale = 0.4;
        opacity = 0.2;
        zIndex = 10;
        blur = 4;
      }
  
      transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`;
  
      return {
        transform,
        opacity,
        zIndex,
        filter: `blur(${blur}px)`,
      };
    };
  
    useEffect(() => {
      AOS.init({
        duration: 1000,
        once: false,
        mirror: true,
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
    <div className='overflow-hidden'>
    <section className="bg-black text-white" data-aos="zoom-in" data-aos-duration="3000">
        <div className="container mx-auto sm:!px-6 !px-4 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Join in our group to <span className='text-themedark'>Work</span></h1>
            <p className="text-lg max-w-2xl mx-auto">Join a group of people that help in changing future. We are looking to add people in commit and motivate them to develop</p>
        </div>
    </section>

    <section className="bg-black text-white container mx-auto sm:!px-6 !px-4 py-12">
        <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 transform hover:scale-105 transition duration-500 ease-in-out"  data-aos="zoom-in" data-aos-duration="3000">
                <img src={career} alt="Team" className="rounded-2xl shadow-2xl w-full" style={{ boxShadow: "0 15px 35px rgba(0,0,0,0.6)" }}/>
            </div>
            <div className="flex-1" data-aos="zoom-in" data-aos-duration="3000">
                <h2 className="text-3xl font-semibold mb-4">What Makes You Join Our Team?</h2>
                <p className="mb-6 text-gray-300">We create a welcoming atmostphere that inspire uniqueness, originality and personal identity. By providing flexible work time-table and continuos support for there proffessional growth, We try to give our employees get success in an fronts.</p>
                <ul className="space-y-3 text-lg">
                    <li className="flex items-center gap-2"><GiCheckMark /> A cooperative and team-oriented culture.</li>
                    <li className="flex items-center gap-2"><GiCheckMark /> Flexibility in your schedule to fit your lifestyle.</li>
                    <li className="flex items-center gap-2"><GiCheckMark /> An surrounding that support work lightly.</li>
                    <li className="flex items-center gap-2"><GiCheckMark /> Make a clear way for education and carrer progression.</li>
                </ul>
            </div>
        </div>
    </section>
        
    <div className="container mx-auto overflow-hidden sm:!px-6 !px-4 py-12">
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div  ref={sliderRef} className="relative w-full h-96 mb-16" style={{ perspective: '2000px', perspectiveOrigin: 'center center' }} onMouseEnter={() => setIsAutoPlaying(false)} onMouseLeave={() => setIsAutoPlaying(true)}>
          <button onClick={goToPrevious} className="absolute left-8 top-1/2 transform -translate-y-1/2 z-50 group">
            <div className=" backdrop-blur-lg border border-white/30 rounded-full p-2 transition-all duration-300">
              <ChevronLeft className="w-6 h-6 text-white transition-colors" />
            </div>
          </button>
          <button onClick={goToNext} className="absolute right-8 top-1/2 transform -translate-y-1/2 z-50 group">
            <div className="backdrop-blur-lg border border-white/30 rounded-full p-2 transition-all duration-300">
              <ChevronRight className="w-6 h-6 text-white transition-colors" />
            </div>
          </button>
          <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            {slides.map((slide, index) => {
              const style3D = get3DTransform(index);
              const isActive = index === currentIndex;
              return (
                <div
                  key={index}
                  className={`absolute sm:w-80 sm:h-80 w-60 h-60 cursor-pointer transition-all duration-1000 ease-out ${
                    isActive ? 'hover:scale-105' : 'hover:scale-110'
                  }`}
                  style={{
                    ...style3D,
                    transformStyle: 'preserve-3d',
                  }}
                  onClick={() => goToSlide(index)}>
                  <div className="relative w-full h-full group">
                    <div className={`absolute inset-0 rounded-3xl ${slide.color} p-1 shadow-2xl`}>
                      <div className="w-full h-full rounded-2xl overflow-hidden bg-black/20 backdrop-blur-sm">
                        <img src={slide.src} alt={slide.title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-2xl font-bold mb-2 tracking-wide">{slide.title}</h3>
                          <p className="text-cyan-200 text-sm font-medium">{slide.subtitle}</p>
                          {isActive && (
                            <div className="mt-3 w-12 h-0.5 bg-gradient-to-r from-white to-cyan-300 rounded-full"></div>
                          )}
                        </div>
                        {isActive && (
                          <div className="absolute inset-0 from-white/20 via-transparent to-transparent rounded-2xl"></div>
                        )}
                      </div>
                    </div>
                    <div className={`absolute inset-0 rounded-3xl ${slide.color} opacity-30 blur-xl`} style={{ transform: 'translateZ(-20px) scale(0.9)' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-center space-y-8">
          <div className="flex space-x-4">
            {slides.map((_, index) => (
              <button key={index} onClick={() => goToSlide(index)} className={`transition-all duration-500 rounded-full ${index === currentIndex ? 'w-12 h-3 bg-gradient-to-r from-cyan-400 to-purple-400 shadow-lg shadow-cyan-500/50' : 'w-3 h-3 bg-white/30 hover:bg-white/50 hover:scale-125'}`}/>
            ))}
          </div>
        </div>
      </div>
    </div>

    <section className="bg-black text-white">
        <div className="container mx-auto py-12 sm:!px-6 !px-4">
            <h2 className="text-3xl font-semibold mb-10 text-center">Open Positions</h2>
            <div className="flex flex-wrap justify-center gap-8">
                <div className="flex flex-col justify-between border border-gray-700 rounded-2xl p-6 w-full md:w-[300px] transform transition duration-500 hover:scale-105 hover:shadow-2xl"
                    style={{ boxShadow: "0 8px 25px rgba(0,0,0,0.4)"}} data-aos="flip-left" data-aos-duration="3000">
                    <h3 className="text-xl font-semibold mb-2">Frontend Developer</h3>
                    <p className="mb-4 text-gray-400">Remote • Full-time</p>
                    <p className="mb-6 text-gray-300">Use modern web technologies to create responsive, user-focused interfaces.</p>
                    <a href="#" className="inline-block px-4 py-2 border border-gray-500 rounded-lg transition">Apply Now</a>
                </div>

                <div className="flex flex-col justify-between border border-gray-700 rounded-2xl p-6 w-full md:w-[300px] transform transition duration-500 hover:scale-105 hover:shadow-2xl"
                    style={{ boxShadow: "0 8px 25px rgba(0,0,0,0.4)"}} data-aos="flip-left" data-aos-duration="3000">
                    <h3 className="text-xl font-semibold mb-2">UI/UX Designer</h3>
                    <p className="mb-4 text-gray-400">New York, NY • Hybrid</p>
                    <p className="mb-6 text-gray-300">Craft visually appealing and easy-to-use product experiences.</p>
                    <a href="#" className="inline-block px-4 py-2 border border-gray-500 rounded-lg transition">Apply Now</a>
                </div>

                <div className="flex flex-col justify-between border border-gray-700 rounded-2xl p-6 w-full md:w-[300px] transform transition duration-500 hover:scale-105 hover:shadow-2xl"
                    style={{boxShadow: "0 8px 25px rgba(0,0,0,0.4)"}} data-aos="flip-left" data-aos-duration="3000">
                    <h3 className="text-xl font-semibold mb-2">Backend Engineer</h3>
                    <p className="mb-4 text-gray-400">Remote • Full-time</p>
                    <p className="mb-6 text-gray-300">Develop robust APIs with a focus on scalability, speed, and security.</p>
                    <a href="#" className="inline-block px-4 py-2 border border-gray-500 rounded-lg transition">Apply Now</a>
                </div>
            </div>
        </div>
    </section>

    <section className="container mx-auto sm:!px-6 !px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 text-white">
            <div className='w-full' data-aos="zoom-in" data-aos-duration="3000">
                <p className="tracking-widest text-sm">[ OUR PRINCIPLES ]</p>
                <h1 className="text-3xl md:text-[40px] font-semibold mt-2"> <span className='text-themedark'>Coding</span> ≥ ∀ x ∀ x</h1>
            </div>
            <p className="md:max-w-lg w-full" data-aos="zoom-in" data-aos-duration="3000">We thrive on ambitious goals, quick decisions, and an unwavering will to get things done quickly. We'd love to have you on board if you're excited to contribute to the development of AI models and products in the future.</p>
        </div>

        <div className="grid md:grid-cols-3 gx-8 mt-16 pt-2 sm:pt-12">
            {/* <div className="flex flex-col gap-12  "> */}
                <div data-aos="zoom-in" data-aos-duration="3000" className='md:border-r  text-white border-gray-800 pr-8 p-4'>
                    <div className="text-2xl mb-7"><FaRegUser className='text-3xl' /></div>
                    <h3 className="font-semibold text-lg mb-4">Appealing Salary</h3>
                    <p className="text-gray-400 text-md mt-1">In order to draw in and keep the top individuals in the business, we provide attractive stock and compensation packages.</p>
                </div>
                <div data-aos="zoom-in" data-aos-duration="3000" className='md:border-r  text-white border-gray-800 pr-8  p-4'>
                    <div className="text-2xl mb-7"><IoCalendarOutline className='text-3xl' /></div>
                    <h3 className="font-semibold text-lg mb-4">Adaptable Vacation Time</h3>
                    <p className="text-gray-400 text-md mt-1">	We support a good work-life balance. We don't want burnout, so take the time you need to rest.</p>
                </div>
            {/* </div> */}

            {/* <div className="flex flex-col gap-12 md:border-r text-white border-gray-800 pr-8"> */}
                <div data-aos="zoom-in" data-aos-duration="3000" className='p-4 text-white'>
                    <div className="text-2xl mb-7"><LuStethoscope className='text-3xl' /></div>
                    <h3 className="font-semibold text-lg mb-4">Wellness & Health</h3>
                    <p className="text-gray-400 text-md mt-1">To promote your general well-being, we offer comprehensive health coverage, including dental, vision, medical, and disability insurance.</p>
                </div>
                <div data-aos="zoom-in" data-aos-duration="3000" className='md:border-r  text-white border-gray-800 pr-8 p-4'>
                    <div className="text-2xl mb-7"><TbWorld className='text-3xl' /></div>
                    <h3 className="font-semibold text-lg mb-4">Visa Support</h3>
                    <p className="text-gray-400 text-md mt-1">Visa Support To help you join our team, we welcome talent from around the world and provide visa sponsorship.</p>
                </div>
            {/* </div> */}

            {/* <div className="flex flex-col gap-12 text-white"> */}
                <div data-aos="zoom-in" data-aos-duration="3000" className='md:border-r  text-white border-gray-800 pr-8 p-4'>
                    <div className="text-2xl mb-7"><GiSelfLove className='text-3xl' /></div>
                    <h3 className="font-semibold text-lg mb-4">Support for Life and Family</h3>
                    <p className="text-gray-400 text-md mt-1">Our benefits, which provide you and your loved ones with peace of mind, include fertility support, life and AD&D insurance, and more.</p>
                </div>
                <div data-aos="zoom-in" data-aos-duration="3000" className='text-white p-4' >
                    <div className="text-2xl mb-7"><FaRegClock className='text-3xl' /></div>
                    <h3 className="font-semibold text-lg mb-4">Planning for Retirement</h3>
                    <p className="text-gray-400 text-md mt-1">Our 401(k) plan assists you in getting ready for a healthy and safe financial future.</p>
                </div>
            {/* </div> */}
        </div>
    </section>

    <CareerAcc />
    </div>
  )
}

export default Career