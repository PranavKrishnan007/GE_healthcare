import React, { useEffect } from "react";
import { preLoaderAnim } from "./animations";
import "./preloader.css";
const PreLoader = () => {
    useEffect(() => {
        preLoaderAnim();
    }, []);
    return (
        <div className="preloader dark:bg-[#121314] shadow-2xl">
            <span className="absolute top-12 left-12 text-2xl dark:text-white  font-bold text-black px-3">
                BLEH
            </span>
            <div className="texts-container dark:text-white text-4xl">
                <span className="px-2">Believe,</span>
                <span className="px-2">Learn,</span>
                <span className="px-2">Explore,</span>
                <span className="px-2">Help.</span>
            </div>
        </div>
    );
};

export default PreLoader;