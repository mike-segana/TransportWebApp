"use client";

import { usePathname, useRouter } from "next/navigation";

type AdminSidebarProps = {
    isOpen: boolean;
};

export default function AdminSidebar({
    isOpen,
}: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const navigation = [
        {
            label: "Overview",
            href: "/admin",
        },
        {
            label: "Requests",
            href: "/admin/requests",
        },
        {
            label: "Shipments",
            href: "/admin/shipments",
        },
        {
            label: "Drivers",
            href: "/admin/drivers",
        },
    ];

    const management = [
        {
            label: "Users",
            href: "/admin/users",
        },
    ];

    const isActive = (href: string) => {
        if (href === "/admin") {
            return pathname === "/admin";
        }

        return pathname.startsWith(href);
    };

    const handleLogout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
        });

        router.replace("/login");
        router.refresh();
    };

    return (
        <aside
            className={`flex h-full w-[240px] shrink-0 flex-col border-r border-black/[0.06] bg-white text-[#171A1F] transition-opacity duration-200 ${
                isOpen
                    ? "opacity-100"
                    : "pointer-events-none opacity-0"
            }`}
        >
            {/* Brand */}
            <div className="flex h-[72px] shrink-0 items-center border-b border-black/[0.05] px-6">
                <button
                    onClick={() => router.push("/admin")}
                    className="flex items-center gap-3"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#171A1F] text-sm font-bold text-white">
                        T
                    </div>

                    <div className="text-left">
                        <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#315CFF]">
                            TransitFlow
                        </p>

                        <p className="text-sm font-semibold tracking-[-0.02em] text-[#171A1F]">
                            Admin Portal
                        </p>
                    </div>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-5">
                <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
                    Operations
                </p>

                <div className="space-y-1">
                    {navigation.map((item) => {
                        const active = isActive(item.href);

                        return (
                            <button
                                key={item.href}
                                onClick={() => router.push(item.href)}
                                className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                                    active
                                        ? "bg-[#315CFF]/[0.08] text-[#315CFF]"
                                        : "text-black/50 hover:bg-black/[0.025] hover:text-[#171A1F]"
                                }`}
                            >
                                <span
                                    className={`mr-3 h-1.5 w-1.5 rounded-full ${
                                        active
                                            ? "bg-[#315CFF]"
                                            : "bg-black/15"
                                    }`}
                                />

                                {item.label}
                            </button>
                        );
                    })}
                </div>

                <p className="mb-3 mt-8 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-black/30">
                    Management
                </p>

                <div className="space-y-1">
                    {management.map((item) => {
                        const active = isActive(item.href);

                        return (
                            <button
                                key={item.href}
                                onClick={() => router.push(item.href)}
                                className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                                    active
                                        ? "bg-[#315CFF]/[0.08] text-[#315CFF]"
                                        : "text-black/50 hover:bg-black/[0.025] hover:text-[#171A1F]"
                                }`}
                            >
                                <span
                                    className={`mr-3 h-1.5 w-1.5 rounded-full ${
                                        active
                                            ? "bg-[#315CFF]"
                                            : "bg-black/15"
                                    }`}
                                />

                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* Logout */}
            <div className="shrink-0 border-t border-black/[0.05] p-4">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-black/45 transition hover:bg-red-50 hover:text-red-600"
                >
                    <span className="mr-3 h-1.5 w-1.5 rounded-full bg-red-400" />
                    Sign out
                </button>
            </div>
        </aside>
    );
}