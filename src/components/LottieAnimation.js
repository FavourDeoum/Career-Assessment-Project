// LottieAnimation.js
import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import './LottieAnimation.css'; // Import CSS for styles

const LottieAnimation = ({ animationData }) => {
  const animationContainer = useRef(null);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: animationContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData,
    });

    return () => animation.destroy(); // Cleanup on unmount
  }, [animationData]);

  return <div className="lottie-animation" ref={animationContainer} style={{ width: '300px', height: '300px' }} />;
};

export default LottieAnimation;