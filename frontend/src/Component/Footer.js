import React from 'react'

import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { FiChevronRight } from "react-icons/fi";
import { IoMdMail } from "react-icons/io";
import canada from '../Asset/canada.svg'
import logo from '../Asset/logo.svg'


import gemini from '../Asset/Footer/Gemini.svg'
import gemma from '../Asset/Footer/Gemma.svg'
import veo from '../Asset/Footer/Veo.svg'
import imagen from '../Asset/Footer/Imagen.svg'
import lyria from '../Asset/Footer/Lyria.svg'
import alphaFold from '../Asset/Footer/Alphafold.svg'
import synthId from '../Asset/Footer/SynthId.svg'
import weatherNext from '../Asset/Footer/Weathernext.svg'
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
   <div className="bg-black text-white font-sans">
  <footer className="container mx-auto border-t border-gray-800 py-12 sm:!px-6 !px-4">
    {/* <div className="flex flex-wrap items-center gap-4 mb-8">
      <span className="text-xl">Follow us</span>
      <a href="#"><BsTwitterX className='text-3xl' /></a>
      <a href="#"><FaInstagram className='text-3xl' /></a>
      <a href="#"><FaYoutube className='text-3xl' /></a>
      <a href="#"><FaLinkedin className='text-3xl' /></a>
      <a href="#"><FaGithub className='text-3xl' /></a>
    </div> */}
    <div className="flex flex-col lg:flex-row gap-10">
      <div className='flex w-full lg:w-1/3'>
      <img src={logo} alt="" className='w-28 h-20' />
      <div className=''>
        <h2 className="sm:text-2xl text-xl lg:text-3xl font-semibold mb-2 text-[#9aa0a6]">Build AI responsibly to<br />benefit humanity</h2>
      </div>
      </div>
      <div className='md:flex lg:w-1/2 w-full justify-between'>

      <div className="w-full sm:w-2/3 xl:w-1/3 flex flex-col sm:flex-row lg:flex-col gap-6">
        <div>
          <h3 className="text-sm tracking-wide mb-1">Models</h3>
          <p className='text-sm text-[#9aa0a6] font-medium mb-4'>Build with our next generation AI systems</p>
          <ul className="space-y-2 text-xl">
            <li><a href="http://yoyoai.ca/"><img src={gemini} alt="" className='w-8 me-2 inline-block' /><span>Gemini</span></a></li>
            {/* <li><img src={gemma} alt="" className='w-8 me-2 inline-block' /><span>Gemma</span></li>
            <li><img src={veo} alt="" className='w-8 me-2 inline-block'/> <span>Veo</span></li>
            <li><img src={imagen} alt="" className='w-8 me-2 inline-block' /><span>Imagen</span></li>
            <li><img src={lyria} alt="" className='w-8 me-2 inline-block' /><span>Lyria</span></li> */}
          </ul>
        </div>
        <div className='xl:me-0 sm:me-auto'>
          <h3 className="text-sm tracking-wide text-[#f1f3f4] mb-4">Learn more</h3>
          <ul className="space-y-2 text-xl">
          <li><Link to={'/'} >Home</Link></li>
            <li><Link to={'/about'} >About</Link></li>
            <li><Link to={'/career'} >Career</Link></li>
            <li><Link to={'/contact'}>Contact Us </Link></li>
          </ul>
        </div>
      </div>
      <div className='lg:w-1/3 mt-6'>
        {/* <h3 className="text-sm tracking-wide mb-4">Science</h3>
        <p className='text-sm text-[#9aa0a6] font-medium mb-4'>Unlocking a new era of discovery with AI
        </p>
        <ul className="space-y-2 text-xl mb-6">
          <li><img src={alphaFold} alt="" className='w-8 inline-block' /> AlphaFold</li>
          <li><img src={synthId} alt="" className='w-8 inline-block' /> SynthID</li>
          <li><img src={weatherNext} alt="" className='w-8 inline-block'/> WeatherNext</li>
        </ul> */}
        {/* <div className="bg-black text-white rounded-lg max-w-md mb-4">
          <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
              <path d="M12 2l9 4.5v2h-18v-2l9-4.5zm9 8.5v11.5h-18v-11.5h18zm-11 2h-2v7h2v-7zm5 0h-2v7h2v-7z"/>
            </svg>
            <h2 className="font-bold text-lg">India</h2>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.09 15.09 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.2.48 2.52.74 3.88.74a1 1 0 011 1v3.5a1 1 0 01-1 1C10.07 21.21 2.79 13.93 2.79 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.36.26 2.68.74 3.88a1 1 0 01-.21 1.11l-2.2 2.2z"/>
            </svg>
            <a href="tel:+919328881036" className="hover:underline">+91 93288 81036</a>
          </div>
          <a href='https://www.google.com/maps/place/Kalathiya+Infotech/@21.2057926,72.8818075,132m/data=!3m1!1e3!4m9!1m2!2m1!1s102-103+Silver+Point,+Jivanjyot+Circle,+Nr+Yogi+chowk+Road+Surat+-395010!3m5!1s0x26cb5e4230fc8877:0xd36ccfe485cd6a01!8m2!3d21.2058961!4d72.8817848!16s%2Fg%2F11kbyh9bk6?entry=ttu&g_ep=EgoyMDI1MDgxMy4wIKXMDSoASAFQAw%3D%3D' target="_blank" className="text-gray-300 mb-4">102–103 Silver Point, Jivanjyot Circle, <br />Nr Yogi chowk Road Surat –395010 <br />(Head Office)</a><br />
          <a href='https://www.google.com/maps/place/Shyam+Mandir+Rd,+Hukmchand+Nagar,+Althan,+Surat,+Gujarat+395007/@21.1457601,72.8003485,1060m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3be05203d87284f1:0xc550f071f2d34a38!8m2!3d21.1457601!4d72.8003485!16s%2Fg%2F11f2v569v2?entry=ttu&g_ep=EgoyMDI1MDgxMy4wIKXMDSoASAFQAw%3D%3D' target='_blank' className="text-gray-300">402–405 Astha Shoppers NearBy <br />BhagvanMahavir Collage, Vesu, Surat –395007 <br />(Branch)</a>
        </div> */}
        <div className=" text-white rounded-lg max-w-sm">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-white text-lg"><img src={canada} alt="" /></span>
            <h2 className="font-semibold text-lg">Canada</h2>
          </div>
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-white text-xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.09 15.09 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.2.48 2.52.74 3.88.74a1 1 0 011 1v3.5a1 1 0 01-1 1C10.07 21.21 2.79 13.93 2.79 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.36.26 2.68.74 3.88a1 1 0 01-.21 1.11l-2.2 2.2z"/>
              </svg>
            </span>
            <a href="tel:+1 5198817124" className="text-sm text-gray-200">+1 5198817124</a>
          </div>
          <a href='https://www.google.com/maps/place/855+King+St+E+%23210,+Cambridge,+ON+N3H+3P2,+Canada/@43.3946841,-80.3558498,826m/data=!3m2!1e3!4b1!4m5!3m4!1s0x882b89f0377066e3:0x13fe980777df8121!8m2!3d43.3946841!4d-80.3558498?entry=ttu&g_ep=EgoyMDI1MDgxMy4wIKXMDSoASAFQAw%3D%3D' target='_blank' className=" text-gray-300 mb-3">855 King Street East, Unit 210 <br />Cambridge, ON, Canada (Branch)</a>
          <div className="flex items-center space-x-3 mt-3">
            <span className="text-white text-xl"><IoMdMail /></span>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=info@vsinfotech.ca" target="_blank" className="text-gray-200 hover:text-blue-400">info@vsinfotech.ca</a>
          </div>
        </div>
      </div>
      </div>
    </div>
    {/* <div className="border-t border-gray-800 mt-8 pt-6 flex flex-wrap gap-4 text-sm text-gray-400">
      <span className='text-2xl'>Google</span>
      <a href="#" className="hover:text-gray-200 text-lg">About Google</a>
      <a href="#" className="hover:text-gray-200 text-lg">Google products</a>
      <a href="#" className="hover:text-gray-200 text-lg">Privacy</a>
      <a href="#" className="hover:text-gray-200 text-lg">Terms</a>
    </div> */}
  </footer>
</div>

    </>
  )
}

export default Footer
