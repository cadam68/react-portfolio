import { Log } from "./LogService";
import i18next from "i18next";
import { settings } from "../Settings";
import Ajv from "ajv";
import addFormats from "ajv-formats";
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export const t = (key, params) => {
  return i18next.t(key, params);
};

export const handleFormikFieldChange = (formikProps, format = null, e) => {
  const numberRegex = /number\[(\d+)-(\d+)]/;
  const alphaRegex = /alpha\[(\d+)]/;
  const alphaNumRegex = /alphaNum\[(\d+)]/;

  const clearError = errorName => {
    if (formikProps.errors.hasOwnProperty(errorName)) {
      const newErrors = { ...formikProps.errors };
      delete newErrors[errorName];
      formikProps.setErrors(newErrors);
    }
  };

  // Log().debug(`event ${e.target.name}=[${e.target.value}] raised`);
  let value = e.target.value;

  if (e.target.localName === "input") {
    if (format.match(alphaRegex)) {
      const [, maxLength] = format.match(alphaRegex);
      value = e.target.value.replace(/[^A-Za-z., ]/g, "").substring(0, maxLength);
      formikProps.setFieldValue(e.target.name, value, false);
      clearError(e.target.name);
    } else if (format.match(alphaNumRegex)) {
      const [, maxLength] = format.match(alphaNumRegex);
      value = e.target.value.replace(/[^A-Za-z0-9., ]/g, "").substring(0, maxLength);
      formikProps.setFieldValue(e.target.name, value, false);
      clearError(e.target.name);
    } else if (format.match(numberRegex)) {
      value = Number(value);
      const [, minValue, maxValue] = format.match(numberRegex);
      if (e.target.value === "" || (value >= minValue && value <= maxValue)) {
        formikProps.setFieldValue(e.target.name, e.target.value === "" ? "" : value, false);
        clearError(e.target.name);
      } else formikProps.setFieldError(e.target.name, t("mustBeBetween", { min: minValue, max: maxValue }));
    }
  } else if (e.target.localName === "select") {
    formikProps.setFieldValue(e.target.name, value, false);
    clearError(e.target.name);
  }
};

export const handleFormikFieldBlur = ({ handleBlur }, callback, e) => {
  handleBlur(e); //!\ important
  Log().debug(`${e.target.name} value changed to ${e.target.value}`);
  callback(e);
};

// Function to change the filter property of the ::before pseudo-element
// Usage : changeBeforeFilter('hue-rotate(180deg) saturate(1.5)');
export const changeBeforeFilter = filterValue => {
  // Check if the style element already exists
  const styleId = "custom-filter-style";
  let style = document.getElementById(styleId);

  // If it doesn't exist, create a new style tag
  if (!style) {
    style = document.createElement("style");
    style.type = "text/css";
    style.id = styleId;
    document.head.appendChild(style);
  }

  // Add the CSS for the .container::before selector with the new filter value
  style.innerHTML = `.container::before { filter: ${filterValue}; }`;
};

export const changeTheme = newTheme => {
  // Access the root element
  const root = document.documentElement;
  const randomPalette = generateColorPalette();

  // Change the CSS custom properties
  root.style.setProperty("--color-lightest", newTheme ? newTheme.colorLightest : randomPalette[0]);
  root.style.setProperty("--color-light", newTheme ? newTheme.colorLight : randomPalette[1]);
  root.style.setProperty("--color-medium", newTheme ? newTheme.colorMedium : randomPalette[2]);
  root.style.setProperty("--color-dark", newTheme ? newTheme.colorDark : randomPalette[3]);
  root.style.setProperty("--color-background", newTheme?.colorBackground ? newTheme.colorBackground : themes.light.colorBackground);
  root.style.setProperty("--font-family", newTheme?.fontFamily ? newTheme?.fontFamily : themes.light.fontFamily);
};

