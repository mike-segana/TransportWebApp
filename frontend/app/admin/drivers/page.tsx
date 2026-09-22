"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { driverSchema } from "@/lib/validation/driver";

type Availability =
    | "available"
    | "assigned"
    | "on_trip"
    | "offline"
    | string;

type Driver = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    availability: Availability;
};

export default function AdminDriversPage() {
    const router = useRouter();

    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const [showAddForm, setShowAddForm] = useState(false);

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        username: "",
    });

    const [formErrors, setFormErrors] = useState<
        Partial<Record<keyof typeof form, string>>
    >({});

    const handleAuthError = useCallback(
        (error: unknown) => {
            if (!axios.isAxiosError(error)) {
                return false;
            }

            const status = error.response?.status;

            if (status === 401) {
                router.replace("/login");
                return true;
            }

            if (status === 403) {
                router.replace("/unauthorised");
                return true;
            }

            return false;
        },
        [router]
    );

    const fetchDrivers = useCallback(async () => {
        const response = await api.get("/api/backend/drivers");

        return Array.isArray(response.data)
            ? (response.data as Driver[])
            : [];
    }, []);

    const loadDrivers = useCallback(async () => {
        try {
            const data = await fetchDrivers();

            setDrivers(data);
            setError(null);
        } catch (error: unknown) {
            if (handleAuthError(error)) {
                return;
            }

            console.error("Failed to load drivers:", error);
            setError("Failed to load drivers.");
        } finally {
            setLoading(false);
        }
    }, [fetchDrivers, handleAuthError]);

    useEffect(() => {
        void loadDrivers();
    }, [loadDrivers]);

    const refreshDrivers = async () => {
        setRefreshing(true);

        try {
            await loadDrivers();
        } finally {
            setRefreshing(false);
        }
    };

    const addDriver = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError(null);
        setFormErrors({});

        const result = driverSchema.safeParse(form);

        if (!result.success) {
            const errors: Partial<Record<keyof typeof form, string>> = {};

            for (const issue of result.error.issues) {
                const field = issue.path[0] as keyof typeof form;

                if (!errors[field]) {
                    errors[field] = issue.message;
                }
            }

            setFormErrors(errors);
            return;
        }

        try {
            await api.post("/api/backend/drivers/", result.data);

            setForm({
                first_name: "",
                last_name: "",
                email: "",
                username: "",
            });

            setFormErrors({});
            setShowAddForm(false);

            await loadDrivers();
        } catch (error: unknown) {
            if (handleAuthError(error)) {
                return;
            }

            const detail = axios.isAxiosError(error)
                ? error.response?.data?.detail
                : null;

            setError(
                typeof detail === "string"
                    ? detail
                    : "Failed to add driver."
            );
        }
    };

    const updateAvailability = async (
        driverId: number,
        availability: string
    ) => {
        try {
            setUpdatingId(driverId);
            setError(null);

            await api.patch(
                `/api/backend/drivers/${driverId}`,
                {
                    new_status: availability,
                }
            );

            await loadDrivers();
        } catch (error: unknown) {
            if (handleAuthError(error)) {
                return;
            }

            setError("Failed to update driver availability.");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[360px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-black/10 border-t-[#315CFF]" />
                    <p className="mt-3 text-sm text-black/40">
                        Loading drivers...
                    </p>
                </div>
            </div>
        );
    }

    const available = drivers.filter(
        (driver) => driver.availability === "available"
    ).length;

    const assigned = drivers.filter(
        (driver) => driver.availability === "assigned"
    ).length;

    const onTrip = drivers.filter(
        (driver) => driver.availability === "on_trip"
    ).length;

    return (
        <div className="space-y-5">
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#315CFF]">
                        Administration
                    </p>

                    <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.05em] text-[#171A1F]">
                        Drivers
                    </h1>

                    <p className="mt-1 text-sm text-black/40">
                        Manage drivers and fleet availability.
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={refreshDrivers}
                        disabled={refreshing}
                        className="h-9 rounded-xl border border-black/[0.07] bg-white px-3.5 text-xs font-semibold text-black/60 hover:bg-black/[0.02] disabled:opacity-50"
                    >
                        {refreshing ? "Refreshing..." : "Refresh"}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setShowAddForm((current) => !current);
                            setFormErrors({});
                            setError(null);
                        }}
                        className="h-9 rounded-xl bg-[#315CFF] px-3.5 text-xs font-semibold text-white hover:bg-[#244ce0]"
                    >
                        {showAddForm ? "Cancel" : "Add driver"}
                    </button>
                </div>
            </header>

            <div className="grid gap-3 sm:grid-cols-3">
                <SummaryCard
                    label="Available"
                    value={available}
                    accent
                />

                <SummaryCard
                    label="Assigned"
                    value={assigned}
                />

                <SummaryCard
                    label="On trip"
                    value={onTrip}
                />
            </div>

            {error && (
                <div
                    role="alert"
                    className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {error}
                </div>
            )}

            {showAddForm && (
                <section className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_6px_25px_rgba(0,0,0,0.025)]">
                    <div className="mb-4">
                        <h2 className="text-sm font-semibold">
                            Add driver
                        </h2>

                        <p className="mt-0.5 text-[10px] text-black/35">
                            Create a new driver account.
                        </p>
                    </div>

                    <form
                        onSubmit={addDriver}
                        className="grid gap-3 sm:grid-cols-2"
                    >
                        <Input
                            label="First name"
                            value={form.first_name}
                            error={formErrors.first_name}
                            onChange={(value) =>
                                setForm({
                                    ...form,
                                    first_name: value,
                                })
                            }
                        />

                        <Input
                            label="Last name"
                            value={form.last_name}
                            error={formErrors.last_name}
                            onChange={(value) =>
                                setForm({
                                    ...form,
                                    last_name: value,
                                })
                            }
                        />

                        <Input
                            label="Email"
                            type="email"
                            value={form.email}
                            error={formErrors.email}
                            onChange={(value) =>
                                setForm({
                                    ...form,
                                    email: value,
                                })
                            }
                        />

                        <Input
                            label="Username"
                            value={form.username}
                            error={formErrors.username}
                            onChange={(value) =>
                                setForm({
                                    ...form,
                                    username: value,
                                })
                            }
                        />

                        <div className="sm:col-span-2">
                            <button
                                type="submit"
                                className="rounded-xl bg-[#315CFF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#244ce0]"
                            >
                                Create driver
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_6px_25px_rgba(0,0,0,0.025)]">
                <div className="border-b border-black/[0.05] px-5 py-4">
                    <h2 className="text-sm font-semibold">
                        All drivers
                    </h2>

                    <p className="mt-0.5 text-[10px] text-black/35">
                        {drivers.length} driver
                        {drivers.length === 1 ? "" : "s"}
                    </p>
                </div>

                {drivers.length === 0 ? (
                    <div className="px-5 py-14 text-center text-sm text-black/35">
                        No drivers found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-sm">
                            <thead>
                                <tr className="border-b border-black/[0.05] text-left text-[9px] uppercase tracking-[0.12em] text-black/30">
                                    <th className="px-5 py-3 font-semibold">
                                        Driver
                                    </th>

                                    <th className="px-5 py-3 font-semibold">
                                        Email
                                    </th>

                                    <th className="px-5 py-3 font-semibold">
                                        Username
                                    </th>

                                    <th className="px-5 py-3 font-semibold">
                                        Availability
                                    </th>

                                    <th className="px-5 py-3 text-right font-semibold">
                                        Update
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {drivers.map((driver) => (
                                    <tr
                                        key={driver.id}
                                        className="border-b border-black/[0.04] last:border-0"
                                    >
                                        <td className="px-5 py-3.5">
                                            <div className="font-semibold text-black/75">
                                                {driver.first_name}{" "}
                                                {driver.last_name}
                                            </div>

                                            <div className="text-[10px] text-black/30">
                                                Driver #{driver.id}
                                            </div>
                                        </td>

                                        <td className="px-5 py-3.5 text-black/55">
                                            {driver.email}
                                        </td>

                                        <td className="px-5 py-3.5 text-black/55">
                                            {driver.username}
                                        </td>

                                        <td className="px-5 py-3.5">
                                            <StatusBadge
                                                status={driver.availability}
                                            />
                                        </td>

                                        <td className="px-5 py-3.5 text-right">
                                            <select
                                                value={driver.availability}
                                                disabled={
                                                    updatingId ===
                                                    driver.id
                                                }
                                                onChange={(event) =>
                                                    updateAvailability(
                                                        driver.id,
                                                        event.target.value
                                                    )
                                                }
                                                className="h-8 rounded-lg border border-black/[0.08] bg-white px-2 text-xs outline-none focus:border-[#315CFF]/40 disabled:opacity-50"
                                            >
                                                <option value="available">
                                                    Available
                                                </option>

                                                <option value="assigned">
                                                    Assigned
                                                </option>

                                                <option value="on_trip">
                                                    On trip
                                                </option>

                                                <option value="offline">
                                                    Offline
                                                </option>
                                            </select>
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

function Input({
    label,
    value,
    onChange,
    error,
    type = "text",
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    type?: string;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.12em] text-black/35">
                {label}
            </label>

            <input
                type={type}
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                className={`h-9 w-full rounded-xl border px-3 text-xs outline-none focus:border-[#315CFF]/40 focus:ring-2 focus:ring-[#315CFF]/10 ${
                    error
                        ? "border-red-300"
                        : "border-black/[0.08]"
                }`}
            />

            {error && (
                <p className="mt-1 text-[10px] text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

function SummaryCard({
    label,
    value,
    accent = false,
}: {
    label: string;
    value: number;
    accent?: boolean;
}) {
    return (
        <div
            className={`rounded-2xl border px-5 py-4 ${
                accent
                    ? "border-[#315CFF]/15 bg-[#315CFF]"
                    : "border-black/[0.06] bg-white"
            }`}
        >
            <p
                className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                    accent
                        ? "text-white/60"
                        : "text-black/35"
                }`}
            >
                {label}
            </p>

            <p
                className={`mt-1.5 text-2xl font-semibold ${
                    accent
                        ? "text-white"
                        : "text-[#171A1F]"
                }`}
            >
                {value}
            </p>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const normalized = status.toLowerCase();

    const styles: Record<string, string> = {
        available: "bg-emerald-50 text-emerald-700",
        assigned: "bg-blue-50 text-blue-700",
        on_trip: "bg-indigo-50 text-indigo-700",
        offline: "bg-black/[0.05] text-black/45",
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