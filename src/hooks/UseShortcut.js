import { useEffect } from "react";
import { Log } from "../services/LogService";

const logger = Log("useShortcut");

let callBackRef = [];

const useShortcut = (shortcut, label, callback, id = Math.random()) => {
  callBackRef = [...callBackRef, { shortcut, label, callback, id }]; // add the new shortcut
  logger.debug(`callBackRef=${JSON.stringify(callBackRef)}`);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!event.ctrlKey) return; // Early exit if Ctrl not pressed

      let keys = shortcut.split("+");
      let key = keys.pop();
      let modifiersMatch = keys.every((modifier) => {
        if (modifier === "Ctrl") return event.ctrlKey;
        if (modifier === "Shift") return event.shiftKey;
        if (modifier === "Alt") return event.altKey;
        return false;
      });
      if (!modifiersMatch) return;

      // check if only the requested keys where pressed
      keys = `${event.ctrlKey ? "Ctrl+" : ""}${event.shiftKey ? "Shift+" : ""}${event.altKey ? "Alt" : ""}`.split("+");
      modifiersMatch = keys.every((modifier) => {
        return shortcut.indexOf(modifier) !== -1;
      });
      if (!modifiersMatch) return;

      if (event.key.toUpperCase() === key.toUpperCase()) {
        event.preventDefault();
        const item = callBackRef.findLast((item) => item.shortcut === shortcut);
        if (item && item.callback === callback) {
          logger.debug(`find a matching enable shortcut=[${item.shortcut}], label=[${item.label}], id=[${item.id}] to the event`);
          item.callback();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress); // remove window event listener
      logger.debug(`window.removeEventListener(keydown, shortcut=[${shortcut}, label=[${label}], id=[${id}]])`);
      callBackRef = callBackRef.filter((item) => item.id !== id);
    };
  }, [callback]);
};

export default useShortcut;
