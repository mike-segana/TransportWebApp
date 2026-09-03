"use client"; //runs in browser as page uses useState, button clicks, form interactions, router navigation etc

import axios from "axios";
import { useEffect, useState} from "react"; //imports react state management
import type { SyntheticEvent } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { requestSchema } from "@/lib/validation/request";

type FormState = {
    pickup_address: string;
    pickup_postcode: string;
    dropoff_address: string;
    dropoff_postcode: string;
    pickup_date: string;
    pickup_time_slot: string;
    helpers_needed: string;
    pickup_floor: string;
    pickup_has_lift: boolean;
    dropoff_floor: string;
    dropoff_has_lift: boolean;
    pickup_loading_minutes: string;
    dropoff_loading_minutes: string;
};
 
export default function CreateRequest() {
    const router = useRouter();
 
    const [timeSlots, setTimeSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
 
    const [form, setForm] = useState<FormState>({
        pickup_address: "",
        pickup_postcode: "",
        dropoff_address: "",
        dropoff_postcode: "",
        pickup_date: "",
        pickup_time_slot: "",
        helpers_needed: "",
        pickup_floor: "",
        pickup_has_lift: false,
        dropoff_floor: "",
        dropoff_has_lift: false,
        pickup_loading_minutes: "",
        dropoff_loading_minutes: "",
    });
 
    useEffect(() => {
        const fetchTimeSlots = async () => {
            try {
                const response = await api.get(
                    "/api/backend/requests/time-slots"
                );
 
                setTimeSlots(response.data);
            } catch (err: unknown) {
                if (axios.isAxiosError(err) && err.response?.status === 401) {
                    router.replace("/login");
                } else {
                    setError("Unable to load available pickup times.");
                }
            } finally {
                setLoadingSlots(false);
            }
        };
 
        fetchTimeSlots();
    }, [router]);
 
    const updateField = (
        field: keyof FormState,
        value: string | boolean
    ) => {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    };
 
    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
 
        setLoading(true);
        setError("");
 
        try {
            const result = requestSchema.safeParse({
                pickup_address: form.pickup_address,
                pickup_postcode: form.pickup_postcode,
                dropoff_address: form.dropoff_address,
                dropoff_postcode: form.dropoff_postcode,
                pickup_date: form.pickup_date,
                pickup_time_slot: form.pickup_time_slot,
                helpers_needed: form.helpers_needed,
                pickup_floor: form.pickup_floor,
                pickup_has_lift: form.pickup_has_lift,
                dropoff_floor: form.dropoff_floor,
                dropoff_has_lift: form.dropoff_has_lift,
                pickup_loading_minutes: form.pickup_loading_minutes,
                dropoff_loading_minutes: form.dropoff_loading_minutes,
            });

            if (!result.success) {
                setError(result.error.issues[0]?.message ?? "Please check the form.");
                return;
            }

            await api.post(
                "/api/backend/requests/",
                result.data
            );

            router.push("/dashboard/requests");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    router.replace("/login");
                    return;
                }

                if (err.response?.data?.detail) {
                    setError(
                        typeof err.response.data.detail === "string"
                            ? err.response.data.detail
                            : "Please check the information entered."
                    );
                } else {
                    setError(
                        "Failed to create request. Please try again."
                    );
                }
            } else {
                setError(
                    "Failed to create request. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };
 
    const inputClass =
        "h-10 w-full rounded-lg border border-black/[0.08] bg-[#FAFAF9] px-3 text-sm text-[#171A1F] outline-none transition placeholder:text-black/25 focus:border-[#315CFF]/40 focus:bg-white focus:ring-4 focus:ring-[#315CFF]/[0.06]";
 
    const selectClass =
        "h-10 w-full rounded-lg border border-black/[0.08] bg-[#FAFAF9] px-3 text-sm text-[#171A1F] outline-none transition focus:border-[#315CFF]/40 focus:bg-white focus:ring-4 focus:ring-[#315CFF]/[0.06] disabled:cursor-not-allowed disabled:opacity-50";
 
    const labelClass =
        "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-black/40";
 
    const sectionClass =
        "rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.035)]";
 
    return (
        <div className="mx-auto w-full max-w-6xl pb-8">
            {/* Page header */}
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <button
                        type="button"
                        onClick={() => router.push("/dashboard")}
                        className="mb-2 text-xs font-medium text-black/35 transition hover:text-[#315CFF]"
                    >
                        ← Back to dashboard
                    </button>
 
                    <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#171A1F]">
                        Create request
                    </h1>
 
                    <p className="mt-1 text-sm text-black/40">
                        Provide the details needed to arrange your transport.
                    </p>
                </div>
 
                <div className="hidden rounded-full border border-black/[0.06] bg-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-black/35 shadow-sm sm:block">
                    New request
                </div>
            </div>
 
            {/* Error */}
            {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}
 
            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                {/* Journey */}
                <section className={sectionClass}>
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#315CFF]/[0.08] text-xs font-bold text-[#315CFF]">
                            01
                        </div>
 
                        <div>
                            <h2 className="font-semibold text-[#171A1F]">
                                Journey
                            </h2>
 
                            <p className="text-xs text-black/35">
                                Where the transport starts and finishes.
                            </p>
                        </div>
                    </div>
 
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className={labelClass}>
                                Pickup Address
                            </label>
 
                            <input
                                type="text"
                                value={form.pickup_address}
                                onChange={(e) =>
                                    updateField(
                                        "pickup_address",
                                        e.target.value
                                    )
                                }
                                placeholder="Full pickup address"
                                className={inputClass}
                                required
                            />
                        </div>
 
                        <div>
                            <label className={labelClass}>
                                Drop-off Address
                            </label>
 
                            <input
                                type="text"
                                value={form.dropoff_address}
                                onChange={(e) =>
                                    updateField(
                                        "dropoff_address",
                                        e.target.value
                                    )
                                }
                                placeholder="Full drop-off address"
                                className={inputClass}
                                required
                            />
                        </div>
 
                        <div>
                            <label className={labelClass}>
                                Pickup Postcode
                            </label>
 
                            <input
                                type="text"
                                value={form.pickup_postcode}
                                onChange={(e) =>
                                    updateField(
                                        "pickup_postcode",
                                        e.target.value.toUpperCase()
                                    )
                                }
                                placeholder="e.g. SW1A 1AA"
                                className={inputClass}
                            />
                        </div>
 
                        <div>
                            <label className={labelClass}>
                                Drop-off Postcode
                            </label>
 
                            <input
                                type="text"
                                value={form.dropoff_postcode}
                                onChange={(e) =>
                                    updateField(
                                        "dropoff_postcode",
                                        e.target.value.toUpperCase()
                                    )
                                }
                                placeholder="e.g. M1 1AA"
                                className={inputClass}
                            />
                        </div>
                    </div>
                </section>
 
                {/* Date & Time */}
                <section className={sectionClass}>
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#315CFF]/[0.08] text-xs font-bold text-[#315CFF]">
                            02
                        </div>
 
                        <div>
                            <h2 className="font-semibold text-[#171A1F]">
                                Date & arrival window
                            </h2>
 
                            <p className="text-xs text-black/35">
                                Choose when the driver should arrive.
                            </p>
                        </div>
                    </div>
 
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className={labelClass}>
                                Pickup Date
                            </label>
 
                            <input
                                type="date"
                                value={form.pickup_date}
                                onChange={(e) =>
                                    updateField(
                                        "pickup_date",
                                        e.target.value
                                    )
                                }
                                min={
                                    new Date()
                                        .toISOString()
                                        .split("T")[0]
                                }
                                className={inputClass}
                            />
                        </div>
 
                        <div>
                            <label className={labelClass}>
                                Pickup Time Slot
                            </label>
 
                            <select
                                value={form.pickup_time_slot}
                                onChange={(e) =>
                                    updateField(
                                        "pickup_time_slot",
                                        e.target.value
                                    )
                                }
                                disabled={loadingSlots}
                                className={selectClass}
                            >
                                <option value="">
                                    {loadingSlots
                                        ? "Loading available times..."
                                        : "Select arrival window"}
                                </option>
 
                                {timeSlots.map((slot) => (
                                    <option
                                        key={slot}
                                        value={slot}
                                    >
                                        {slot}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>
 
                {/* Property Access */}
                <section className={sectionClass}>
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#315CFF]/[0.08] text-xs font-bold text-[#315CFF]">
                            03
                        </div>
 
                        <div>
                            <h2 className="font-semibold text-[#171A1F]">
                                Property access
                            </h2>
 
                            <p className="text-xs text-black/35">
                                Tell us about access at both locations.
                            </p>
                        </div>
                    </div>
 
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-xl bg-[#FAFAF9] p-4">
                            <h3 className="mb-4 text-sm font-semibold text-[#171A1F]">
                                Pickup
                            </h3>
 
                            <label className={labelClass}>
                                Floor
                            </label>
 
                            <input
                                type="number"
                                min="0"
                                value={form.pickup_floor}
                                onChange={(e) =>
                                    updateField(
                                        "pickup_floor",
                                        e.target.value
                                    )
                                }
                                placeholder="0"
                                className={`${inputClass} bg-white`}
                            />
 
                            <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-[#171A1F]">
                                <input
                                    type="checkbox"
                                    checked={form.pickup_has_lift}
                                    onChange={(e) =>
                                        updateField(
                                            "pickup_has_lift",
                                            e.target.checked
                                        )
                                    }
                                    className="h-4 w-4 accent-[#315CFF]"
                                />
 
                                Property has a lift
                            </label>
                        </div>
 
                        <div className="rounded-xl bg-[#FAFAF9] p-4">
                            <h3 className="mb-4 text-sm font-semibold text-[#171A1F]">
                                Drop-off
                            </h3>
 
                            <label className={labelClass}>
                                Floor
                            </label>
 
                            <input
                                type="number"
                                min="0"
                                value={form.dropoff_floor}
                                onChange={(e) =>
                                    updateField(
                                        "dropoff_floor",
                                        e.target.value
                                    )
                                }
                                placeholder="0"
                                className={`${inputClass} bg-white`}
                            />
 
                            <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-[#171A1F]">
                                <input
                                    type="checkbox"
                                    checked={form.dropoff_has_lift}
                                    onChange={(e) =>
                                        updateField(
                                            "dropoff_has_lift",
                                            e.target.checked
                                        )
                                    }
                                    className="h-4 w-4 accent-[#315CFF]"
                                />
 
                                Property has a lift
                            </label>
                        </div>
                    </div>
                </section>
 
                {/* Assistance */}
                <section className={sectionClass}>
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#315CFF]/[0.08] text-xs font-bold text-[#315CFF]">
                            04
                        </div>
 
                        <div>
                            <h2 className="font-semibold text-[#171A1F]">
                                Assistance & loading
                            </h2>
 
                            <p className="text-xs text-black/35">
                                Tell us about helpers and loading time.
                            </p>
                        </div>
                    </div>
 
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <label className={labelClass}>
                                Helpers Needed
                            </label>
 
                            <input
                                type="number"
                                min="0"
                                value={form.helpers_needed}
                                onChange={(e) =>
                                    updateField(
                                        "helpers_needed",
                                        e.target.value
                                    )
                                }
                                placeholder="0"
                                className={inputClass}
                            />
                        </div>
 
                        <div>
                            <label className={labelClass}>
                                Pickup Loading
                            </label>
 
                            <input
                                type="number"
                                min="0"
                                step="15"
                                value={form.pickup_loading_minutes}
                                onChange={(e) =>
                                    updateField(
                                        "pickup_loading_minutes",
                                        e.target.value
                                    )
                                }
                                placeholder="Minutes"
                                className={inputClass}
                            />
                        </div>
 
                        <div>
                            <label className={labelClass}>
                                Drop-off Loading
                            </label>
 
                            <input
                                type="number"
                                min="0"
                                step="15"
                                value={form.dropoff_loading_minutes}
                                onChange={(e) =>
                                    updateField(
                                        "dropoff_loading_minutes",
                                        e.target.value
                                    )
                                }
                                placeholder="Minutes"
                                className={inputClass}
                            />
                        </div>
                    </div>
                </section>
 
                {/* Actions */}
                <div className="flex justify-end gap-3 pt-1">
                    <button
                        type="button"
                        onClick={() => router.push("/dashboard")}
                        className="h-10 rounded-lg border border-black/[0.08] bg-white px-5 text-sm font-medium text-[#171A1F] transition hover:bg-black/[0.02]"
                    >
                        Cancel
                    </button>
 
                    <button
                        type="submit"
                        disabled={loading || loadingSlots}
                        className="h-10 rounded-lg bg-[#315CFF] px-6 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(49,92,255,0.18)] transition hover:bg-[#416BFF] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Submitting..."
                            : "Submit request"}
                    </button>
                </div>
            </form>
        </div>
    );
}