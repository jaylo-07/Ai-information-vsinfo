import React from 'react'
import happy from '../../Asset/Home/success.png'
import project from '../../Asset/Home/checklist.png'
import experience from '../../Asset/Home/medal.png'
import developer from '../../Asset/Home/expert.png'
import CountUp from '../../reactBeats/CountUp'
const CountSection = () => {

    var data = [
        { title: 'happy client', icon: happy, value: 15 },
        { title: 'Project completed', icon: project, value: 15 },
        { title: 'year experience', icon: experience, value: 7 },
        { title: 'developer', icon: developer, value: 500 },
    ]

    return (
        <div className='container capitalize py-16'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                {data.map((item, index) => {
                    return (
                        <div className='flex bg-themeblack     text-white p-5 items-center rounded-[20px]' data-aos="fade-up">
                            <div>
                                <img src={item.icon} alt="happy client" className='h-14 w-14'></img>
                            </div>
                            <div className='ms-4'>
                                <h4 className='lg:text-xl text-base'>
                                    <CountUp
                                        from={0}
                                        to={item.value}
                                        separator=","
                                        direction="up"
                                        duration={1}
                                        className="count-up-text"
                                    />+ {item.title}</h4>
                            </div>
                        </div>
                    )
                })}

            </div>
        </div>
    )
}

export default CountSection
