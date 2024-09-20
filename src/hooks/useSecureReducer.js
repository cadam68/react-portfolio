import { useReducer } from "react";
import _ from "lodash"; // For deep comparison

// Custom Hook
const useSecureReducer = (initialState, additionalReducerLogic) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_PROPERTY": {
        const { propertyName, value } = action.payload;

        // Use _.isEqual for deep comparison of objects/arrays
        if (!_.isEqual(state[propertyName], value)) {
          return {
            ...state,
            [propertyName]: value,
          };
        }

        /*
        // OTHER IMPLEMENTATIOM : Perform deep comparison using JSON.stringify()
        // Check if the existing value is an object or array
        if (typeof state[propertyName] === 'object' && state[propertyName] !== null) {
          if (JSON.stringify(state[propertyName]) !== JSON.stringify(value)) { return { ...state, [propertyName]: value, }}
        } else {
          // For non-object values, perform shallow comparison
          if (state[propertyName] !== value) { return { ...state, [propertyName]: value, }}
        }
        */
        return state; // No change if the value is the same
      }

      case "CLEAR_PROPERTIES": {
        const newState = { ...state };
        action.payload.forEach(propertyName => {
          if (!_.isEqual(state[propertyName], initialState[propertyName])) {
            newState[propertyName] = initialState[propertyName];
          }
        });
        return newState;
      }

      default:
        // If additionalReducerLogic is provided, call it for custom logic
        return additionalReducerLogic ? additionalReducerLogic(state, action) : state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const setSecureState = (propertyName, value) => {
    dispatch({ type: "SET_PROPERTY", payload: { propertyName, value } });
  };

  const clearProperties = properties => {
    dispatch({ type: "CLEAR_PROPERTIES", payload: properties });
  };

  const dispatchService = { setSecureState, clearProperties };

  return [state, dispatch, dispatchService];
};

export default useSecureReducer;
