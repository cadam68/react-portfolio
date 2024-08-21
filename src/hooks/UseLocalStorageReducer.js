import { useEffect, useReducer } from "react";
import { Log } from "../services/LogService";

const logger = Log("UseLocalStorageReducer");

const loadInitialState = (key, converter) => (initialValue) => {
  let parsedObj;
  let storedValue = localStorage.getItem(key);
  logger.debug(`load ${key} from localStorage : ${storedValue}`);

  if (storedValue) parsedObj = converter(JSON.parse(storedValue));
  return storedValue ? parsedObj : initialValue;
};

const UseLocalStorageReducer = (key, initialValue, reducer, converter = (id) => id) => {
  const [state, dispatch] = useReducer(reducer, initialValue, loadInitialState(key, converter));

  useEffect(() => {
    logger.debug(`save ${key} in localStorage :  ${JSON.stringify(state)}`);
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, dispatch];
};

export default UseLocalStorageReducer;
