"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

type Request = {
    id: number;
    pickup_location: string;
    dropoff_location: string;
    request_status: string;
    pickup_date?: string | null;
    pickup_time_slot?: string | null;
};

type Shipment = {
    id: number;
    pickup_location: string;
    dropoff_location: string;
    status: string;
};

type Driver = {
    id: number;
    name: string;
    availability: string;
};

export default function AdminDashboard() {
    const router = useRouter();

    const [requests, setRequests] = useState<Request[]>([]);
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    requestsResponse,
                    shipmentsResponse,
                    driversResponse,
                ] = await Promise.all([
                    api.get("/api/backend/requests"),
                    api.get("/api/backend/shipments"),
                    api.get("/api/backend/drivers"),
                ]);

                setRequests(requestsResponse.data);
                setShipments(shipmentsResponse.data);
                setDrivers(driversResponse.data);
            } catch (error: any) {
                if (error.response?.status === 401) {
                    router.replace("/login");
                    return;
                }

                console.error("Failed to load admin dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-sm text-black/40">
                    Loading admin dashboard...
                </p>
            </div>
        );
    }

    const pendingRequests = requests.filter(
        (request) =>
            request.request_status.toLowerCase() === "pending"
    );

    const activeShipments = shipments.filter((shipment) =>
        ["assigned", "in_transit"].includes(
            shipment.status.toLowerCase()
        )
    );

    const completedShipments = shipments.filter(
        (shipment) =>
            shipment.status.toLowerCase() === "completed"
    );

    const availableDrivers = drivers.filter(
        (driver) =>
            driver.availability.toLowerCase() === "available"
    );

    const assignedDrivers = drivers.filter(
        (driver) =>
            driver.availability.toLowerCase() === "assigned"
    );

    const onTripDrivers = drivers.filter(
        (driver) =>
            driver.availability.toLowerCase() === "on_trip"
    );

    const offlineDrivers = drivers.filter(
        (driver) =>
            driver.availability.toLowerCase() === "offline"
    );

    return (
        <div className="space-y-5">
            {/* Header */}
            <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#315CFF]">
                    Administration
                </p>

                <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.05em] text-[#171A1F]">
                    Operations overview
                </h1>

                <p className="mt-1 text-sm text-black/40">
                    Monitor requests, shipments and fleet activity across
                    TransitFlow.
                </p>
            </div>

            {/* Statistics */}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Pending requests"
                    value={pendingRequests.length}
                    description="Awaiting admin review"
                    //accent
                />

                <StatCard
                    label="Active shipments"
                    value={activeShipments.length}
                    description="Assigned or in transit"
                />

                <StatCard
                    label="Completed shipments"
                    value={completedShipments.length}
                    description="Successfully completed"
                />

                <StatCard
                    label="Available drivers"
                    value={availableDrivers.length}
                    description={`${drivers.length} total drivers`}
                />
            </div>

            {/* Requests + Fleet */}
            <div className="grid gap-4 xl:grid-cols-[1.5fr_0.7fr]">
                {/* Pending requests */}
                <section className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_6px_25px_rgba(0,0,0,0.025)]">
                    <SectionHeader
                        title="Pending requests"
                        description="Requests requiring your attention"
                        action="View all"
                        onAction={() =>
                            router.push("/admin/requests")
                        }
                    />

                    {pendingRequests.length === 0 ? (
                        <EmptyState text="No pending requests." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-black/[0.05] text-left text-[9px] uppercase tracking-[0.12em] text-black/30">
                                        <th className="px-5 py-2.5 font-semibold">
                                            Request
                                        </th>

                                        <th className="px-5 py-2.5 font-semibold">
                                            Route
                                        </th>

                                        <th className="px-5 py-2.5 font-semibold">
                                            Pickup
                                        </th>

                                        <th className="px-5 py-2.5 font-semibold">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {pendingRequests
                                        .slice(0, 4)
                                        .map((request) => (
                                            <tr
                                                key={request.id}
                                                className="border-b border-black/[0.04] last:border-0"
                                            >
                                                <td className="px-5 py-3">
                                                    <span className="font-semibold">
                                                        #{request.id}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-3">
                                                    <div className="max-w-[300px] truncate text-black/60">
                                                        {
                                                            request.pickup_location
                                                        }{" "}
                                                        →{" "}
                                                        {
                                                            request.dropoff_location
                                                        }
                                                    </div>
                                                </td>

                                                <td className="px-5 py-3 text-black/50">
                                                    {request.pickup_date
                                                        ? new Date(
                                                              request.pickup_date
                                                          ).toLocaleDateString(
                                                              "en-GB",
                                                              {
                                                                  day: "numeric",
                                                                  month: "short",
                                                              }
                                                          )
                                                        : "—"}
                                                </td>

                                                <td className="px-5 py-3">
                                                    <StatusBadge status="pending" />
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* Fleet */}
                <section className="rounded-2xl border border-black/[0.06] bg-white shadow-[0_6px_25px_rgba(0,0,0,0.025)]">
                    <SectionHeader
                        title="Fleet availability"
                        description="Current driver status"
                    />

                    <div className="grid grid-cols-2 gap-2.5 p-4">
                        <FleetRow
                            label="Available"
                            value={availableDrivers.length}
                            status="available"
                        />

                        <FleetRow
                            label="Assigned"
                            value={assignedDrivers.length}
                            status="assigned"
                        />

                        <FleetRow
                            label="On trip"
                            value={onTripDrivers.length}
                            status="on_trip"
                        />

                        <FleetRow
                            label="Offline"
                            value={offlineDrivers.length}
                            status="offline"
                        />
                    </div>

                    <div className="border-t border-black/[0.05] px-5 py-3">
                        <button
                            onClick={() =>
                                router.push("/admin/drivers")
                            }
                            className="text-xs font-semibold text-[#315CFF] hover:underline"
                        >
                            Manage drivers →
                        </button>
                    </div>
                </section>
            </div>

            {/* Active shipments */}
            <section className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_6px_25px_rgba(0,0,0,0.025)]">
                <SectionHeader
                    title="Active shipments"
                    description="Current transport operations"
                    action="View all"
                    onAction={() =>
                        router.push("/admin/shipments")
                    }
                />

                {activeShipments.length === 0 ? (
                    <EmptyState text="No active shipments." />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-black/[0.05] text-left text-[9px] uppercase tracking-[0.12em] text-black/30">
                                    <th className="px-5 py-2.5 font-semibold">
                                        Shipment
                                    </th>

                                    <th className="px-5 py-2.5 font-semibold">
                                        Pickup
                                    </th>

                                    <th className="px-5 py-2.5 font-semibold">
                                        Destination
                                    </th>

                                    <th className="px-5 py-2.5 font-semibold">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {activeShipments
                                    .slice(0, 4)
                                    .map((shipment) => (
                                        <tr
                                            key={shipment.id}
                                            className="border-b border-black/[0.04] last:border-0"
                                        >
                                            <td className="px-5 py-3 font-semibold">
                                                #{shipment.id}
                                            </td>

                                            <td className="max-w-[260px] truncate px-5 py-3 text-black/55">
                                                {shipment.pickup_location}
                                            </td>

                                            <td className="max-w-[260px] truncate px-5 py-3 text-black/55">
                                                {shipment.dropoff_location}
                                            </td>

                                            <td className="px-5 py-3">
                                                <StatusBadge
                                                    status={shipment.status}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

function SectionHeader({
    title,
    description,
    action,
    onAction,
}: {
    title: string;
    description: string;
    action?: string;
    onAction?: () => void;
}) {
    return (
        <div className="flex items-center justify-between border-b border-black/[0.05] px-5 py-3.5">
            <div>
                <h2 className="text-sm font-semibold text-[#171A1F]">
                    {title}
                </h2>

                <p className="mt-0.5 text-[10px] text-black/35">
                    {description}
                </p>
            </div>

            {action && onAction && (
                <button
                    onClick={onAction}
                    className="text-xs font-semibold text-[#315CFF] hover:underline"
                >
                    {action}
                </button>
            )}
        </div>
    );
}

function StatCard({
    label,
    value,
    description,
    accent = false,
}: {
    label: string;
    value: number;
    description: string;
    accent?: boolean;
}) {
    return (
        <div
            className={`rounded-2xl border px-5 py-4 shadow-[0_6px_25px_rgba(0,0,0,0.025)] ${
                accent
                    ? "border-[#315CFF]/15 bg-[#315CFF]"
                    : "border-black/[0.06] bg-white"
            }`}
        >
            <p
                className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                    accent ? "text-white/60" : "text-black/35"
                }`}
            >
                {label}
            </p>

            <p
                className={`mt-2 text-2xl font-semibold tracking-[-0.05em] ${
                    accent ? "text-white" : "text-[#171A1F]"
                }`}
            >
                {value}
            </p>

            <p
                className={`mt-0.5 text-[10px] ${
                    accent ? "text-white/45" : "text-black/30"
                }`}
            >
                {description}
            </p>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const normalized = status.toLowerCase();

    const styles: Record<string, string> = {
        pending: "bg-amber-50 text-amber-700",
        assigned: "bg-blue-50 text-blue-700",
        in_transit: "bg-indigo-50 text-indigo-700",
        completed: "bg-emerald-50 text-emerald-700",
        available: "bg-emerald-50 text-emerald-700",
        on_trip: "bg-indigo-50 text-indigo-700",
        offline: "bg-black/[0.05] text-black/45",
        denied: "bg-red-50 text-red-700",
        accepted: "bg-blue-50 text-blue-700",
    };

    return (
        <span
            className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${
                styles[normalized] ??
                "bg-black/[0.05] text-black/45"
            }`}
        >
            {normalized.replaceAll("_", " ")}
        </span>
    );
}

function FleetRow({
    label,
    value,
    status,
}: {
    label: string;
    value: number;
    status: string;
}) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-black/[0.05] px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2">
                <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        status === "available"
                            ? "bg-emerald-500"
                            : status === "assigned"
                              ? "bg-blue-500"
                              : status === "on_trip"
                                ? "bg-indigo-500"
                                : "bg-black/20"
                    }`}
                />

                <span className="truncate text-xs text-black/60">
                    {label}
                </span>
            </div>

            <span className="ml-2 text-sm font-semibold">
                {value}
            </span>
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="px-5 py-8 text-center text-sm text-black/35">
            {text}
        </div>
    );
}