import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useToast } from "./ToastContext";
import { settings } from "../Settings";
import { useAppContext } from "./AppContext";
import { Log } from "../services/LogService";

const logger = Log("WebSocketContext");
const WebSocketContext = createContext(null);

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children, appName }) => {
  const socket = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const { Toast } = useToast();
  const {
    webSocketService: { setPortfolioEvent },
  } = useAppContext();

  useEffect(() => {
    // Initialize socket connection
    socket.current = io(settings.baseApiUrl);

    // Handle connection
    socket.current.on("connect", () => {
      setIsConnected(true);
      // Register the connection with application name
      socket.current.emit("register", { appName, XApiKey: settings.apiKey });
    });

    // Handle disconnection
    socket.current.on("disconnect", () => {
      setIsConnected(false);
    });

    // Handle receive_message event
    socket.current.on("receive_message", item => {
      logger.debug("receive_message", JSON.stringify(item));
      if (settings.broadcastIgnoredPathnames.some(path => window.location.pathname.startsWith(path))) return;
      if (item.objectId === 1) {
        let { message } = item.data;
        Toast.broadcast(message);
      }
    });

    // Handle refresh_portfolioList event
    socket.current.on("refresh_portfolioList", item => {
      logger.debug("received refresh_portfolioList", item);
      setPortfolioEvent(item);
    });

    return () => {
      // Clean up socket connection on unmount
      socket.current.disconnect();
    };
  }, [appName]);

  const sendMessage = message => {
    if (socket.current && isConnected) {
      socket.current.emit("send_message", message);
    }
  };

  return <WebSocketContext.Provider value={{ socket: socket.current, sendMessage }}>{children}</WebSocketContext.Provider>;
};
