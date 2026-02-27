import React from 'react';
import { IoMdMail } from "react-icons/io";
import { BsTwitterX, BsFillTelephoneFill } from "react-icons/bs";
import { FaInstagram, FaYoutube, FaLinkedin, FaMapMarkerAlt } from "react-icons/fa";
import canada from '../Asset/canada.svg';
import logo from '../Asset/logo.svg';
import gemini from '../Asset/Footer/Gemini.svg';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="bg-[#050505] text-white font-sans relative overflow-hidden">
      {/* Top Gradient Border */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[rgba(157,0,255,0.6)] to-transparent"></div>

      {/* Background glow effects */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-themedark rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF00AA] rounded-full mix-blend-multiply filter blur-[128px] opacity-10 pointer-events-none"></div>

      <footer className="container mx-auto pb-5 pt-16 sm:!px-6 !px-4 relative z-10">
        <div className="flex flex-col xl:flex-row justify-between gap-12 xl:gap-8">

          {/* Brand Column */}
          <div className="w-full xl:w-2/5 flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <img src={logo} alt="Company Logo" className="w-24 h-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Build AI responsibly to<br />benefit humanity
                </h2>
              </div>
            </div>

            <p className="text-[#9aa0a6] text-sm md:text-base leading-relaxed pr-0 md:pr-10 text-center md:text-left">
              We provide end-to-end AI solutions, including platforms, models, and strategies, optimized for cost, performance, and security.
            </p>

            {/* Social Links */}
            {/* <div className="flex items-center gap-4 mt-2">
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:border-themedark hover:bg-themedark/20 hover:text-white text-gray-400 transition-all duration-300 hover:-translate-y-1 shadow-lg">
                <BsTwitterX className="text-xl" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:border-themedark hover:bg-themedark/20 hover:text-white text-gray-400 transition-all duration-300 hover:-translate-y-1 shadow-lg">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:border-themedark hover:bg-themedark/20 hover:text-white text-gray-400 transition-all duration-300 hover:-translate-y-1 shadow-lg">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:border-themedark hover:bg-themedark/20 hover:text-white text-gray-400 transition-all duration-300 hover:-translate-y-1 shadow-lg">
                <FaYoutube className="text-xl" />
              </a>
            </div> */}
          </div>

          {/* Links & Models Wrapper */}
          <div className="w-full xl:w-3/5 flex flex-col md:flex-row justify-between gap-10 lg:gap-6">

            {/* Models Column */}
            <div className="flex-1  text-center md:text-left">
              <h3 className="text-lg font-semibold tracking-wide text-white mb-6 relative inline-block">
                Models
                <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-themedark rounded-full shadow-[0_0_8px_rgba(157,0,255,0.8)]"></span>
              </h3>
              <p className="text-sm text-[#9aa0a6] font-medium mb-6">Build with our next generation AI systems</p>
              <div className="flex justify-center md:justify-start">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://ai.vsinfotech.ca"
                  className="group flex items-center justify-center md:justify-start gap-3 w-fit p-2 rounded-lg hover:bg-white/5 transition-colors duration-300"
                >
                  <img
                    src={gemini}
                    alt="Vsinfo AI"
                    className="w-8 h-8 rounded drop-shadow-[0_0_5px_rgba(255,255,255,0.3)] group-hover:drop-shadow-[0_0_10px_rgba(157,0,255,0.5)] transition-all"
                  />
                  <span className="text-lg text-gray-300 group-hover:text-white font-medium transition-colors">
                    Vsinfo AI
                  </span>
                  <svg
                    className="w-5 h-5 text-themedark opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-semibold tracking-wide text-white mb-6 relative inline-block">
                Company
                <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-themedark rounded-full shadow-[0_0_8px_rgba(157,0,255,0.8)]"></span>
              </h3>
              <ul className="space-y-2">
                {['Home', 'About', 'Career', 'Contact Us'].map((item, idx) => (
                  <li key={idx}>
                    <Link
                      to={item === 'Home' ? '/' : item === 'Contact Us' ? '/contact' : `/${item.toLowerCase()}`}
                      className="text-gray-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-2 group transition-all duration-300 text-base font-medium"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-themedark opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div className="flex-1 md:max-w-xs text-center md:text-left">
              <h3 className="text-lg font-semibold tracking-wide text-white mb-6 relative inline-block">
                Contact Office
                <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-themedark rounded-full shadow-[0_0_8px_rgba(157,0,255,0.8)]"></span>
              </h3>

              <div className="flex flex-col items-center md:items-start gap-5 bg-white/[0.02] border border-white/5 p-5 rounded-2xl hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300">
                <div className="flex items-center gap-3">
                  <img src={canada} alt="Canada Flag" className="" />
                  <h4 className="font-semibold text-white text-lg">Canada</h4>
                </div>

                <div className="flex items-start gap-3 mt-1">
                  <FaMapMarkerAlt className="text-themedark mt-1 shrink-0 text-lg" />
                  <a href="https://goo.gl/maps/xyz..." target="_blank" rel="noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors leading-relaxed">
                    855 King Street East, Unit 210<br />Cambridge, ON, Canada
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <BsFillTelephoneFill className="text-themedark shrink-0 text-md" />
                  <a href="tel:+15198817124" className="text-sm text-gray-400 hover:text-white transition-colors">+1 519 881 7124</a>
                </div>

                <div className="flex items-center gap-3">
                  <IoMdMail className="text-themedark shrink-0 text-lg" />
                  <a href="mailto:info@vsinfotech.ca" className="text-sm text-gray-400 hover:text-white transition-colors">info@vsinfotech.ca</a>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-16 pt-6 border-t border-gray-800/60 text-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} VsInfo AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Footer;
