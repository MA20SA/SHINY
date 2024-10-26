import React, { useState, useEffect } from "react";
import picA from "../../src/images/3picA.png";
import picB from "../../src/images/graduationPic.png";
import picC from "../../src/images/HennaPic.png";
import picD from "../../src/images/3picB.png";


const categories = [
    {
        imgSrc:picA
    },
    {
        imgSrc:picB

    },{
        imgSrc:picC

    },{
        imgSrc:picD

    },
    // {
    //     // imgSrc:MasayaOut4
    // },
    // {
    //     // imgSrc:MasayaOut3
    // },
];

const CategoriesHalls = () => {
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

    useEffect(() => {
        const changeCategory = () => {
            setCurrentCategoryIndex((prevIndex) =>
                prevIndex === categories.length - 1 ? 0 : prevIndex + 1
            );
        };

        const interval = setInterval(changeCategory, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="background-containerHall"
            style={{
                backgroundImage: `url(${categories[currentCategoryIndex].imgSrc})`,
            }}
        >

        </div>
    );
};

export default CategoriesHalls;
