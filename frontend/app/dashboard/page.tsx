"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

type Shipment = {
    id: number;
    pickup_address: string;
    dropoff_address: string;
    status: string;
};

type Request = {
    id: number;
    pickup_address: string;
    dropoff_address: string;
    request_status: string;
};

export default function Dashboard() {
    const router = useRouter();

    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);

    const pendingRequests = requests.filter(
        (request) => request.request_status.toLowerCase() === "pending"
    );

    const activeShipments = shipments.filter((shipment) =>
        ["pending", "assigned", "in_transit"].includes(
            shipment.status.toLowerCase()
        )
    );

    const deliveredShipments = shipments.filter(
        (shipment) => shipment.status.toLowerCase() === "completed"
    );

    const recentShipments = shipments.slice(0, 4);
    const recentRequests = requests.slice(0, 4);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [shipmentsRes, requestsRes] = await Promise.all([
                    api.get("/api/backend/shipments/my"),
                    api.get("/api/backend/requests/my"),
                ]);

                setShipments(shipmentsRes.data);
                setRequests(requestsRes.data);
            } catch (err: any) {
                if (err.response?.status === 401) {
                    router.replace("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <div className="text-sm text-black/40">
                    Loading dashboard...
                </div>
            </div>
        );
    }

    const statusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
                return "bg-emerald-50 text-emerald-700";

            case "accepted":
            case "assigned":
                return "bg-blue-50 text-blue-700";

            case "in_transit":
                return "bg-indigo-50 text-indigo-700";

            case "denied":
                return "bg-red-50 text-red-700";

            default:
                return "bg-black/[0.04] text-black/50";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-xs font-medium text-[#315CFF]">
                        Overview
                    </p>

                    <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
                        Welcome back
                    </h2>

                    <p className="mt-1 text-sm text-black/40">
                        Here's what's happening with your transport.
                    </p>
                </div>

                <button
                    onClick={() =>
                        router.push("/dashboard/create-request")
                    }
                    className="rounded-xl bg-[#315CFF] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(49,92,255,0.16)] transition hover:bg-[#416BFF]"
                >
                    + Create request
                </button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Active shipments"
                    value={activeShipments.length}
                    description="Currently in progress"
                />

                <StatCard
                    label="Delivered"
                    value={deliveredShipments.length}
                    description="Completed shipments"
                />

                <StatCard
                    label="Pending requests"
                    value={pendingRequests.length}
                    description="Awaiting review"
                />

                <StatCard
                    label="Total requests"
                    value={requests.length}
                    description="All submitted requests"
                />
            </div>

            {/* Tables */}
            <div className="grid gap-5 xl:grid-cols-2">
                {/* Shipments */}
                <DataCard
                    title="Recent shipments"
                    description="Your latest shipment activity"
                    onViewAll={() =>
                        router.push("/dashboard/shipments")
                    }
                >
                    {recentShipments.length === 0 ? (
                        <EmptyState text="No shipments yet." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[520px] text-sm">
                                <thead>
                                    <tr className="border-b border-black/[0.06] text-left text-xs text-black/35">
                                        <th className="px-4 py-3 font-medium">
                                            ID
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Pickup
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Destination
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {recentShipments.map((shipment) => (
                                        <tr
                                            key={shipment.id}
                                            className="border-b border-black/[0.04] last:border-0"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                #{shipment.id}
                                            </td>

                                            <td className="max-w-[140px] truncate px-4 py-3 text-black/60">
                                                {shipment.pickup_address}
                                            </td>

                                            <td className="max-w-[140px] truncate px-4 py-3 text-black/60">
                                                {shipment.dropoff_address}
                                            </td>

                                            <td className="px-4 py-3">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${statusStyle(
                                                        shipment.status
                                                    )}`}
                                                >
                                                    {shipment.status.replace(
                                                        "_",
                                                        " "
                                                    )}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </DataCard>

                {/* Requests */}
                <DataCard
                    title="Recent requests"
                    description="Your latest request activity"
                    onViewAll={() =>
                        router.push("/dashboard/requests")
                    }
                >
                    {recentRequests.length === 0 ? (
                        <EmptyState text="No requests yet." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[520px] text-sm">
                                <thead>
                                    <tr className="border-b border-black/[0.06] text-left text-xs text-black/35">
                                        <th className="px-4 py-3 font-medium">
                                            ID
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Pickup
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Destination
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {recentRequests.map((request) => (
                                        <tr
                                            key={request.id}
                                            className="border-b border-black/[0.04] last:border-0"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                #{request.id}
                                            </td>

                                            <td className="max-w-[140px] truncate px-4 py-3 text-black/60">
                                                {request.pickup_address}
                                            </td>

                                            <td className="max-w-[140px] truncate px-4 py-3 text-black/60">
                                                {request.dropoff_address}
                                            </td>

                                            <td className="px-4 py-3">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${statusStyle(
                                                        request.request_status
                                                    )}`}
                                                >
                                                    {request.request_status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </DataCard>
            </div>
        </div>
    );
}

function StatCard({
    label,
    value,
    description,
}: {
    label: string;
    value: number;
    description: string;
}) {
    return (
        <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_6px_25px_rgba(0,0,0,0.025)]">
            <p className="text-xs font-medium text-black/40">
                {label}
            </p>

            <p className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
                {value}
            </p>

            <p className="mt-1 text-[11px] text-black/30">
                {description}
            </p>
        </div>
    );
}

function DataCard({
    title,
    description,
    onViewAll,
    children,
}: {
    title: string;
    description: string;
    onViewAll: () => void;
    children: React.ReactNode;
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_6px_25px_rgba(0,0,0,0.025)]">
            <div className="flex items-center justify-between border-b border-black/[0.05] px-5 py-4">
                <div>
                    <h3 className="text-sm font-semibold">
                        {title}
                    </h3>

                    <p className="mt-0.5 text-[11px] text-black/35">
                        {description}
                    </p>
                </div>

                <button
                    onClick={onViewAll}
                    className="text-xs font-semibold text-[#315CFF] hover:underline"
                >
                    View all
                </button>
            </div>

            {children}
        </section>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="px-5 py-12 text-center text-sm text-black/35">
            {text}
        </div>
    );
}