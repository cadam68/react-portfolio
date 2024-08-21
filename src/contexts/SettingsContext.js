import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import useLocalStorageReducer from "../hooks/UseLocalStorageReducer";
import PropTypes from "prop-types";

const SettingsContext = createContext({
  firstTime: true,
  reset: () => {},
  themeId: 0,
  setThemeId: () => {},
});

const initialState = { firstTime: true, themeId: 0 };

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "firstTime/false":
      return { ...state, firstTime: false };
    case "themeId/set": {
      const { themeId } = payload;
      return { ...state, themeId };
    }
    case "reset":
      return initialState;
    default:
      throw new Error(`Unknown action ${type}`);
  }
};

const SettingsContextProvider = ({ children }) => {
  const [{ firstTime, themeId }, dispatch] = useLocalStorageReducer("inline-settings", initialState, reducer);
  const firstTimeRef = useRef(firstTime);

  useEffect(() => {
    if (firstTime) dispatch({ type: "firstTime/false" });
  }, [firstTime]);

  const reset = () => {
    dispatch({ type: "reset" });
  };

  const setThemeId = (themeId) => {
    dispatch({ type: "themeId/set", payload: { themeId } });
  };

  const contextValues = useMemo(() => ({ firstTime: firstTimeRef.current, reset, themeId, setThemeId }), [firstTime, themeId]);
  return <SettingsContext.Provider value={contextValues}>{children}</SettingsContext.Provider>;
};

// Custom hook to consume the SettingsContext
const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettingsContext must be used within a SettingsContextProvider");
  }
  return context;
};

SettingsContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { SettingsContextProvider, useSettingsContext };
