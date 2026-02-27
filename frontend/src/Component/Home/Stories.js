import React, { useMemo, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';

const blogData = [
    // Column 1
    {
        img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
        title: "E-Learning App Design And How To Make It Better",
        description:
            "Kids and adults are becoming more and more techno-savvy, especially the kids who are used to all kinds of gadgets from a very small age.",
        tags: ["Design"],
        column: 1,
        className: "md:absolute top-10 left-[20%] rotate-[-5deg]",
    },
    {
        img: "https://images.unsplash.com/photo-1697909623564-3dae17f6c20b?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "How to Integrate Combine with SwiftUI to Make Better Apps",
        description:
            "SwiftUI and Combine are Apple's latest frameworks. With their introduction, the...",
        tags: ["Design"],
        column: 1,
        className: "md:absolute top-40 left-[25%] rotate-[-7deg]",
    },
    // Column 2
    {
        img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
        title: "How Apple's M1 Chips Make macOS Development Much Less Costly",
        description:
            "The macOS market share is much smaller than the iOS one. There are many, many more iPhones out there, they dominate Apple's revenues so that's where most of their attention goes.",
        tags: ["Development"],
        column: 2,
        className: "md:absolute top-5 left-[40%] rotate-[8deg]",
    },
    {
        img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800",
        title: "Why AI Assistants Are Changing Software Development",
        description:
            "From debugging to code generation, AI tools are making developers faster and more productive.",
        tags: ["Development", "Management"],
        column: 2,
        className: "md:absolute top-32 left-[55%] rotate-[10deg]",
    },
    // Column 3
    {
        img: "https://images.unsplash.com/photo-1421789665209-c9b2a435e3dc?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "How To Outsource Web Development And Web Design",
        description:
            "Everything is within reach of today's individual. All you need is a phone or a laptop...",
        tags: ["Design", "Development"],
        column: 3,
        className: "md:absolute top-20 right-[35%] rotate-[2deg]",
    },
    {
        img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
        title: "What Makes Something Beautiful and How To...",
        tags: ["Design"],
        column: 3,
        className: "md:absolute top-24 left-[45%] rotate-[-7deg]",
    },
    {
        img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Balancing Creativity and Functionality in Product Design",
        description:
            "Design is not just about aesthetics—it must also serve the intended function efficiently.",
        tags: ["Design", "Marketing"],
        column: 3,
        className: "md:absolute top-8 left-[30%] rotate-[4deg]",
    },
    {
        img: "https://images.unsplash.com/photo-1697909623564-3dae17f6c20b?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Advanced React Patterns for Modern Development",
        description:
            "Learn how to build scalable React applications using modern patterns and best practices.",
        tags: ["Development"],
        column: 1,
        className: "md:absolute top-40 left-[25%] rotate-[-7deg]",
    },
    {
        img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
        title: "The Future of Web Design: Trends for 2025",
        description:
            "Explore the cutting-edge design trends that will shape the web in 2025 and beyond.",
        tags: ["Design", "Marketing"],
        column: 2,
        className: "md:absolute top-5 left-[40%] rotate-[8deg]",
    },
    {
        img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800",
        title: "Building Scalable APIs with Node.js",
        description:
            "Best practices for creating robust and scalable backend systems using Node.js.",
        tags: ["Development"],
        column: 2,
        className: "md:absolute top-32 left-[55%] rotate-[10deg]",
    },
    {
        img: "https://images.unsplash.com/photo-1421789665209-c9b2a435e3dc?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "UX Research Methods That Actually Work",
        description:
            "Discover effective user research techniques that lead to better product decisions.",
        tags: ["Design", "Management"],
        column: 3,
        className: "md:absolute top-20 right-[35%] rotate-[2deg]",
    },
    {
        img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
        title: "Managing Remote Development Teams",
        tags: ["Management"],
        column: 3,
        className: "md:absolute top-24 left-[45%] rotate-[-7deg]",
    },
];

// function for hover efffect
const TiltCard = ({ item, onClick }) => {
    const cardRef = useRef(null);
    const glowRef = useRef(null);
    let bounds = null;

    const rotateToMouse = (e) => {
        if (!bounds) return;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const leftX = mouseX - bounds.x;
        const topY = mouseY - bounds.y;
        const center = {
            x: leftX - bounds.width / 5,
            y: topY - bounds.height / 5,
        };
        const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

        cardRef.current.style.transform = `
        scale3d(1.07, 1.07, 1.07)
        rotate3d(
          ${center.y / 100},
          ${-center.x / 100},
          0,
          ${Math.log(distance) * 2}deg
        )
      `;

        if (glowRef.current) {
            glowRef.current.style.backgroundImage = `
          radial-gradient(
            circle at
            ${center.x * 2 + bounds.width / 2}px
            ${center.y * 2 + bounds.height / 2}px,
            #ffffff55,
            #0000000f
          )
        `;
        }
    };

    useEffect(() => {
        const cardEl = cardRef.current;
        if (!cardEl) return;

        const handleMouseEnter = () => {
            bounds = cardEl.getBoundingClientRect();
            document.addEventListener("mousemove", rotateToMouse);
        };

        const handleMouseLeave = () => {
            document.removeEventListener("mousemove", rotateToMouse);
            cardEl.style.transform = "";
            if (glowRef.current) glowRef.current.style.background = "";
        };

        cardEl.addEventListener("mouseenter", handleMouseEnter);
        cardEl.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            cardEl.removeEventListener("mouseenter", handleMouseEnter);
            cardEl.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mousemove", rotateToMouse);
        };
    }, []);

    return (
        <div
            ref={cardRef}
            onClick={onClick}
            className="relative bg-themeblack p-4 rounded-lg shadow-md w-full mb-4 cursor-pointer transition-transform duration-300"
            style={{ minHeight: "280px", transformStyle: "preserve-3d" }}
        >
            {/* Glow overlay */}
            <div
                ref={glowRef}
                className="absolute inset-0 rounded-lg pointer-events-none"
            />

            <article>
                {item.img && (
                    <img
                        src={item.img}
                        alt={item.title}
                        className="h-[200px] w-full object-cover rounded-md"
                    />
                )}
                <hr className="mt-3 border-gray-700" />
                <div className="p-2">
                    {item.tags && (
                        <p className="text-xs text-gray-400 mt-2">
                            #{item.tags.join(" #")}
                        </p>
                    )}
                    <h2 className="font-semibold text-lg mt-4 line-clamp-2 text-white">
                        {item.title.slice(0, 80)}
                    </h2>
                </div>
            </article>
        </div>
    );
};
function splitIntoColumns(data, columns) {
    return Array.from({ length: columns }, (_, colIndex) =>
        data.filter((_, idx) => idx % columns === colIndex)
    );
}


