import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/lib/theme-provider";
import { NotificationProvider } from "@/lib/notification-provider";
import "./styles/globals.css";
import App from "./App.tsx";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find root element");
}

createRoot(rootElement).render(
  <ThemeProvider>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </ThemeProvider>
);
