"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleRegister = async () => {
        try {
            //await is an operator that pauses execution of async func until promsie resolves or rejects then returns the result, in this case once backend response received
            const res = await api.post("/auth/", {
                username,
                password
            });
            
            alert(res.data.message);
            router.push("/login");
        } catch (err: any) {
            alert(err.response?.data?.detail || "Registration failed");
        }
    };
    return (
        <div className="p-6 max-w-sm mx-auto mt-20 flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-black-600 tracking-tight text-center"> {/*text-2xl makes text larger,  (tracking-tight) tight letter spacing*/}
                Register
            </h1>
            <input placeholder="username" className="border p-1 mb-1" onChange={(e) => setUsername(e.target.value)}/>
            <input placeholder="password" type="password" className="border p-1 mb-1" onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={handleRegister} className="w-full bg-blue-600 text-white py-2 rounded mb-1">Register</button>
            <button onClick={() => router.push("/login")} className="w-full bg-blue-600 text-white py-1 rounded">Sign In</button>
        </div>
    );
}