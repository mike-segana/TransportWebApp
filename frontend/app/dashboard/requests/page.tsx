"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Requests() {
    const router = useRouter();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await api.get("/api/backend/requests/my");
                setRequests(res.data);
            } catch (err: any) {
                if (err.respone?.status === 401) {
                    router.replace("/login");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    if (loading) {
        return (
            <div className="p-8">
                <p>Loading Requests...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <p className="text-red-600">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-blue-600 text0white px-4 py-2 rounded">
                        Retry
                    </button>
            </div>
        );
    }
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">My Requests</h1>
                    <p className="text-gray-500">Track your current and previous requests</p>
                </div>
                <button 
                    onClick={() => router.push("/dashboard/create-request")}
                    className="bg-blue-600 text-white px-4 py-2 rounded">Create Shipment Request
                </button>
            </div>
            {requests.length === 0 ? (
                <div className="border roundedp-6 text-center">
                    <p className="mb-6">
                        You have no requests yet
                    </p>
                    <button
                        onClick={() => router.push("/dashboard/create-request")}
                        className="bg-blue-600 text-white px-4 py-2 rounded">Create your first request
                    </button>
                </div>
            ) : (
                <div className="border rounded overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="p-3">ID</th>
                                <th className="p-3">Pickup</th>
                                <th className="p-3">Dropoff</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((request) => (
                                <tr key={request.id} className="border-b">
                                    <td className="p-3">{request.id}</td>
                                    <td className="p-3">{request.pickup_location}</td>
                                    <td className="p-3">{request.dropoff_location}</td>
                                    <td className="p-3">
                                        {request.request_status === "denied" ? (
                                            <span className="px-2 py-1 rounded bg-red-100">{request.request_status}</span>
                                        ) : request.request_status === "accepted" ? (
                                            <span className="px-2 py-1 rounded bg-green-100">{request.request_status}</span>
                                        ) : (
                                            <span className="px-2 py-1 rounded bg-gray-100">{request.request_status}</span>
                                        )}
                                    </td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}