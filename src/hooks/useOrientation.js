import { useState, useEffect } from "react";

const useOrientation = () => {
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  const checkOrientation = () => {
    setIsPortrait(window.innerHeight > window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", checkOrientation);
    return () => {
      window.removeEventListener("resize", checkOrientation);
    };
  }, []);

  return isPortrait;
};

export default useOrientation;
