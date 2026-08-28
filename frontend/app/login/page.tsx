"use client"; //tells next.js that this page runs in browser and not on server which is necessary because it uses useState, localStorage and click handlers
              //server: when you want data, security or dont need clicks/ interactions - client when: user interacts with UI, state changes in real time, browser APIs are needed

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        if (!username || !password) {
            alert("Please enter your username and password.");
            return;

        }
        try {
            setLoading(true);
            
            const formData = new URLSearchParams(); //URLSearchParams because fastapi with oauth2 used which expects application/x-www-form-urlencoded not json
            formData.append("username", username);
            formData.append("password", password);

            const res = await fetch("/api/auth/login", {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                const userRes = await fetch("/api/backend/auth/me");
                console.log(userRes);
                if (!userRes.ok) {
                    alert("Could not retrieve user information");
                    return;
                }
                const user = await userRes.json();
                if (user.role === "admin") {
                    router.push("/admin");
                } else {
                    router.push("/dashboard");
                }
            } else {
                alert("Invalid username or password.");
            }
        } catch {
            alert("Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#F7F7F5]">

            {/* Ambient background */}

            <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#315CFF]/[0.06] blur-3xl" />

            <div className="pointer-events-none absolute -bottom-40 -left-40 h-[450px] w-[450px] rounded-full bg-black/[0.025] blur-3xl" />

            {/* Top brand */}

            <div className="absolute left-6 top-6 z-50 sm:left-10 sm:top-8">
                <Link
                    href="/"
                    aria-label="Return to TransitFlow home page"
                    className="group flex items-center gap-3"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#181A1D] text-white shadow-sm transition group-hover:bg-[#315CFF]">
                        <span className="text-sm font-bold">T</span>
                    </div>

                    <span className="text-sm font-semibold tracking-[-0.025em] text-[#171A1F]">
                        TransitFlow
                    </span>
                </Link>
            </div>

            {/* Login area */}

            <div className="relative flex min-h-screen items-center justify-center px-5 py-24">

                <div className="w-full max-w-[430px]">

                    {/* Heading */}

                    <div className="mb-8 text-center">

                        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#315CFF]">
                            Customer portal
                        </p>

                        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-[#171A1F]">
                            Welcome back
                        </h1>

                        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-black/40">
                            Sign in to manage your transport requests,
                            shipments and journeys.
                        </p>

                    </div>

                    {/* Card */}

                    <div className="rounded-[28px] border border-black/[0.055] bg-white p-7 shadow-[0_25px_80px_rgba(0,0,0,0.07)] sm:p-9">

                        <div className="space-y-5">

                            {/* Username */}

                            <div>
                                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-black/40">
                                    Username
                                </label>

                                <input
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    placeholder="Enter your username"
                                    autoComplete="username"
                                    className="h-12 w-full rounded-xl border border-black/[0.08] bg-[#FAFAF9] px-4 text-sm text-[#171A1F] outline-none transition placeholder:text-black/25 focus:border-[#315CFF]/40 focus:bg-white focus:ring-4 focus:ring-[#315CFF]/[0.06]"
                                />
                            </div>

                            {/* Password */}

                            <div>
                                <div className="mb-2 flex items-center justify-between">

                                    <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/40">
                                        Password
                                    </label>

                                    <button
                                        type="button"
                                        className="text-[10px] font-medium text-[#315CFF] hover:underline"
                                    >
                                        Forgot password?
                                    </button>

                                </div>

                                <input
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleLogin();
                                        }
                                    }}
                                    placeholder="Enter your password"
                                    type="password"
                                    autoComplete="current-password"
                                    className="h-12 w-full rounded-xl border border-black/[0.08] bg-[#FAFAF9] px-4 text-sm text-[#171A1F] outline-none transition placeholder:text-black/25 focus:border-[#315CFF]/40 focus:bg-white focus:ring-4 focus:ring-[#315CFF]/[0.06]"
                                />
                            </div>

                            {/* Login */}

                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#315CFF] text-sm font-semibold text-white shadow-[0_10px_25px_rgba(49,92,255,0.18)] transition-all duration-300 hover:bg-[#416BFF] hover:shadow-[0_14px_30px_rgba(49,92,255,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Signing in..." : "Sign in"}

                                {!loading && (
                                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                                        →
                                    </span>
                                )}
                            </button>

                        </div>

                        {/* Divider */}

                        <div className="my-7 flex items-center gap-4">
                            <div className="h-px flex-1 bg-black/[0.06]" />

                            <span className="text-[9px] font-medium uppercase tracking-widest text-black/25">
                                New to TransitFlow?
                            </span>

                            <div className="h-px flex-1 bg-black/[0.06]" />
                        </div>

                        {/* Register */}

                        <button
                            onClick={() => router.push("/register")}
                            className="h-12 w-full rounded-xl border border-black/[0.08] bg-white text-sm font-semibold text-[#171A1F] transition hover:border-[#315CFF]/25 hover:bg-[#315CFF]/[0.025]"
                        >
                            Create an account
                        </button>

                    </div>

                    {/* Back */}

                    <button
                        onClick={() => router.push("/")}
                        className="mx-auto mt-6 flex items-center gap-2 text-[11px] font-medium text-black/35 transition hover:text-[#315CFF]"
                    >
                        ← Back to TransitFlow
                    </button>

                </div>
            </div>

        </main>
    );
}