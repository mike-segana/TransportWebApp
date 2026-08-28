"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

type Shipment = {
    id: number;
    pickup_address: string;
    dropoff_address: string;
    created_at?: string | null;
    status: string;
}

export default function Shipments() {
    const router = useRouter();

    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchShipments = async () => {
            try {
                const res = await api.get("/api/backend/shipments/my");
                setShipments(res.data);
            } catch (error: unknown) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    router.replace("/login");
                } else {
                    setError("Unable to load your shipments.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchShipments();
    }, [router]);

    const statusStyle = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "in_transit":
                return "bg-blue-50 text-blue-700 border-blue-100";
            case "assigned":
                return "bg-amber-50 text-amber-700 border-amber-100";
            default:
                return "bg-black/[0.03] text-black/50 border-black/[0.06]";
        }
    };

    if (loading) {
        return (
            <main className="min-h-0 flex-1 overflow-y-auto bg-[#F7F7F5]">
                <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
                    <div className="animate-pulse space-y-5">
                        <div className="h-8 w-48 rounded-lg bg-black/5" />
                        <div className="h-4 w-72 rounded bg-black/5" />
                        <div className="h-72 rounded-2xl bg-white" />
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-0 flex-1 overflow-y-auto bg-[#F7F7F5]">
            <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
                <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#315CFF]">
                            Shipments
                        </p>

                        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#171A1F]">
                            My shipments
                        </h1>

                        <p className="mt-2 text-sm text-black/40">
                            Track the progress of your transport.
                        </p>
                    </div>

                    <button
                        onClick={() => router.push("/dashboard/create-request")}
                        className="h-11 rounded-xl bg-[#315CFF] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(49,92,255,0.16)] transition hover:bg-[#416BFF]"
                    >
                        + New request
                    </button>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {shipments.length === 0 ? (
                    <div className="rounded-2xl border border-black/[0.06] bg-white p-12 text-center shadow-[0_12px_40px_rgba(0,0,0,0.035)]">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#315CFF]/[0.08] text-[#315CFF]">
                            →
                        </div>

                        <h2 className="text-lg font-semibold text-[#171A1F]">
                            No shipments yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm text-black/40">
                            Once a request is accepted, your shipment will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.035)]">
                        <div className="border-b border-black/[0.06] px-5 py-4 sm:px-6">
                            <h2 className="font-semibold text-[#171A1F]">
                                Shipment history
                            </h2>

                            <p className="mt-1 text-xs text-black/35">
                                {shipments.length} shipment
                                {shipments.length !== 1 ? "s" : ""}
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[650px] text-sm">
                                <thead>
                                    <tr className="border-b border-black/[0.06] text-left text-[10px] font-bold uppercase tracking-[0.14em] text-black/35">
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Pickup</th>
                                        <th className="px-6 py-4">Drop-off</th>
                                        <th className="px-6 py-4">Created</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {shipments.map((shipment) => (
                                        <tr
                                            key={shipment.id}
                                            className="border-b border-black/[0.045] last:border-0 hover:bg-black/[0.012]"
                                        >
                                            <td className="px-6 py-4 font-semibold text-[#171A1F]">
                                                #{shipment.id}
                                            </td>

                                            <td className="px-6 py-4 text-black/60">
                                                {shipment.pickup_address}
                                            </td>

                                            <td className="px-6 py-4 text-black/60">
                                                {shipment.dropoff_address}
                                            </td>

                                            <td className="px-6 py-4 text-black/45">
                                                {shipment.created_at
                                                    ? new Date(shipment.created_at).toLocaleDateString()
                                                    : "—"}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusStyle(
                                                        shipment.status
                                                    )}`}
                                                >
                                                    {shipment.status.replace("_", " ")}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}