import { generateColorPalette } from "./services/Helper";

export const settings = {
  version: 2.0,
  palette: generateColorPalette(6),
  passphrase: process.env.REACT_APP_PASSPHRASE || "passphrase",
  apiKey: process.env.REACT_APP_API_KEY || "apiKey",
  baseApiUrl: process.env.REACT_APP_API_URL || "http://localhost:5001",
  basicDataReferences: ["users", "countries", "products"], // exemple of implementation
  downloadTypes: ["card", "video", "carousel", "file", "url"],
  availableLanguages: { fr: "🇫🇷", en: "🇺🇸", de: "🇩🇪", es: "🇪🇸" },
  appName: "portfolio",
  refreshTokenInterval: 15, // Interval in min, set to 0 to disable the refreshToken feature
  documentMaxSize: 5 * 1024 * 1024, // Maximum uploaded file size in bytes (5 MB in this case)
  documentAllowedExtensions: ["pdf", "jpg", "png", "mp4", "card", "carousel.json"], // Allowed file extensions
};
