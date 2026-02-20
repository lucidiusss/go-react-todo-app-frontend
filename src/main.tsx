import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./Login.tsx";
import Register from "./Register.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
        ,
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
