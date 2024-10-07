import React, { useState, useEffect } from "react";
import styles from "./CarouselPlayer.module.css";

const CarouselPlayer = ({ images, speed = 4, showButtons = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, speed * 1000); // Duration between image changes

    return () => clearInterval(interval);
  }, [images.length]);

  const handleDotClick = index => {
    setCurrentIndex(index);
  };

  const prevSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
  };

  return (
    <div className={styles.carousel}>
      {images.map((image, index) => (
        <div key={index} className={`${styles.carouselImage} ${index === currentIndex ? styles.active : ""}`}>
          <img src={image.src} alt={image.alt} />
        </div>
      ))}
      {showButtons && (
        <>
          <button className={styles.prev} onClick={prevSlide}>
            &#10094;
          </button>
          <button className={styles.next} onClick={nextSlide}>
            &#10095;
          </button>
        </>
      )}
      <div className={styles.carouselIndicators}>
        {images.map((_, index) => (
          <span key={index} className={`${styles.dot} ${index === currentIndex ? styles.active : ""}`} onClick={() => handleDotClick(index)} />
        ))}
      </div>
      <div className={styles.carouselCaption}>{images[currentIndex].caption}</div>
    </div>
  );
};

export default CarouselPlayer;
