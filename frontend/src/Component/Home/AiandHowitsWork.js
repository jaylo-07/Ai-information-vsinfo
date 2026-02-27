import React, { useState } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import * as motion from "motion/react-client"
import robot from '../../Asset/Home/robot1.png'
import ai1 from '../../Asset/Home/ai1.png'
import ai2 from '../../Asset/Home/ai2.webp'
import ai3 from '../../Asset/Home/ai3.png'
import ai4 from '../../Asset/Home/ai4.png'
import ai5 from '../../Asset/Home/ai5.png'
import ai6 from '../../Asset/Home/ai6.png'
import step1 from '../../Asset/Home/step1.png'
import step2 from '../../Asset/Home/step2.png'
import step3 from '../../Asset/Home/step3.png'
import step4 from '../../Asset/Home/step4.png'

const aiDetails = [
    {
        title: 'Genertaive AI ',
        img: ai1,
        description: [
            'Uses existing patterns to create new content, such as text, images, and sound.',
            'Makes use of advanced language models (LLMs), GANs, and VAEs, among other model types.',
            'Used for activities including simulation, multimedia production, and creative design.',
            'Mimics human ingenuity by using vast datasets.',
            'Raises moral concerns about partiality, abuse, and genuineness.'
        ]
    },
    {
        title: 'Data Science',
        img: ai2,
        description: [
            'Uses both organized and unstructured data to get insightful information.',
            'Combines domain-specific knowledge, programming abilities, and statistical analysis.',
            'Uses tools including visualization platforms, R, Python, and SQL.',
            'Includes tasks including modeling, analysis, and data cleaning.',
            'Supports decision-making in a number of industries, such as banking and healthcare.'
        ]
    },
    {
        title: 'Inference',
        img: ai3,
        description: [
            'Uses fresh data to run learned AI models right at the source.',
            'Laces a high value on accuracy, speed, and resource efficiency.',
            'May be set up on cloud platforms, local devices, or a mix of the two.',
            'It requires a vital AI-driven application for making decision quickly.',
            'It balance between profitability,presentation and scalability.'
        ]
    },
    {
        title: 'Conversational AI',
        img: ai4,
        description: [
            'Enables machines to comprehend and interact with human language.',
            'Comprises technological tools such chatbots, virtual assistants, and speech agents.',
            'Makes use of Natural Language Processing (NLP) and Natural Language Understanding (NLU) to converse similarly to a person.',
            'Enhances customer service, automation, and customisation in a number of industries.',
            'Improves automation, personalization, and customer service across a variety of sectors.'
        ]
    },
    {
        title: 'Vision AI',
        img: ai5,
        description: [
            'Makes it possible for machines to comprehend and analyze visual data.',
            'Makes use of deep learning models and computer vision techniques.',
            'Supports optical character recognition (OCR), object detection, and facial recognition.',
            'Utilized in medical imaging, security systems, and driverless cars.',
            'Encounters difficulties with prejudice, accuracy, and privacy issues.'
        ]
    },
    {
        title: 'Cybersecurity AI',
        img: ai6,
        description: [
            'Makes use of artificial intelligence to recognize, stop, and address online threats.',
            'Examines network patterns to find imperfections that might be signs of danger.',
            'Employs predictive analytics to anticipate and mitigate possible cyberthreats.',
            'Automatically reacts to virus infection, cyber attack,  internet fraud.',
            'Adjusts to action changing strategies used by cybercriminals.'
        ]
    }
];
const steps = [
    {
        number: 1,
        img:ai1,
        icon: step1,
        title: "Safely connect your tools",
        description: [
            "Datasets or APIs after making your account in few minutes.",
            "In order to protect personal data and enable, seamless integration for safety.",
        ]
    },
    {
        number: 2,
        img:ai1,
        icon: step2,
        title: "After exploring your data",
        description: [
            " Our advanced algorithms find important trends by Ai's skills",
            " We utilized your data which helps you to make beneficial decisions quickly.",
        ]
    },
    {
        number: 3,
        img:ai1,
        icon: step3,
        title: "After exploring your data",
        description: [
            "Our worldly-wise algorithms find pattern trends and upcoming trends to give you helpful suggestions.",
            "We help you make well-informed decisions quickly by providing predictive analytics and automated workflows."
        ]
    },
    {
        number: 4,
        img:ai1,
        icon: step4,
        title: "As time goes ",
        description: [
            "Our AI gets more precise as it everytime adjust based on every contact.",
            "Without any extra effort you can see continuously improvement in your result."
        ]
    }
];
const transition= {
    duration: 4,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
}
const AiandHowitsWork = () => {
    const [selectStep, setSelectStep] = useState(0);

    return (
        <div className="container relative overflow-hidden">
            <div className="bg-black  pt-8 lg:pt-16 ">
                <h2 className="2xl:text-5xl md:text-3xl  text-2xl font-semibold text-white text-center md:mb-5 mb-3 2xl:leading-[60px] py-5" data-aos="fade-up"><span className="text-themedark fond-extrabold">Artificial </span> Intelligence</h2>
                
                <article class="card__container container  ">
                    {aiDetails.map((item) => {
                        return (
                            <div class="card mobile p-3 py-5 cursor-pointer" data-aos="flip-left" data-aos-easing="ease-out-cubic" data-aos-duration="2000" tabindex="0" style={{ backgroundImage: `url(${item.img})` }}>
                                <div className="relative z-10 card_detail">
                                    <h3 className="text-3xl text-white text-center underline">{item.title}</h3>
                                    <ul className="text-[#D3D3D3]   sm:text-base text-xs text-center h-full py-8">
                                        {item.description.map((des) => {
                                            return (
                                                <li className="mb-2">{des}</li>
                                            )
                                        })}
                                        <li></li>
                                    </ul>
                                </div>
                            </div>
                        )
                    })}
                </article>
            </div>
            <div className=" bg-black  pt-8 lg:pt-16 ">
                <div>
                    <h2 className="2xl:text-5xl md:text-3xl  text-2xl font-semibold text-white text-center md:mb-5 mb-3 2xl:leading-[60px]" data-aos="fade-up"><span className="text-themedark fond-extrabold">How it works</span></h2>
                    <p className="text-[#f0f0f0] text-center sm:text-base text-xs  md:mb-5 mb-3  px-5" data-aos="fade-up" > Our AI-powered company enables you to attain superior outcomes through intelligent automation.</p>
                    {/* <h2 className="text-3xl font-bold text-white text-center mb-2 w-full ">
                        How it works
                    </h2>
                    <p className="text-indigo-100 text-center mb-12">
                        AI Company helps you achieve better results with smart automation
                    </p> */}
                </div>
                <div className="2xl:flex container  ">
                    <div className="2xl:w-[40%] lg:w-[50%] w-full m-auto " data-aos="fade-right"data-aos-duration="3000">
                        <DotLottieReact
                            src="https://lottie.host/73cf04a2-d521-4e7f-b490-6dfc5172e1cb/pokuuNkZid.json"
                            loop
                            autoplay
                        />
                    </div>
                    <section className="pt-8 lg:pt-16 2xl:w-[60%] h-full">
                        <div className=" mx-auto px-4 h-full">
                            <div className="flex flex-col md:flex-row gap-8 text-white h-full" data-aos="fade-left" data-aos-duration={3000}>
                                {steps.map((step, id) => (
                                    <div
                                        key={step.number}
                                        className={`bg-themeblack rounded-lg shadow-lg p-6 text-center relative transition-all duration-500 cursor-pointer overflow-hidden   h-[350px] flex-shrink-0 ${selectStep === id ? "flex-[5]" : "flex-[1]"}`}
                                        onClick={() => { setSelectStep(id) }}
                                        
                                    >
                                        <div className=" m-auto  border-themedark text-white rounded-full  w-16 h-16  font-bold text-lg">
                                            <img
                                                src={step.icon}
                                                alt={step.title}
                                                className="mx-auto w-12 h-12"
                                            />
                                            <p className="capitalize">step {step.number}</p>
                                        </div>

                                        <div className={selectStep === id ? 'block py-[40px]' : 'hidden '}>
                                            <h3 className="font-semibold text-lg mb-2 text-themedark">{step.title}</h3>
                                            {step.description.map((line, i) => (
                                                <p key={i} className="text-white text-sm">{line}</p>
                                            ))}
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <div className="hidden lg:block">
                {/* <motion.div
                    // initial={{ opacity: 1, scale: 1 , height:0}}
                    // animate={{ opacity: 1, scale: 1, height:800 }}
                    transition={transition}
                    style={{
                        height: 800,
                        border: "2px dashed lightgray",
                        borderRadius: "8px",
                        background: "transparent",
                        position: "absolute",
                        top: "30%",
                        left: '100px'
                    }}
                /> */}
                <motion.img
                    src={robot}
                    alt="Flying Robot"
                    style={{
                        width: "50px",
                        height: "50px",
                        offsetPath: "path('M 100 0 L 100 800')", // vertical line
                        offsetRotate: "0deg", // don't rotate along path
                        transform: "rotate(90deg)", // rotate the image upright
                        position: "absolute",
                        top: "30%",
                        left: '0'
                    }}
                    initial={{ offsetDistance: "0%", scale: 2.5 }}
                    animate={{ offsetDistance: "100%", scale: 2.5 }}
                    transition={transition}
                />
            </div>

        </div>
    )
}

export default AiandHowitsWork
