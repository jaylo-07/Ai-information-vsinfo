import React, { useEffect, useRef, useState } from "react";
import DotParticleCanvas from "../../reactBeats/DotParticleCanvas";
import TextType from "../../reactBeats/TextType";
import CurvedLoop from "../../reactBeats/CurvedLoop";
import Aos from "aos";



import "aos/dist/aos.css";
import "../../style/Sujal.css"
import { CanvasConfettiCursor } from "../../reactBeats/CanvasConfettiCursor";
import video from '../../Asset/Home/team.mp4'
import { Link } from "react-router-dom";





const Introduction = () => {
    useEffect(() => {
        Aos.init({ duration: 2000, once: true }); // 1s animation, triggers once
    }, [])
    const containerRef = useRef(null);

    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleTogglePlay = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };


    return (
        <>
            <div
                ref={containerRef}
                className="relative xl:h-[900px] md:h-[600px] h-[500px] w-full bg-themeblack overflow-hidden"
            >
                {/* Particle Background */}
                <div className="absolute inset-0 z-0">
                    <DotParticleCanvas containerRef={containerRef} />
                </div>

                {/* Confetti */}
                <div className="absolute inset-0 pointer-events-none">
                    <CanvasConfettiCursor
                        containerRef={containerRef}
                        fillParent={true}
                        colors={["#9D00FF", "#FF00AA"]}
                        overlayOpacity={0.5} // reduce opacity
                    />
                </div>

                {/* Foreground Text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 2xl:px-8 px-3 xl:w-[50%] md:w-[70%] w-full m-auto flex items-center justify-center  flex-col ">
                    <h2 className="2xl:text-5xl md:text-3xl  text-2xl font-semibold text-white text-center md:mb-5 mb-3 2xl:leading-[60px]" data-aos="fade-up">Create with <span className="text-themedark">AI</span> to produce measurable commercial results. </h2>
                    <p className="text-[#f0f0f0] text-center sm:text-base text-xs  md:mb-5 mb-3  px-5" data-aos="fade-up" >We extand and provide end-to-end AI solutions, including platforms, models, and strategies, that are optimized for cost, performance, and security in both on-premises and cloud environments.</p>
                    <p className="text-[#f0f0f0] text-center sm:text-base text-xs md:mb-5 mb-3  px-5" data-aos="fade-up">From automation and analytics to computer vision and generative AI, our experts help businesses expand safely and speed up time-to-value.</p>
                    <Link to="/contact" className="md:w-[200px] w-[100px] bg-themedark rounded-full text-white hover:bg-white hover:text-themedark hover:font-extrabold mt-[20px]  cursor-pointer" data-aos="fade-up">
                        <p className="p-3 md:text-lg text-sm text-center">Contact Us</p>
                    </Link>
                </div>
            </div>
            <section className="bg-black text-white pt-8 lg:pt-16 container" >
                <div className=" mx-auto grid lg:grid-cols-2 grid-cols-1 gap-8 items-center" > 

                    <div data-aos="fade-up">
                        <h1 className="2xl:text-5xl md:text-3xl  text-2xl font-semibold text-white md:mb-5 mb-3 2xl:leading-[60px] ">
                            
                        Empowering Business Outcomes <br></br>with  <span className="text-themedark "> AI & Data Analytics</span>
                        </h1>

                        

                        <p className="text-[#f0f0f0]  sm:text-base text-xs md:mb-5 mb-3  " data-aos="fade-up" >
                        Cloud-based generative AI and advanced data analytics are revolutionizing the commercial world. This change cannot be undone. Opportunities in the future will push businesses to become more intelligent, autonomous, and networked. Through strategic collaborations, they will create a digitally integrated ecosystem in which businesses work together symbiotically to provide value to customers, residents, and consumers.
                        </p>

                   


                    </div>

                    <div className="relative w-full" data-aos="fade-up">
                        <video
                            ref={videoRef}
                            src={video}
                            className="rounded-lg shadow-lg"
                        />
                        <button
                            onClick={handleTogglePlay}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className={`bg-themedark rounded-full p-4 hover:bg-themedark transition ${isPlaying ? 'hidden' : null}`}>
                                {isPlaying ? (
                                    // Pause Icon
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="white"
                                        viewBox="0 0 24 24"
                                        className="w-8 h-8"
                                    >
                                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                    </svg>
                                ) : (
                                    // Play Icon
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="white"
                                        viewBox="0 0 24 24"
                                        className="w-8 h-8"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </section>
        </>

    );
};

export default Introduction;
