"use client";

import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function SideBar() {
    const router = useRouter();

    return (
        <div className="w-64 h-screen border-r p-4 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold">TransitFlow</h2>
                <button onClick={() => router.push("/dashboard")}>
                    Dashboard
                </button>
                <button onClick={() => router.push("/dashboard/shipments")}>
                    My Shipments
                </button>
                <button onClick={() => router.push("/dashboard/requests")}>
                    My Requests
                </button>
                <button onClick={() => router.push("/dashboard/create-request")}>
                    Create Request
                </button>
                <button disabled className="text-gray-400">
                    Notifications
                </button>
                <button disabled className="text-gray-400">
                    Profile
                </button>
                <button disabled className="text-gray-400">
                    Support
                </button>
            </div>
            <div>
                <button onClick={() => {
                    api.post("/auth/logout");
                    //router.push("/login");
                    router.replace("/login");
                    router.refresh();
                }}
                className="text-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}