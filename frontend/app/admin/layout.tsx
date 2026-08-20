"use client";

import { useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminTopbar from "@/components/layout/AdminTopbar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-dvh overflow-hidden bg-[#F7F7F5]">
            <div
                className={`h-full shrink-0 overflow-hidden transition-[width] duration-200 ${
                    sidebarOpen ? "w-[240px]" : "w-0"
                }`}
            >
                <AdminSidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />
            </div>

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <AdminTopbar
                    sidebarOpen={sidebarOpen}
                    onToggleSidebar={() =>
                        setSidebarOpen((previous) => !previous)
                    }
                />

                <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}