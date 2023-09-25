import React, { useEffect } from "react";
import { preLoaderAnim } from "./animations";
import "./preloader.css";
const PreLoader = () => {
    useEffect(() => {
        preLoaderAnim();
    }, []);
    return (
        <div className="preloader shadow-2xl">
            <span className="absolute top-12 left-12 text-2xl dark:text-white  font-bold text-black px-3">
                BLEH
            </span>
            <div className="texts-container text-4xl">
                <span>BOOM,</span>
                <span>WOOOOW,</span>
                <span>BOOM.</span>
            </div>
        </div>
    );
};

export default PreLoader;