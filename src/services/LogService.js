// LogService.js
import { format } from "date-fns";
import { settings } from "../Settings";

const LogLevel = Object.freeze({
  DEBUG: 0,
  INFO: 1,
  WARNING: 2,
  ERROR: 3,
  FATAL: 4,
});

let currentLogLevel = LogLevel.INFO; // Default log level
let isLogOn = false;

const getLogLevelText = (levelValue) => {
  return Object.keys(LogLevel).reduce((found, key) => {
    if (LogLevel[key] === levelValue) return key;
    return found;
  }, null);
};

const setLogLevel = (level = LogLevel.ERROR) => {
  currentLogLevel = level > LogLevel.ERROR ? LogLevel.ERROR : level;
  log(`logLevel changed to ${getLogLevelText(currentLogLevel)}`);
};

const setLogOn = (status = false) => {
  isLogOn = status;
  // log(`logLevel is ${isLogOn ? `enabled on ${getLogLevelText(currentLogLevel)} level` : "disabled"}`);
};

const fetchLog = async (logLevel, module, text) => {
  //try {
  const logInfo = { logLevel, module, text };

  const response = await fetch(`${settings.baseApiUrl}/log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": settings.apiKey,
    },
    body: JSON.stringify(logInfo),
  });
  return response.status;
  // } catch (err) {
  //   log(err.message, -1, "fetchLog");
  //   return 500;
  // }
};

const log = (message, level = -1, module) => {
  if ((isLogOn && level >= currentLogLevel) || level === -1 || level === LogLevel.FATAL) {
    const moduleText = module ? `[${module}]` : "";
    const currentTime = format(new Date(), "HH:mm:ss");

    switch (level) {
      case LogLevel.DEBUG:
        console.info(`[${currentTime}][D]${moduleText} ${message}`);
        break;
      case LogLevel.INFO:
        console.info(`[${currentTime}][I]${moduleText} ${message}`);
        break;
      case LogLevel.WARNING:
        console.warn(`[${currentTime}][W]${moduleText} ${message}`);
        break;
      case LogLevel.FATAL:
      case LogLevel.ERROR:
        console.error(`[${currentTime}][E]${moduleText} ${message}`);
        break;
      default:
        console.log(`[${currentTime}]${moduleText} ${message}`);
        break;
    }

    // fetch the error to the backend
    switch (level) {
      case LogLevel.FATAL:
      case LogLevel.ERROR:
        fetchLog(level, module, message)
          .then((status) => {})
          .catch((err) => console.error(`[${currentTime}][E][LogService] ${err.message}`));
        break;
      default:
        break;
    }
  }
};

const Log = (module) => ({
  console: (text) => log(text, -1, module),
  debug: (text) => log(text, LogLevel.DEBUG, module),
  info: (text) => log(text, LogLevel.INFO, module),
  warn: (text) => log(text, LogLevel.WARNING, module),
  error: (text) => log(text, LogLevel.ERROR, module),
  fatal: (text) => log(text, LogLevel.FATAL, module),
});

export { Log, log, LogLevel, setLogLevel, setLogOn };
