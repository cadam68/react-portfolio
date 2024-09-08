import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import { FetchService } from "../services/FetchService";
import { Log } from "../services/LogService";
import { useToast } from "./ToastContext";
import { settings } from "../Settings";

const logger = Log("AuthContext");

const AuthContext = createContext({
  user: undefined,
  login: () => {},
  logout: () => {},
});

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const { Toast } = useToast();
  const intervalIdRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("token");
    logger.info(`user ${user?.name} logged out`);
    if (user) Toast.info(`Bye ${user.name}`);
    setUser(undefined);
  };

  const login = async (userid, password) => {
    const abortCtrl = new AbortController();

    try {
      let data = await FetchService().login(userid, password, abortCtrl);

      if (!data?.token) throw new Error("Login failed, no token returned");
      const decodedToken = jwtDecode(data.token);
      if (!decodedToken?.userid || !decodedToken?.name || !decodedToken?.role) throw new Error("Invalid token returned");

      // Save the token in localStorage and set the user state
      localStorage.setItem("token", data.token);
      setUser({ userid: decodedToken.userid, name: decodedToken.name, role: decodedToken.role });
      Toast.info(`Welcome ${decodedToken.name}`);

      return true;
    } catch (err) {
      logger.error(`Error during login : ${err}`);
      logout();
      return false; // Signal that login failed
    }
  };

  const refreshToken = async () => {
    const r = await FetchService().refreshToken();
    logger.debug(`Token is ${r ? "" : "NOT"} refreshed`);
  };

  useEffect(() => {
    // Check if there's a token in localStorage on initial load
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser({ userid: decodedToken.userid, name: decodedToken.name, role: decodedToken.role });
      } catch (error) {
        logger.error("Invalid token found in local storage, clearing it.");
        localStorage.removeItem("token");
      }
    }
  }, []);

  useEffect(() => {
    if (settings.refreshTokenInterval >= 0) {
      if (user) {
        intervalIdRef.current = setInterval(refreshToken, settings.refreshTokenInterval * 60000);
      } else if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }

      return () => {
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }
      };
    }
  }, [user]);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

// Custom hook to consume the DebugContext
const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a AuthContextProvider");
  }
  return context;
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContextProvider, useAuthContext };
