import React, { useRef } from "react";
import startImage from "../assets/star.png"; // Ensure this path is correct
import springImage from "../assets/spring.png"; // Ensure this path is correct
import { motion, useScroll, useTransform } from "framer-motion";
import ArrowIcon from "../assets/arrow-right.svg"; // Update path




export const CallToAction = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-white to-[#d2dcff] py-24 overflow-x-clip"
    >
      <div className="container">
        <div className="section-heading relative">
          <h2 className="section-title">Sign up for free</h2>
          <p className="section-description mt-5">
            Celebrate the joy of accomplishment with an app designed to track
            your progress and motivate your efforts.
          </p>
          <motion.img
            src={startImage} // Remove .src as it's not necessary in Vite
            alt="Star Image"
            width={360}
            className="absolute -left-[350px] -top-[137px] hidden md:block"
            style={{
              translateY,
            }}
          />
          <motion.img
            src={springImage} // Remove .src as it's not necessary in Vite
            alt="Spring Image"
            width={360}
            className="absolute -right-[331px] -top-[19px] hidden md:block"
            style={{
              translateY,
            }}
          />
        </div>
        <div className="flex gap-2 mt-10 justify-center items-center">
          <button className="btn btn-primary">Get for free</button>
          <button className="btn gap-1 items-center btn-text">
            <span>Learn more</span>
            <img src={ArrowIcon} alt="Arrow Icon" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
