import React from 'react'
import Introduction from '../Component/Home/Introduction'
import AiandHowitsWork from '../Component/Home/AiandHowitsWork'
import Stories from '../Component/Home/Stories'
import Member from '.././Component/About/Member'
import CountSection from '../Component/Home/CountSection'
import hello from '../Asset/About/about_industri.jpg'

const Home = () => {
  return (
    <div className='overflow-hidden'>
      <Introduction />
      <AiandHowitsWork />
      {/* <SpecialAddress /> */}
      <div className='flex justify-center  pt-8 lg:pt-20 '>
        <div className='2xl:w-4/5 w-full'>
          <div className="flex lg:flex-nowrap lg:flex-row flex-col-reverse flex-wrap items-center">
            <div className="lg:w-1/2 w-full px-5 lg:mt-0 mt-8">
              <div data-aos="fade-right" >
                <img src={hello} alt="" className='sm:h-[500px] sx:h-[400px] h-[300px] w-full object-cover cursor-pointer transition-all duration-500 ease-in-out grayscale-0 hover:grayscale' />
              </div>
            </div>
            <div className="lg:w-1/2 w-full lg:px-[50px] px-5">
              <div className='text-white'>
                <h3 className='text-white text-[22px] sm:text-[32px] md:text-[40px] lg:text-[40px] sm:leading-[48px] sx:leading-[28px] mt-4' data-aos="fade-left">We interact with the <span className='text-themedark'>AI community</span></h3>
                <p className=' pt-4' data-aos="fade-left">Over the course of the year through a variety of online, live, and hybrid events, either as sponsors or as hosts. </p>
                <p className='mt-5' data-aos="fade-left">Our engineers and researchers showcase our most recent publications, research accomplishments, and product breakthroughs at these forums.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Stories />
      <Member />
      <CountSection />
    </div>
  )
}

export default Home