export const changePortfolioTheme = newTheme => {
  // Access the root element
  const root = document.documentElement;

  // Change the CSS custom properties
  if (newTheme?.colorTheme) root.style.setProperty("--color-portfolio_theme", newTheme.colorTheme);
  if (newTheme?.colorThemeStrong) root.style.setProperty("--color-portfolio_theme_strong", newTheme.colorThemeStrong);
  if (newTheme?.colorBackground) root.style.setProperty("--color-portfolio_background", newTheme.colorBackground);
  if (newTheme?.colorHeaderBackground) root.style.setProperty("--color-portfolio_header_background", newTheme.colorHeaderBackground);
};

export const changeFontFamily = newFontFamily => {
  const root = document.documentElement;
  root.style.setProperty("--font-family", newFontFamily ? newFontFamily : "white");
};

export const generateColorPalette = (nbColors = 4) => {
  let palette = [];
  const step = 360 / nbColors;
  const base = Math.floor(360 * Math.random());
  for (let i = 0; i < nbColors; i++) {
    // Generate a hue value (i * 90 ensures even distribution across the color wheel)
    let hue = (i * step + base) % 360; // This will give us 4 colors spread evenly across the color wheel
    // Set saturation and lightness values
    let saturation = 80; // Saturation at 70%
    let lightness = 80; // Lightness at 50%
    // Construct HSL color string
    let color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    // Add color to the palette
    palette.push(color);
  }
  return palette;
};

export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const themes = {
  light: {
    colorLightest: "#fff4e6",
    colorLight: "#ffe8cc",
    colorMedium: "#ffa94d",
    colorDark: "#ff922b",
    colorBackground: "white",
    fontFamily: "Poppins, Sans-serif",
  },
  dark: {
    colorLightest: "#f8f9fa",
    colorLight: "#e9ecef",
    colorMedium: "#ced4da",
    colorDark: "#adb5bd",
    colorBackground: "white",
    fontFamily: "Poppins, Sans-serif",
  },
  sun: {
    colorLightest: "#f4f4f8",
    colorLight: "#e6e6ea",
    colorMedium: "#fed766",
    colorDark: "#2ab7ca",
    colorBackground: "white",
    fontFamily: "Poppins, Sans-serif",
  },
  random: null,
};

export const themes_portfolio = {
  default: {
    colorTheme: "#2F80ED",
    colorThemeStrong: "#185ABD",
    colorBackground: "#fdfdfd",
    colorHeaderBackground: "#ffffff",
  },
};

export const capitalizeAfterPeriod = inputString => {
  inputString = inputString.trim().replace(/\s+/g, " ").replace(/\s\./g, ".");
  return inputString.charAt(0).toUpperCase() + inputString.slice(1).replace(/\.\s[a-z]/g, match => match.toUpperCase());
};

// const rgbaColor = hslToRgba(210, 100, 50, 0.5); // Converts HSL(210, 100%, 50%) to RGBA
const hslToRgba = (h, s, l, a = 1) => {
  s /= 100;
  l /= 100;

  const k = n => (n + h / 30) % 12;
  const a2 = s * Math.min(l, 1 - l);
  const f = n => l - a2 * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1);

  const r = Math.round(255 * f(0));
  const g = Math.round(255 * f(8));
  const b = Math.round(255 * f(4));

  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const hsl2Rgba = (hslString, a = 1) => {
  const regex = /hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/;
  const match = hslString.match(regex);
  if (match) {
    const [, h, s, l] = match;
    return hslToRgba(parseInt(h, 10), parseInt(s, 10), parseInt(l, 10), a);
  }
  return null;
};

export const getLastExpenseDate = (expenses, reverse = false) => [...new Set(expenses.map(item => item.date))].sort((a, b) => a - b).at(reverse ? -1 : 0) || new Date();

export const setFieldRefValue = (fieldRef, value) => {
  Log().debug(`set element[name='${fieldRef?.name}', tagName='${fieldRef?.tagName}'].value=[${value}]`);
  if (!fieldRef) return false;
  if (fieldRef.tagName === "SELECT" || fieldRef.tagName === "INPUT") {
    fieldRef.focus();
    fieldRef.value = value;
    fieldRef.dispatchEvent(new Event("change", { bubbles: true }));
  }
  return true;
};

// usage : if(value.between(500, 600)) { ... } ;
Number.prototype.between = function (a, b) {
  const min = Math.min(a, b),
    max = Math.max(a, b);
  return this > min && this < max;
};

