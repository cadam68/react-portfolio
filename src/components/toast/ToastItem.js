import React, { useEffect } from "react";
import styles from "./ToastContainer.module.css";

const ToastItem = ({ toast, removeToast }) => {
  const toastStyle = { "--fadeout-delay": `${toast.type.duration}s` }; // define css variable

  return (
    <div className={`${styles.toast} ${styles[`toast-${toast.type.label}`]}`} style={toastStyle} onClick={() => removeToast(toast.id)}>
      <h4>{toast.title}</h4>
      <p>{toast.text}</p>
    </div>
  );
};

export default ToastItem;
