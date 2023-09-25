"use client";

import useScrollSnap from 'react-use-scroll-snap';
import {useRef} from "react";
import * as React from "react";
import "./about.css";
import Preloader from "@/components/preloader/preloader";
import img_dark from '@/assets/Darkmode.png'
import img_light from '@/assets/Lightmode.png'
import Image from "next/image";
import logo from "@/assets/AI Avatar.svg";


const AboutPage = () => {
    // const element = document.getElementById('animated-element');
    // const stages = ['-translate-y-[-1px]', '-translate-y-[74px]', '-translate-y-[150px]', '-translate-y-[227px]'];
    // let currentStage = 0;
    //
    // function animateElement() {
    //     element.classList.add(stages[currentStage]);
    //     currentStage = (currentStage + 1) % stages.length;
    //     element?.classList.remove(stages[currentStage]);
    // }
    //
    // setInterval(animateElement, 1000);

    const scrollRef = useRef(null);
    useScrollSnap({ref: scrollRef, duration: 50, delay: 30});
    return (
        <div>
            <section className="scroll-snap-start">
                {/*<Preloader style={{backgroundColor: "#121314"}} />*/}
                <div className=" bg-[#0F0E0E] overflow-hidden">
                    <div
                        className="flex justify-center backdrop-blur-sm items-center w-full fixed z-50 top-0 p-2  shadow-xl">
                        <div className="flex w-[95%] mt-3 justify-center text-white font-bold px-6 rounded p-2 mx-auto">
                            <div
                                className="rounded-md hover:border-2 hover:border-black px-4 py-2 text-white font-semibold"
                                size="medium">How to use?
                            </div>
                            <div
                                className="rounded-md hover:border-2 hover:border-black px-4 py-2 text-white font-semibold"
                                size="medium">Button
                            </div>
                            <div
                                className="rounded-md hover:border-2 hover:border-black px-4 py-2 text-white font-semibold"
                                size="medium">Button
                            </div>
                            <div
                                className="rounded-md hover:border-2 hover:border-black px-4 py-2 text-white font-semibold"
                                size="medium">Try it now
                            </div>
                        </div>
                    </div>
                    <div
                        className="scroll-snap bg-dotted-spacing-[100px] text-white p-12 h-screen bg-dotted-[#464646] scale-125 transition-all overflow-clip duration-1000 bg-dotted-radius-[1.2px] group hover:scale-110 hover:bg-dotted-radius-[1.1px] ease-in-out">
                        <div className="mt-32 w-[80%] mx-auto group-hover:scale-110 transition-all duration-1000">
                            <div
                                className="font-normal text-white/40  text-sm px-2 py-2 rounded mx-auto  bg-[#1A1A1A] ">
                           <span className="p-1 px-2 mr-2 bg-cyan-400  rounded-md text-black ">
                               bleh
                           </span>
                                Click on "Try It Now" button that directs users to the chatbot interface.
                            </div>
                            <div className=" flex lg:flex-row flex-col p-8 items-center h-[600px]">
                                <div className="w-full h-full">
                                    <div
                                        className="flex-initial text-left font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 items-center mt-16 text-3xl  lg:text-7xl  py-4">
                                        Welcome to Your Intelligent Healthcare Documentation Companion!
                                    </div>
                                    <div className="rounded-md text-center  ">
                                        <button className="flex text-gray-500 text-left h-full">
                                            <span className="Btn">
                                                 <span className="svgContainer">
                                                   <svg fill="white" viewBox="0 0 496 512" height="1.6em"><path
                                                       d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg>
                                                 </span>
                                                <span className="BG"></span>
                                            </span>
                                            <span className="px-4 my-auto">
                                                WOOW FACTOR 100% |
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <div className="w-full mt-40 tracking-wide text-left flex flex-row-reverse  h-full">
                                    <div className="w-2/3 px-4 ">
                                        <div>
                                            Navigating the vast world of GE Healthcare's documentation has never been
                                            easier.
                                            Our chatbot is here to assist you in finding the right information,
                                            in your preferred language, with precision.
                                        </div>
                                        <div
                                            className="mt-2 hover:text-white hover:cursor-pointer text-xl text-cyan-200 underline">
                                            Get started.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="flex items-center justify-center pr-4 text-violet-900  text-7xl font-bold h-[800px] w-full">
                    Made for the
                    <div className="overflow-clip text-center p-1 h-[80px]">
                        <div id="animated-element" className="animate-translate-loop ">
                            <p className="mx-2 mb-8">
                                world
                            </p>
                            <p className="mx-2  my-8">
                                世界
                            </p>
                            <p className="mx-2  my-8">
                                संसार
                            </p>
                            <p className="mx-2  my-8">
                                monde
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center pr-4 text-violet-900 bg-stone-900 text-7xl font-bold h-[800px] w-full">
                    <div className="one-div"></div>
                </div>
                <div>
                    <div className="h-fit bg-white flex flex-col">
                        <div className="px-8 border-t border-t-gray-300 my-6 flex-grow">
                            <div className="flex lg:flex-row flex-col border-r  p-4 border-gray-300 h-full">
                                <div className="w-full h-full p-4 ">
                                    <div className="flex-initial px-1 text-center text-6xl py-4 font-bold">
                                        <div className="p-4">
                                            2 Flavours
                                        </div>
                                        <Image src={img_light} alt={"oops image not found"}
                                               className="w-[90%] mx-auto shadow-xl"/>
                                    </div>
                                    <div className="flex-auto rounded-md text-center p-2 mx-2">
                                        <p className="text-black  h-full">
                                            its guud , woow , amazing should try it once in your life be happy with it
                                        </p>
                                    </div>
                                </div>
                                <div className="w-full h-full p-4">
                                    <Image src={img_dark} alt={"oops image not found"}
                                           className="w-[90%] mx-auto shadow-xl shadow-black/60"/>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-b h-14 text-center px-14 my-auto py-4 border-gray-300">
                            <div className="font-bold text-xl">
                                <div id="scroll-container">
                                    <div id="scroll-text" className="animate-my-animation">
                                        This is scrolling text.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="scroll-snap">
                    <div className=" min-h-screen py-10 w-full bg-stone-900">
                        <div className="flex flex-row px-12 py-4">
                            <div className="flex-initial px-1 text-3xl my-auto font-bold text-white">
                                B.
                            </div>
                            <div className="my-auto ml-20 text-white">
                                <div
                                    className="rounded-md px-2 ml-20 text-white hover:bg-stone-900 font-sans hover:font-bold"
                                    size="medium">Home
                                </div>
                                <div
                                    className="rounded-md px-2 ml-20 text-white hover:bg-stone-900 font-sans hover:font-bold"
                                    size="medium">Work
                                </div>
                                <div
                                    className="rounded-md px-2 ml-20 text-white hover:bg-stone-900 font-sans hover:font-bold"
                                    size="medium">Resume
                                </div>
                            </div>
                        </div>
                        <div>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AboutPage;