/* Usage
const queue = new Queue();
queue.enqueue('a');
queue.enqueue('b');
queue.enqueue('c');
console.log(queue.dequeue()); // Outputs: 'a'
console.log(queue.peek());    // Outputs: 'b'
console.log(queue.size());    // Outputs: 2
 */
export class Queue {
  constructor() {
    this.items = [];
  }

  // Add an element to the end of the queue
  enqueue(element) {
    this.items.push(element);
  }

  // Remove an element from the front of the queue
  dequeue() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    return this.items.shift();
  }

  // Check if the queue is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Get the first element of the queue
  peek() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    return this.items[0];
  }

  // Get the length of the queue
  size() {
    return this.items.length;
  }

  // Clear the queue
  clear() {
    this.items = [];
  }
}

export const getFilteredLanguages = downloadReferences => {
  if (!downloadReferences) return;
  const uniqueLgValues = downloadReferences.reduce((acc, item) => {
    if (item.lg && !acc.includes(item.lg)) {
      acc.push(item.lg);
    }
    return acc;
  }, []);
  const filteredLanguages = Object.keys(settings.availableLanguages)
    .filter(key => uniqueLgValues.includes(key))
    .reduce((obj, key) => {
      obj[key] = settings.availableLanguages[key];
      return obj;
    }, {});
  return filteredLanguages;
};

export const sortAndLimitPortfolioItems = (items, limit = 100) => {
  // Shuffle both VIP and non-VIP items
  const shuffle = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };
  // Separate VIP and non-VIP items
  const vipItems = items.filter(item => (item.privilege ?? "").includes("VIP"));
  const nonVipItems = items.filter(item => !(item.privilege ?? "").includes("VIP"));
  shuffle(nonVipItems);

  // Insert all VIP items within the first 100 positions
  const insertionLimit = Math.min(limit - vipItems.length, nonVipItems.length);
  const combinedItems = nonVipItems.slice(0, insertionLimit);

  // Merge VIP items into the selected portion of non-VIP items
  combinedItems.push(...vipItems);
  shuffle(combinedItems);

  // Combine the shuffled part with the rest of the non-VIP items
  const result = combinedItems.concat(nonVipItems.slice(insertionLimit));

  return result;
};

export const removeDiacritics = str => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const validateSchema = jsonObj => {
  const schemas = {
    profile: {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      properties: {
        userId: { type: "string", pattern: "^[a-zA-Z0-9_-]+$" },
        name: { type: "string", minLength: 1 },
        email: { type: ["string", "null"], format: "email" },
        title: { type: "string", minLength: 1 },
        subTitle: { type: ["string", "null"], minLength: 1 },
        downloadReferences: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", pattern: "^[\\w\\[\\]-]+$" },
              lg: { type: ["string", "null"], enum: ["en", "fr", "de", null] },
              type: { type: "string", enum: ["card", "video", "carousel", "file", "url", "mailto"] },
              target: { type: "string", pattern: "^(firebase:\\/\\/.+\\.(card|mp4|json|pdf)|https?:\\/\\/\\S+|mailto:\\S+@\\S+\\.\\S+)$" },
            },
            required: ["id", "type", "target"],
            additionalProperties: false,
          },
        },
        palette: {
          type: ["object", "null"],
          properties: {
            colorTheme: { type: "string" },
            colorThemeStrong: { type: "string" },
            colorBackground: { type: "string" },
            colorHeaderBackground: { type: "string" },
          },
          required: ["colorTheme", "colorThemeStrong"],
          additionalProperties: false,
        },
        style: { type: ["string", "null"], enum: ["rotate-content", "photo-content"] },
      },
      required: ["userId", "name", "email", "title", "subTitle", "downloadReferences"],
      additionalProperties: false,
    },
  };

  const validate = ajv.compile(schemas.profile);
  const valid = validate(jsonObj);
  if (!valid) {
    const errorString = validate.errors.map(err => `${err.instancePath} ${err.message}`).join("; ");
    throw new Error(`Invalid profile schema: ${errorString}`);
  }
};

export const copyToClipboard = async text => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
};
