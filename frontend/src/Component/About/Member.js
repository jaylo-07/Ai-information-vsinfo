import React, { useEffect, useState } from 'react'
import AOS from "aos";
import "aos/dist/aos.css";
import { JigsawPuzzle } from 'react-jigsaw-puzzle';
import team from '../../Asset/About/about_group.jpg'


import toast from 'react-hot-toast';

const Member = () => {

  const [hovered, setHovered] = useState(false);

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
    <section className='bg-black overflow-hidden'>
      <div className='sm:pt-10 pt-5'>
        <div className='container mx-auto'>
          <div className='flex gap-4 lg:flex-nowrap flex-wrap rounded-[30px] overflow-hidden 2xl:mx-10 mx-5'>
            <div className="lg:w-1/2 w-full relative overflow-hidden" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
              <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${hovered ? "opacity-100" : "opacity-0"}`}>
                <img src={team} alt="Team Merged" className="w-full h-full object-cover" />
              </div>
              <div className={`transition-opacity duration-700 ease-in-out ${hovered ? "opacity-0 cursor-pointer" : "opacity-100"}`}>
                <JigsawPuzzle imageSrc={team} rows={3} columns={3} onSolved={() => toast.success("Puzzle solved!")} className="h-full object-cover" />
              </div>
            </div>
            <div className='lg:w-1/2 w-full bg-[#222222] lg:mt-0  mt-5'>
              <div className='sm:p-[65px] sx:p-[35px] p-[20px] text-white'>
                <p data-aos="fade-left">Mentorship programs</p>
                <h3 className="text-white text-[22px] sm:text-[32px] md:text-[40px] lg:text-[40px] sm:leading-[46px] leading-[28px] mt-4 md:block hidden" data-aos="fade-left" >Get hands-on experience with <span className='text-themedark'>AI</span> <br></br> research</h3>
                <h3 className="text-white text-[22px] sm:text-[32px] md:text-[40px] lg:text-[40px] sm:leading-[46px] leading-[28px] mt-4 md:hidden block" data-aos="fade-left" >Get hands-on experience with <span className='text-themedark'>AI</span> <br></br> research</h3>
                <p className='sm:text-[16px] text-[14px] xl:mt-10 mt-5 sm:pt-4' data-aos="fade-left" >Building true competence requires experience learning, also known as hands-on learning. You interact actively with projects, resources, and settings as opposed to only reading or listening, which strengthens comprehension and encourages creativity. The usefulness of this approach is well known: information gained by doing is more robust and long-lasting.</p>
                {/* <p className='sm:text-[16px] text-[14px] mt-5' data-aos="fade-left" >We currently have agreements in place with prestigious universities in the United States, France, Israel and the United Kingdom.</p>
                            <p className='mt-10 sm:pt-4 sm:text-[18px] text-[16px] font-[600]' data-aos="fade-left" >For more about these programs, reach out to us at MetaAIM@meta.com</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Member
