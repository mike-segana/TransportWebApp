"use client"; //runs in browser as page uses useState, button clicks, form interactions, router navigation etc

import { useState} from "react"; //imports react state management
import type { SyntheticEvent } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateRequest() {
    const router = useRouter();
    const [form, setForm] = useState({
        pickup_location: "",
        dropoff_location: "",
        description: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/api/backend/requests/", form);
            alert("Request created successfully.");
            router.push("/dashboard/requests");
        } catch (err: any) {
            if (err.response?.status === 401) {
                router.replace("/login");
            } else {
                setError("Failed to create request. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-2">Create Request</h1>
            <p className="text-gray-500 mb-6">Submit a new transport request.</p>
            {error && (
                <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Pickup Location</label>
                    <input 
                        type="text"
                        value={form.pickup_location}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                pickup_location: e.target.value,
                            })
                        }
                        className="w-full border rounded p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">
                        Dropoff Location
                    </label>
                    <input
                        type="text"
                        value={form.dropoff_location}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                dropoff_location: e.target.value,
                            })
                        }
                        className="w-full border rounded p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">
                        Description
                    </label>

                    <textarea
                        rows={4}
                        value={form.description}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                description: e.target.value,
                            })
                        }
                        className="w-full border rounded p-2"
                    />
                </div>

                <div className="flex gap-3 pt-2">

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                        {loading ? "Submitting..." : "Submit Request"}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push("/dashboard")}
                        className="border px-4 py-2 rounded"
                    >
                        Cancel
                    </button>

                </div>
            </form>
        </div>
    );
}