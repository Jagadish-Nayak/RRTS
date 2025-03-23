'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Define the illustration data
// const illustrations = [
//   {
//     id: 1,
//     src: '/illustrations/a.png',
//     alt: 'Road Repair Illustration 1',
//   },
//   {
//     id: 2,
//     src: '/illustrations/b.png',
//     alt: 'Road Repair Illustration 2',
//   },
//   {
//     id: 3,
//     src: '/illustrations/c.png',
//     alt: 'Road Repair Illustration 3',
//   },
//   {
//     id: 4,
//     src: '/illustrations/d.png',
//     alt: 'Road Repair Illustration 4',
//   },
//   {
//     id: 5,
//     src: '/illustrations/e.png',
//     alt: 'Road Repair Illustration 5',
//   },
//   {
//     id: 6,
//     src: '/illustrations/f.png',
//     alt: 'Road Repair Illustration 6',
//   },
// ];

const illustrations = [
  {
    id: 1,
    src: '/illustrations/p1.png',
    alt: 'Road Repair Illustration 1',
  },
  {
    id: 2,
    src: '/illustrations/p2.png',
    alt: 'Road Repair Illustration 2',
  }, 
  {
    id: 3,
    src: '/illustrations/p3.png',
    alt: 'Road Repair Illustration 3',
  },
  {
    id: 4,
    src: '/illustrations/p4.png',
    alt: 'Road Repair Illustration 4',
  },
  {
    id: 5,
    src: '/illustrations/p5.png',
    alt: 'Road Repair Illustration 4',
  },
]

  
  

const HeroSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right, 0 for initial
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to handle the slide transition
  const nextSlide = () => {
    setDirection(1);
    setActiveIndex((prevIndex) => (prevIndex + 1) % illustrations.length);
  };

  useEffect(() => {
    // Set up automatic slider
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    // Clean up interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Variants for framer-motion animations
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      y: 0,
    }),
    center: {
      x: 0,
      opacity: 0.9, // Slightly transparent to blend with background
      y: [0, -20, 0, 20, 0], // Up and down animation while visible
      transition: {
        y: {
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut"
        }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      y: 0,
    }),
  };

  return (
    <div className="relative h-[550px] w-full max-w-[700px] mx-auto overflow-hidden">
      {/* Illustrations container with transparent background */}
      <div className="relative h-full w-full overflow-hidden p-8">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 }
            }}
            className="absolute inset-0 flex items-center justify-center p-8"
            style={{ mixBlendMode: 'multiply' }} // This helps blend with background
          >
            <Image
              src={illustrations[activeIndex].src}
              alt={illustrations[activeIndex].alt}
              fill
              className="object-contain p-8"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HeroSlider;