// blog data render from here
const AutoScrollingColumn = ({ items, direction, speed = 50, onItemClick }) => {
    const [isPaused, setIsPaused] = useState(false);

    if (!items || items.length === 0) return null;

    // Ensure we have enough items by duplicating the array multiple times
    const minItems = 8;
    let workingItems = [...items];
    while (workingItems.length < minItems) {
        workingItems = [...workingItems, ...items];
    }

    const infiniteItems = [...workingItems, ...workingItems];
    const animationDuration = infiniteItems.length * 3;

    return (
        <div
            className="flex flex-col w-full  h-[800px] relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div
                className="flex flex-col animate-infinite-scroll"
                style={{
                    animationDuration: `${animationDuration}s`,
                    animationDirection: direction === "up" ? "normal" : "reverse",
                    animationPlayState: isPaused ? "paused" : "running",
                }}
            >
                {infiniteItems.map((item, index) => (
                    <TiltCard
                        key={`${item.title}-${index}`}
                        item={item}
                        onClick={() => onItemClick(item)}
                    />
                ))}
            </div>

            <style jsx>{`
          @keyframes infinite-scroll {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-50%);
            }
          }
  
          .animate-infinite-scroll {
            animation: infinite-scroll linear infinite;
          }
        `}</style>
        </div>
    );
};

