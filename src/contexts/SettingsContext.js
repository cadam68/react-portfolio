import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import useLocalStorageReducer from "../hooks/UseLocalStorageReducer";
import PropTypes from "prop-types";
import { value } from "lodash/seq";

const SettingsContext = createContext({
  firstTime: true,
  reset: () => {},
  themeId: 0,
  setThemeId: () => {},
  getInput: () => {},
  setInput: () => {},
});

const initialState = { firstTime: true, themeId: 0, inputs: {} };

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
    case "inputs/set": {
      const { inputId, value } = payload;
      return { ...state, inputs: { ...state.inputs, [inputId]: value } };
    }
    case "inputs/del": {
      const { inputId } = payload;
      const { [inputId]: removedField, ...newInputs } = state.inputs;
      return { ...state, inputs: newInputs };
    }
    case "inputs/reset": {
      return { ...state, inputs: initialState.inputs };
    }
    default:
      throw new Error(`Unknown action ${type}`);
  }
};

const SettingsContextProvider = ({ children }) => {
  const [{ firstTime, themeId, inputs }, dispatch] = useLocalStorageReducer("inline-settings", initialState, reducer);
  const firstTimeRef = useRef(firstTime);

  const resetInputs = () => {
    dispatch({ type: "inputs/reset" });
  };

  const delInput = inputId => {
    dispatch({ type: "inputs/del", payload: { inputId: inputId } });
  };

  const setInput = (inputId, value) => {
    dispatch({ type: "inputs/set", payload: { inputId: inputId, value: value } });
  };

  const getInput = inputId => {
    return inputs?inputs[inputId]:undefined;
  };

  useEffect(() => {
    if (firstTime) dispatch({ type: "firstTime/false" });
  }, [firstTime]);

  const reset = () => {
    dispatch({ type: "reset" });
  };

  const setThemeId = themeId => {
    dispatch({ type: "themeId/set", payload: { themeId } });
  };

  const contextValues = useMemo(() => ({ firstTime: firstTimeRef.current, reset, themeId, setThemeId, getInput, setInput }), [firstTime, themeId, inputs]);
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
