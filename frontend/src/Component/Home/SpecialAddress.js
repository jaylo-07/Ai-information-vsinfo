import React from 'react'
import Stack from "../../reactBeats/Stack";
import person1 from '../../Asset/Home/person1.webp'
import person2 from '../../Asset/Home/person2.webp'
import person3 from '../../Asset/Home/person3.png'
import person4 from '../../Asset/Home/person4.webp'
import person5 from '../../Asset/Home/person5.webp'
const images = [
    { id: 1, img: person1 },
    { id: 2, img: person2 },
    { id: 3, img: person3 },
    { id: 4, img: person4 },
    { id: 5, img: person5 }
];
const SpecialAddress = () => {
  return (

    <section className="bg-black xl:py-10 py-6">
    <div className="lg:flex flex-wrap justify-center items-center container">
        <div className="px-8 lg:w-1/2">
            <h2 className="2xl:text-5xl md:text-3xl  text-2xl font-semibold text-white md:mb-5 mb-3 2xl:leading-[60px]" data-aos="fade-right"><span className="text-themedark fond-extrabold">NVIDIA</span> at SIGGRAPH Research Special Address</h2>
            <p className="text-[#f0f0f0]  sm:text-base text-xs md:mb-5 mb-3  " data-aos="fade-right">New <span className="text-themedark">NVIDIA</span> technologies are enabling instant world reconstruction, spatial reasoning, and large-scale simulation on NVIDIA DGX Cloud and NVIDIA RTX PRO Blackwell servers.</p>
        </div>
        <>
            {/* Large screen */}
            <div className="hidden sm:block" data-aos="fade-left">
                <Stack
                    cardDimensions={{ width: 400, height: 400 }}
                    cardsData={images}
                />
            </div>

            {/* Small screen */}
            <div className="block sm:hidden" data-aos="fade-left">
                <Stack
                    cardDimensions={{ width: 250, height: 250 }}
                    cardsData={images}
                />
            </div>
        </>
    </div>
</section>
  )
}

export default SpecialAddress
