import { useEffect, useReducer } from "react";
import { Log } from "../services/LogService";
import { loadFromLocalStorage, saveToLocalStorage } from "../services/Helper";

const logger = Log("UseLocalStorageReducer");

const loadInitialState = (key, converter) => initialValue => {
  try {
    let parsedObj;
    // let storedValue = localStorage.getItem(key);  // retrieve clear data
    let storedValue = loadFromLocalStorage(key); // retrieve encrypted data
    logger.debug(`load ${key} from localStorage : ${storedValue}`);

    if (storedValue) parsedObj = converter(JSON.parse(storedValue));
    return storedValue ? parsedObj : initialValue;
  } catch (err) {
    logger.debug(`error parsing localStorage[${key}] due to ${err.message}`);
    return initialValue;
  }
};

const UseLocalStorageReducer = (key, initialValue, reducer, converter = id => id) => {
  const [state, dispatch] = useReducer(reducer, initialValue, loadInitialState(key, converter));

  useEffect(() => {
    logger.debug(`save ${key} in localStorage :  ${JSON.stringify(state)}`);
    // localStorage.setItem(key, JSON.stringify(state)); // save clear data
    saveToLocalStorage(key, JSON.stringify(state)); // save encrypt data
  }, [key, state]);

  return [state, dispatch];
};

export default UseLocalStorageReducer;
