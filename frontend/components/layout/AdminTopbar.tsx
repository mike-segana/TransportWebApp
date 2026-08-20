"use client";

import { usePathname } from "next/navigation";

export default function AdminTopBar({
    sidebarOpen,
    onToggleSidebar,
}: {
    sidebarOpen: boolean;
    onToggleSidebar: () => void;
}) {
    const pathname = usePathname();

    const getPageInfo = () => {
        if (pathname === "/dashboard") {
            return {
                title: "Dashboard",
                description: "Overview of your transport activity",
            };
        }

        if (pathname.startsWith("/dashboard/requests")) {
            return {
                title: "Requests",
                description: "Manage your transport requests",
            };
        }

        if (pathname.startsWith("/dashboard/shipments")) {
            return {
                title: "Shipments",
                description: "Track your active and completed shipments",
            };
        }

        if (pathname.startsWith("/dashboard/create-request")) {
            return {
                title: "Create Request",
                description: "Submit a new transport request",
            };
        }

        return {
            title: "TransitFlow",
            description: "Transport management",
        };
    };

    const page = getPageInfo();

    return (
        <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-black/[0.06] bg-white px-5 sm:px-7 lg:px-8">
            {/* Left */}
            <div className="flex min-w-0 items-center gap-3">
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    aria-label={
                        sidebarOpen
                            ? "Collapse sidebar"
                            : "Open sidebar"
                    }
                    aria-expanded={sidebarOpen}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-black/[0.06] bg-[#FAFAF9] text-black/45 transition hover:border-black/[0.1] hover:bg-black/[0.025] hover:text-[#171A1F]"
                >
                    <span className="text-lg leading-none">
                        {sidebarOpen ? "‹" : "☰"}
                    </span>
                </button>

                <div className="min-w-0">
                    <h1 className="truncate text-base font-semibold tracking-[-0.02em] text-[#171A1F]">
                        {page.title}
                    </h1>

                    <p className="mt-0.5 hidden truncate text-xs text-black/35 sm:block">
                        {page.description}
                    </p>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="hidden text-right sm:block">
                        <p className="text-xs font-semibold text-[#171A1F]">
                            Administrator
                        </p>

                        <p className="text-[10px] text-black/35">
                            Operations Portal
                        </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#171A1F] text-xs font-bold text-white">
                        A
                    </div>
                </div>
            </div>
        </header>
    );
}