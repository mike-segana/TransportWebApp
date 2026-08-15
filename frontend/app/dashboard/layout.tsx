"use client"
import { useState } from "react";
import SideBar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/Topbar";

//file to define dashboard shell (Sidebar and Topbar)
//{children} is a placeholder for nested content
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode; //typescript so type of children placeholder is specified, it can be any valid react component
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    return (
        <div className="flex h-dvh overflow-hidden bg-[#F7F7F5]">
            {/* Sidebar */}
            <div
                className={`h-full shrink-0 overflow-hidden transition-[width] duration-200 ${
                    sidebarOpen ? "w-[240px]" : "w-0"
                }`}
            >
                <SideBar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />
            </div>

            {/* Main application */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <TopBar
                    sidebarOpen={sidebarOpen}
                    onToggleSidebar={() =>
                        setSidebarOpen((previous) => !previous)
                    }
                />

                <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}