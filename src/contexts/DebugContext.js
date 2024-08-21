import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { Log, setLogOn } from "../services/LogService";
import PropTypes from "prop-types";
import { settings } from "../Settings";

const logger = Log("DebugContext");

const DebugContext = createContext({
  debug: false,
  toggleDebug: () => {},
  admin: false,
  toggleAdmin: () => {},
});

const initialState = { debug: false, admin: false };

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "debug/toggle": // nomenclature : "state/event*
      logger.info(`debug changed to ${!state.debug}`);
      return { ...state, debug: !state.debug };
    case "admin/toggle": {
      const { credential } = payload;
      const status = credential !== settings.passphrase ? false : !state.admin;
      if (state.admin !== status) logger.info(`admin changed to ${status}`);
      return { ...state, admin: status };
    }
    default:
      throw new Error(`Unknown action ${type}`);
  }
};

const DebugContextProvider = ({ children }) => {
  const [{ debug, admin }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    setLogOn(debug);
  }, [debug]);

  const toggleDebug = () => {
    dispatch({ type: "debug/toggle" });
  };

  const toggleAdmin = (credential) => {
    dispatch({ type: "admin/toggle", payload: { credential } });
  };

  const contextValues = useMemo(() => ({ debug, toggleDebug, admin, toggleAdmin }), [debug, admin]); // value is cached by useMemo
  return <DebugContext.Provider value={contextValues}>{children}</DebugContext.Provider>;
};

DebugContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to consume the DebugContext
const useDebugContext = () => {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error("useDebugContext must be used within a DebugContextProvider");
  }
  return context;
};

export { DebugContextProvider, useDebugContext };
