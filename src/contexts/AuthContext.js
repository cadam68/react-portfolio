import React, { createContext, useState, useEffect, useContext, useReducer, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import { FetchService } from "../services/FetchService";
import { Log } from "../services/LogService";
import { useToast } from "./ToastContext";

const logger = Log("AuthContext");

const AuthContext = createContext({
  user: undefined,
  login: () => {},
  logout: () => {},
});

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const { Toast } = useToast();

  useEffect(() => {
    // Check if there's a token in localStorage on initial load
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser({ username: decodedToken.username, role: decodedToken.role });
      } catch (error) {
        logger.error("Invalid token found in local storage, clearing it.");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    logger.info(`user ${user?.username} logged out`);
    Toast.info(`Bye ${user.username}, see you soon...`);
    setUser(undefined);
  };

  const login = async (userid, password) => {
    const abortCtrl = new AbortController();

    return false;
    /*
    const data = { username: userid, role: "admin" };
    setUser(data);
    Toast.info(`Welcome ${data.username} !`);
    return true;
     */

    /*
    try {
      let data = await FetchService().login(userid, password, abortCtrl);

      if (!data?.token) throw new Error("Login failed, no token returned");
      const decodedToken = jwtDecode(data.token);
      if (!decodedToken.username || !decodedToken.role) throw new Error("Invalid token returned");

      // Save the token in localStorage and set the user state
      localStorage.setItem("token", data.token);
      setUser({ username: decodedToken.username, role: decodedToken.role });
      return true;
    } catch (err) {
      logger.error("Error during login :", err);
      logout();
      return false; // Signal that login failed
    }

     */
  };

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
