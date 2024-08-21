import React from "react";
import { useToast } from "../../contexts/ToastContext";
import styles from "./ToastContainer.module.css";
import ToastItem from "./ToastItem";

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
