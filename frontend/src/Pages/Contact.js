import React, { useEffect } from 'react'
import { FaRegComment } from "react-icons/fa6";
import { GiSelfLove } from "react-icons/gi";
import { BsTwitterX } from "react-icons/bs";
import xAi from '../Asset/Contact/XAi.svg'
import grok from '../Asset/Contact/Grok.svg'
import joinGrok from '../Asset/Contact/JoinGrok.svg'
import contact from "../Asset/Contact/contact.jpg";
import AOS from "aos";
import * as Yup from "yup";
import { useFormik } from 'formik';
import axios from 'axios';
const serverUrl = 'http://localhost:4000'
const Contact = () => {
  useEffect(() => {
    function generateStars(count, size, duration) {
      const star = document.createElement("div");
      star.classList.add("star-layer");
      star.style.width = size + "px";
      star.style.height = size + "px";
      star.style.animation = `animStar ${duration}s linear infinite`;

      let boxShadow = [];
      for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * window.innerWidth);
        const y = Math.floor(Math.random() * 2000);
        boxShadow.push(`${x}px ${y}px #FFF`);
      }
      star.style.boxShadow = boxShadow.join(", ");

      const after = document.createElement("div");
      after.style.position = "absolute";
      after.style.top = "2000px";
      after.style.width = size + "px";
      after.style.height = size + "px";
      after.style.boxShadow = star.style.boxShadow;

      star.appendChild(after);
      document.body.appendChild(star);
    }
    generateStars(40, 1, 50);
    generateStars(20, 2, 100);
    generateStars(10, 3, 150);
    return () => {
      document.querySelectorAll(".star-layer").forEach(el => el.remove());
    };
  }, []);

  useEffect(() => {
    AOS.init({ duration: 2000, once: true });
  }, [])

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

  const contVal = {
    // comsize:"",
    subject: "",
    firstname: "",
    lastname: "",
    email: "",
    num: "",
    message: ""
  }

  const ContactFormik = useFormik({
    initialValues: contVal,
    validationSchema: Yup.object({
      // comsize: Yup.string().required("Company size is required"),
      subject: Yup.string()
        .required("subject is required"),
      firstname: Yup.string()
        .min(2, "First name must be at least 2 characters")
        .required("First name is required"),
      lastname: Yup.string()
        .min(2, "Last name must be at least 2 characters")
        .required("Last name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      num: Yup.string()
        .matches(/^\+?[0-9]{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
      message: Yup.string()
        .min(10, "Message must be at least 10 characters")
        .required("Message is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log(values);

      axios.post(`${serverUrl}/contactus`, {
        firstName: values.firstname,
        lastName: values.lastname,
        workEmail: values.email,
        subject: values.subject,
        phoneNumber: values.num,
        description: values.message,
      })
        .then((response) => {
          alert('Our team will contact you soon!');
          resetForm(); // <-- now works
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
        });
    }
  })

  return (
    <>
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div className="text-white relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-5xl font-normal pb-12">Contact</h1>

          <div className="flex md:flex-nowrap flex-wrap  gap-8 border-gray-800 pb-8">
            <div className=" sm:w-1/2 w-full " data-aos="fade-up" data-aos-duration="3000">
              <div className='flex flex-col gap-12 md:border-r border-gray-800 pr-8 flex-1'>
                <div className="text-2xl"><FaRegComment className="text-4xl" /></div>
                <div>
                  <h2 className="text-xl font-normal mb-4">Get in touch to product support</h2>
                  <p className="text-[#7D8187] text-md mb-4">For all of your questions concerning Grok and our products, get in touch with Product Support.</p>
                  <div className="flex gap-3 mt-2 flex-wrap">
                    <button className="px-4 py-2 border border-gray-700 rounded-full text-md hover:bg-gray-800">EMAIL SUPPORT</button>
                    <button className="px-4 py-2 border border-gray-700 rounded-full text-md hover:bg-gray-800">CALL SUPPORT</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex sm:w-1/2 w-full flex-col gap-12 md:pl-8 flex-1" data-aos="fade-up" data-aos-duration="3000">
              <div className="text-2xl"><GiSelfLove className="text-4xl" /></div>
              <div>
                <h2 className="text-xl font-normal mb-4">Speak with Sales</h2>
                <p className="text-[#7D8187] text-md mb-4">Find out how we can work together to build.</p>
                <button className="px-4 py-2 border border-gray-700 rounded-full text-sm mt-2 hover:bg-gray-800">EMAIL SALES</button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8 border-gray-800">
            {/* Card 1 */}
            <div>
              <div className="h-full" data-aos="flip-left" data-aos-easing="ease-out-cubic" data-aos-duration="2000">
                <div><img src={xAi} alt="" className="w-10 mb-4" /></div>
                <h3 className="text-xl mt-2">Visit our official account on xAI.</h3>
                <p className="text-[#7D8187] text-md pt-4">View news and analysis straight from our xAI page.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div>
              <div className="h-full" data-aos="flip-left" data-aos-easing="ease-out-cubic" data-aos-duration="2000">
                <div><img src={grok} alt="" className="w-10 mb-4" /></div>
                <h3 className="text-xl mt-2">Investigate Grok on</h3>
                <p className="text-[#7D8187] text-md pt-4">To see the most recent information, visit our official Grok account.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div>
              <div className="h-full" data-aos="flip-left" data-aos-easing="ease-out-cubic" data-aos-duration="2000">
                <div><img src={joinGrok} alt="" className="w-10 h-10 mb-4" /></div>
                <h3 className="text-xl mt-2">Get in touch with Grok via Discord</h3>
                <p className="text-[#7D8187] text-md pt-4">To keep involved, join our official Grok Discord community.</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="sm:col-span-2 lg:col-span-3">
              <div className="flex flex-col sm:flex-row gap-8 pt-6 text-sm">
                <div data-aos="fade-up" data-aos-duration="3000">
                  <p className="uppercase font-medium text-[#7D8187]">Media</p>
                  <p className="mt-1">media@x.ai</p>
                </div>
                <div data-aos="fade-up" data-aos-duration="3000">
                  <p className="uppercase font-medium text-[#7D8187]">Safety</p>
                  <p className="mt-1">safety@x.ai</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto pb-16 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 items-stretch">
            <div className="md:w-1/2 w-full" data-aos="fade-right" data-aos-offset="300" data-aos-easing="ease-in-sine">
              <div className="h-full">
                <img src={contact} alt="Contact" className="w-full h-full object-cover rounded-lg" />
              </div>
            </div>
            <form onSubmit={ContactFormik.handleSubmit} className="j_input_field w-full md:w-1/2 space-y-6 h-full" data-aos="fade-left" data-aos-offset="300" data-aos-easing="ease-in-sine">
              {/* <div>
                <label className="block mb-2 text-sm font-medium">Company size</label>
                <select name='comsize' value={ContactFormik.values.comsize} onChange={ContactFormik.handleChange} onBlur={ContactFormik.handleBlur} className="w-full bg-black border border-gray-700 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500">
                    <option value="">Please Select</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="200+">200+</option>
                </select>
                {ContactFormik.touched.comsize && ContactFormik.errors.comsize && (<p className="text-red-500 text-xs">{ContactFormik.errors.comsize}</p>)}
              </div> */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium">First name</label>
                  <input type="text" name='firstname' value={ContactFormik.values.firstname} onChange={ContactFormik.handleChange} onBlur={ContactFormik.handleBlur} className="w-full bg-black border border-gray-700 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500" />
                  {ContactFormik.touched.firstname && ContactFormik.errors.firstname && (<p className="text-red-500 text-xs">{ContactFormik.errors.firstname}</p>)}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Last name</label>
                  <input type="text" name='lastname' value={ContactFormik.values.lastname} onChange={ContactFormik.handleChange} onBlur={ContactFormik.handleBlur} className="w-full bg-black border border-gray-700 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500" />
                  {ContactFormik.touched.lastname && ContactFormik.errors.lastname && (<p className="text-red-500 text-xs">{ContactFormik.errors.lastname}</p>)}
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Subject</label>
                <input type="text" name='subject' value={ContactFormik.values.subject} onChange={ContactFormik.handleChange} onBlur={ContactFormik.handleBlur} className="w-full bg-black border border-gray-700 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500" />
                {ContactFormik.touched.subject && ContactFormik.errors.subject && (<p className="text-red-500 text-xs">{ContactFormik.errors.subject}</p>)}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium">Work email</label>
                  <input type="email" name='email' value={ContactFormik.values.email} onChange={ContactFormik.handleChange} onBlur={ContactFormik.handleBlur} className="w-full bg-black border border-gray-700 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500" />
                  {ContactFormik.touched.email && ContactFormik.errors.email && (<p className="text-red-500 text-xs">{ContactFormik.errors.email}</p>)}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Phone number</label>
                  <input type="tel" name='num' value={ContactFormik.values.num} onChange={ContactFormik.handleChange} onBlur={ContactFormik.handleBlur} className="w-full bg-black border border-gray-700 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500" />
                  {ContactFormik.touched.num && ContactFormik.errors.num && (<p className="text-red-500 text-xs">{ContactFormik.errors.num}</p>)}
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Description
                </label>
                <textarea rows="5" name="message" value={ContactFormik.values.message} onChange={ContactFormik.handleChange} onBlur={ContactFormik.handleBlur} className="w-full bg-black border border-gray-700 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"></textarea>
                {ContactFormik.touched.message && ContactFormik.errors.message && (<p className="text-red-500 text-xs">{ContactFormik.errors.message}</p>)}
              </div>
              <button type="submit" className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-full text-sm">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contact