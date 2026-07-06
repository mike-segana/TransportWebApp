"use client";

import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function TopBar() {
    const router = useRouter();

    const handleLogout = () => {
        api.post("/auth/logout");
        //router.push("/login");
        router.replace("/login");
        router.refresh();
    };

    return (
        <div className="flex justify-between items-center p-4 border-b bg-white">
            {/*Left Side*/}
            <div>
                <h1 className="text-lg font-semibold">
                    Welcome back 👋
                </h1>
            </div>
            {/*Right Side*/}
            <div className="flex items-center gap-4">
                {/*Placeholder for notification icon*/}
                <span className="text-gray-500">🔔</span>
            
                {/*Profile*/}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300">
                        <span className="text-sm">User</span>
                    </div>
                </div>
                <button onClick={handleLogout} className="textl-sm text-red-600">Logout</button>
            </div>
        </div>
    );
}