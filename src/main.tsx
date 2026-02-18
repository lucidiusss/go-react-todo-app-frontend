import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
        <Toaster
            position="top-right" // Позиция уведомлений
            reverseOrder={false}
            toastOptions={{
                duration: 4000, // Длительность показа (мс)
                style: {
                    background: "#f8fafc",
                    color: "black",
                },
            }}
        />
    </StrictMode>,
);
