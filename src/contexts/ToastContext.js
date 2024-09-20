import React, { createContext, useContext, useMemo, useState } from "react";
import { Log } from "../services/LogService";

const logger = Log("ToastContext");

const ToastContext = createContext({
  toasts: [],
  removeToast: () => {},
  Toast: { info: () => {}, warn: () => {}, error: () => {}, broadcast: () => {} },
});

export function useToast() {
  return useContext(ToastContext);
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // cf ToastContainer.module.css for dynamic animation duration
  const ToastType = Object.freeze({
    INFO: { label: "info", duration: 3 },
    WARNING: { label: "warning", duration: 6 },
    ERROR: { label: "error", duration: 6 },
    BROADCAST: { label: "broadcast", duration: 3 },
  });

  const createToast = (text, type, id = crypto.randomUUID()) => {
    return { id, type, text };
  };

  const addToast = (text, type = ToastType.INFO) => {
    if (!text) return;
    const toast = createToast(text, type);
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      logger.debug(`remove toast: ${JSON.stringify(toast)}`);
      removeToast(toast.id);
    }, type.duration * 1000 + 500);
    return toast.id;
  };

  const removeToast = id => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const Toast = {
    info: text => addToast(text, ToastType.INFO),
    warn: text => addToast(text, ToastType.WARNING),
    error: text => addToast(text, ToastType.ERROR),
    broadcast: text => addToast(text, ToastType.BROADCAST),
  };

  const contextValues = useMemo(() => ({ toasts, Toast, removeToast, addToast }), [toasts]); // value is cached by useMemo
  return <ToastContext.Provider value={contextValues}>{children}</ToastContext.Provider>;
};
