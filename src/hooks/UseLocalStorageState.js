import { useState, useEffect } from "react";
import { Log } from "../services/LogService";
import { settings } from "../Settings";
import { startOfDay } from "date-fns";
import { loadFromLocalStorage, saveToLocalStorage } from "../services/Helper";

/*
Usage : const { categories, setCategories, addCategory, ... } = CategoriesService(UseLocalStorageState("expense-tracker-categories", initialCategories));
 */

const logger = Log("UseLocalStorageState");

const loadData = (key, initialValue) => () => {
  // if (key !== "expense-tracker-firstTime") localStorage.removeItem(key); // todo - comment to persist all values -

  let parsedObj, storedValue;
  try {
    // storedValue = localStorage.getItem(key);     // retrieve clear data
    storedValue = loadFromLocalStorage(key); // retrieve encrypted data
    logger.debug(`load ${key} from localStorage : [${storedValue}]`);

    //!\ dates are converted to strings because JSON doesn't have a native date type. //!\
    if (storedValue) {
      parsedObj = JSON.parse(storedValue);
      switch (key) {
        case "expense-tracker-expenses":
          parsedObj.forEach(item => {
            if (item.date && !isNaN(Date.parse(item.date))) item.date = startOfDay(new Date(item.date));
          });
          break;

        case "expense-tracker-categories":
          const missingColors = parsedObj.some(item => !item.color);
          if (missingColors) {
            parsedObj.forEach((item, i) => {
              if (!item.color) item.color = settings.palette[i];
            });
          }
          break;
      }
    }
  } catch (err) {
    logger.debug(`error parsing localStorage[${key}] due to ${err.message}`);
    return initialValue;
  }

  return storedValue ? parsedObj : initialValue;
};

const UseLocalStorageState = (key, initialValue) => {
  const [state, setState] = useState(loadData(key, initialValue)); // <--- loadData returns a function :)

  useEffect(() => {
    // Update localStorage when 'items' state changes
    logger.debug(`save ${key} in localStorage :  ${JSON.stringify(state)}`);
    saveToLocalStorage(key, JSON.stringify(state)); // save encrypt data
    // localStorage.setItem(key, JSON.stringify(state));    // save clear data
  }, [key, state]);

  return [state, setState];
};

export default UseLocalStorageState;
