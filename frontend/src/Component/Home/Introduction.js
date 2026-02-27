import React, { useEffect, useRef, useState } from "react";
import DotParticleCanvas from "../../reactBeats/DotParticleCanvas";
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
                    <div className="flex sm:flex-row flex-col items-center justify-center gap-4 sm:gap-6 mt-6 md:mt-8">
                        <Link
                            to="https://ai.vsinfotech.ca"
                            target="_blank"
                            className="group relative inline-flex items-center justify-center md:w-[220px] w-[180px] px-6 py-3.5 text-base md:text-lg font-bold text-white transition-all duration-300 bg-themedark rounded-full overflow-hidden shadow-[0_0_15px_rgba(157,0,255,0.4)] hover:shadow-[0_0_30px_rgba(157,0,255,0.8)] hover:-translate-y-1"
                        >
                            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-white to-transparent h-px opacity-50"></span>
                            <span className="absolute inset-x-0 w-1/2 mx-auto -top-px bg-gradient-to-r from-transparent via-white to-transparent h-px opacity-50"></span>
                            <span className="relative flex items-center justify-center gap-2">
                                VsInfo AI
                                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </span>
                        </Link>

                        <Link
                            to="/contact"
                            className="group relative inline-flex items-center justify-center md:w-[220px] w-[180px] px-6 py-3.5 text-base md:text-lg font-bold text-white transition-all duration-300 border border-white/20 hover:border-white/60 bg-white/5 backdrop-blur-sm rounded-full hover:bg-white/10 overflow-hidden hover:-translate-y-1"
                        >
                            <span className="relative flex items-center justify-center gap-2">
                                Contact Us
                                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </span>
                        </Link>
                    </div>
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
