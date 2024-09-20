import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./common.css";
import App from "./App";
import { DebugContextProvider } from "./contexts/DebugContext";
import { SettingsContextProvider } from "./contexts/SettingsContext";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { AppContextProvider } from "./contexts/AppContext";
import { ToastProvider } from "./contexts/ToastContext";
import "./i18n";
import { AuthContextProvider } from "./contexts/AuthContext";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { settings } from "./Settings";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <DebugContextProvider>
    <SettingsContextProvider>
      <AppContextProvider>
        <ToastProvider>
          <WebSocketProvider appName={settings.appName}>
            <DndProvider backend={HTML5Backend}>
              <AuthContextProvider>
                <App />
              </AuthContextProvider>
            </DndProvider>
          </WebSocketProvider>
        </ToastProvider>
      </AppContextProvider>
    </SettingsContextProvider>
  </DebugContextProvider>
);
