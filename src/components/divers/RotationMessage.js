import React from "react";
import useOrientation from "../../hooks/useOrientation";
import "./RotationMessage.css";

const RotationMessage = () => {
  const isPortrait = useOrientation();

  if (!isPortrait) return null;

  return (
    <div className="rotate-message">
      <p>Please rotate your device to landscape mode for the best experience.</p>
    </div>
  );
};

export default RotationMessage;