// main function
const Stories = () => {
    const [tab, setTab] = useState('All');
    const [selectedItem, setSelectedItem] = useState(null);
    const tabs = ["All", "Design", "Development", "Management", "Marketing"];

    const filterData = useMemo(() => {
        if (tab === "All") return blogData;
        return blogData.filter((item) =>
            item.tags.some((tag) => tag.toLowerCase() === tab.toLowerCase())
        );
    }, [tab]);

    const getCols = () => {
        if (typeof window === "undefined") return 1;
        if (window.innerWidth >= 1440) return 5;
        if (window.innerWidth >= 1200) return 4;
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 3;
        return 1;
    };

    const [cols, setCols] = useState(getCols());

    useEffect(() => {
        const handleResize = () => {
            setCols(getCols());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const columnData = splitIntoColumns(filterData, cols);

    return (
        <>
            <div className="container bg-black text-white font-sans min-h-screen px-6 xl:py-10 py-6">
                {/* Header */}
                <header className="flex flex-wrap justify-between items-center py-6   ">
                    <div className="flex items-center gap-4">
                        {/* <button className="text-2xl">&#9776;</button> */}
                        <h2 className="2xl:text-5xl md:text-3xl  text-2xl font-semibold text-white text-center md:mb-5 mb-3 2xl:leading-[60px]" data-aos="fade-up">This is where we tell <span className="text-themedark fond-extrabold">stories</span></h2>

                    </div>
                    <Link to="/contact" className='ms-[10px]'> 
                        <button className="bg-white text-black px-4 py-2 rounded-full hover:bg-[transparent] hover:text-[white] border transition-all duration-500">Contact Us</button>
                    </Link>
                </header>


                {/* Tabs */}
                <div className="flex gap-6 overflow-auto no-scrollbar" data-aos="fade-up">
                    {tabs.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`pb-2 text-sm font-medium ${t === tab
                                ? "text-themedark border-b border-themedark"
                                : "text-gray-400 "
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>


                <p className="mx-auto max-w-sm text-center text-2xl font-black text-neutral-400 md:text-4xl md:mb-8  mb-4 mt-4 sm:mt-0">
                    {tab}
                </p>

                {/* Desktop Auto-Scrolling Columns */}
                <div className="hidden md:grid gap-6 w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 overflow-hidden">
                    {columnData.map((colItems, colIndex) => (
                        <AutoScrollingColumn
                            key={`${tab}-${colIndex}`} // Key includes tab to reset on filter change
                            items={colItems}
                            direction={colIndex % 2 === 0 ? 'up' : 'down'}
                            speed={40 + (colIndex * 5)} // Varying speeds for more natural feel
                            onItemClick={setSelectedItem}
                        />
                    ))}
                </div>

                {/* Mobile Static Grid */}
                <div className='md:hidden flex flex-col w-full overflow-hidden'>
                    {filterData.map((item, index) => (
                        <motion.div
                            key={index}
                            layoutId={`smcard-${index}`}
                            className={` bg-themeblack p-6 g-4 w-[100%] rotate-0 mt-4`}
                            onClick={() => setSelectedItem({ ...item, index })}
                            style={{ cursor: "pointer" }}
                            data-aos="fade-left"
                            data-aos-anchor="#example-anchor"
                            data-aos-offset="500"
                            data-aos-duration="500"
                        >
                            <article>
                                {item.img && (
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="pointer-events-none relative z-10 h-[200px] w-full object-cover"
                                    />
                                )}

                                <hr className="mt-3" />

                                <div className="p-3">
                                    {item.tags && (
                                        <p className="text-xs text-gray-400 mt-2">
                                            #{item.tags.join(" #")}
                                        </p>
                                    )}
                                    <h2 className="font-semibold text-lg mt-4">
                                        {item.title}
                                    </h2>

                                </div>
                            </article>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                        onClick={() => setSelectedItem(null)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            layoutId={`card-${selectedItem.index}`}
                            className="bg-themeblack rounded-lg overflow-hidden shadow-lg p-6 text-white"
                            style={{
                                width: "400px",
                                transformStyle: "preserve-3d",
                            }}
                            initial={{ rotateY: 90, scale: 1 }}
                            animate={{
                                rotateY: 0,
                                scale: window.innerWidth > 768 ? 1.1 : 0.8,
                                transition: { duration: 0.5 },
                            }}
                            exit={{ scale: 1 }}
                        >
                            <article>
                                {selectedItem.img && (
                                    <img
                                        src={selectedItem.img}
                                        alt={selectedItem.title}
                                        className="pointer-events-none relative h-[200px] z-10 w-full object-cover"
                                    />
                                )}

                                <hr className="mt-3" />

                                <div className="p-3">
                                    {selectedItem.tags && (
                                        <p className="text-xs text-gray-400 mt-2">
                                            #{selectedItem.tags.join(" #")}
                                        </p>
                                    )}
                                    <h2 className="font-semibold text-lg mt-4">
                                        {selectedItem.title}
                                    </h2>

                                    {selectedItem.description && (
                                        <p className="text-gray-500 text-sm mt-2">
                                            {selectedItem.description}
                                        </p>
                                    )}
                                </div>
                            </article>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default Stories