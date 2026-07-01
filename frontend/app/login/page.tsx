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
        <div className="p-6 max-w-sm mx-auto mt-20 flex flex-col justify-center"> {/*(flex)turns elements into flex container, (flex-col)stacks child elements vertically using flexbox*/}
        {/*Tailwind css padding, (max-w-sm)width constraint, (mx-auto)horizontal centaring mt-20(top spacing moves box down)*/}
            <h1 className="text-2xl font-bold text-black-600 tracking-tight text-center"> {/*text-2xl makes text larger,  (tracking-tight) tight letter spacing*/}
                TransitFlow
            </h1>

            <input placeholder="username" className="border p-1 mb-1" onChange={(e) => setUsername(e.target.value)}/>
            <input placeholder="password" type="password" className="border p-1" onChange={(e) => setPassword(e.target.value)}/>

            <button 
                onClick={handleLogin}
                className="w-full mt-1 bg-blue-600 text-white py-2 rounded mb-1"> 
                {/*(w-full)full width, (mt-4)space of 4 above button, blue-white, (py-2)vertical padding height control, rounded corners */}
                Login
            </button>
            <button onClick={() => router.push("/register")} className="w-full bg-blue-600 text-white py-1 rounded">Sign Up</button>
        </div>
        
    );
}