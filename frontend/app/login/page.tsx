"use client"; //tells next.js that this page runs in browser and not on server which is necessary because it uses useState, localStorage and click handlers
              //server: when you want data, security or dont need clicks/ interactions - client when: user interacts with UI, state changes in real time, browser APIs are needed

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const formData = new URLSearchParams(); //URLSearchParams because fastapi with oauth2 used which expects application/x-www-form-urlencoded not json
            formData.append("username", username);
            formData.append("password", password);

            const res = await api.post("/auth/token", formData); //backend returns jwt

            localStorage.setItem("token", res.data.access_token); //frontend stores jwt in browser

            router.push("/dashboard");
        } catch (err) {
            alert("Login failed");
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Login</h1>

            <input
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                placeholder="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>Login</button>
        </div>
    );
}