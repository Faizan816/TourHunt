// components/CinematicSlider.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Import the useRouter hook from next/router

const CinematicSlider = ({ images, words }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter(); // Get the router object using the useRouter hook

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [images]);

  return (
    <div className={"slider"}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`${"slide"} ${
            index === currentImageIndex ? "active" : ""
          }`}
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className={"wordContainer"}>
            <div
              className={`${"word"} ${"animate"} ${
                index === currentImageIndex ? "bold" : ""
              }`}
            >
              {words[index]}
            </div>
            <button
              className={"button"}
              onClick={() => {
                router.push("/business/signup"); // Correct route path for Next.js routing
              }}
            >
              Setup Business Profile
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CinematicSlider;
