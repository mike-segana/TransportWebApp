"use client";

import { useEffect, useState } from "react"; //useEffect runs side effects things outside of rendering such as api calls, timers, subscriptions, DOM interactions
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import TopBar from "@/components/layout/Topbar";
import SideBar from "@/components/layout/Sidebar";


export default function Dashboard() {
    const router = useRouter();
    const [shipments, setShipments] = useState<any[]>([]); //specifies shipments as an array of any type (loose typing)
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true); //waits until jwt token authenticated before loading page
    const [form, setForm] = useState({pickup_location: "", dropoff_location: "", description: "",});
    const pendingRequests = requests.filter((req) => req.request_status === "pending");
    const activeShipments = shipments.filter((ship) => ["pending", "assigned", "in_transit"].includes(ship.status));
    const deliveredShipments = shipments.filter((ship) => ship.status === "completed");
    const recentShipments = shipments.slice(0,3);
    const recentRequests = requests.slice(0,3);

    const createRequest = async () => {
            try {
                const res = await api.post("/requests/", form);
                alert(res.data.message);
            } catch (err: any) {
                alert(err.response?.data?.detail);
            }
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [shipmentsRes, requestsRes] = await Promise.all([
                    api.get("/shipments/my"),
                    api.get("/requests/my"),
                ]);
                setShipments(shipmentsRes.data);
                setRequests(requestsRes.data);
            } catch (err: any) {
                //if (err.response?.status === 401) {
                //    await api.post("/auth/logout");
                //    router.push("/login");
                //}
                console.log(err.response?.data);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); //empty array means this only run once when page loads
    if (loading) return null;
    return (
        <div className="p-8">
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="border rounded p-4">
                    <p>Active Shipments</p>
                    <h3 className="text-2xl font-bold">{activeShipments.length}</h3>
                </div>

                <div className="border rounded p-4">
                    <p>Delivered Shipments</p>
                    <h3 className="text-2xl font-bold">{deliveredShipments.length}</h3>
                </div>

                <div className="border rounded p-4">
                    <p>Pending Requests</p>
                    <h3 className="text-2xl font-bold">{pendingRequests.length}</h3>
                </div>

                <div className="border rounded p-4">
                    <p>Total Requests</p>
                    <h3 className="text-2xl font-bold">{requests.length}</h3>
                </div>
            </div>

            {/*RECENT TABLES*/}
            <div className="grid grid-cols-2 gap-6 mb-8">

                {/*Recent Shipments*/}
                <div className="border rounded p-4 overflow-x-auto">
                    <div className="flex justify-between mb-2">
                        <h3 className="font-semibold">Recent Shipments</h3>
                        <button onClick={() => router.push("/dashboard/shipments")} className="text-blue-600 text-sm">View All</button>
                    </div>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left border-b">
                                <th className="py-2 px-3 w-24 whitespace-nowrap">ID</th>
                                <th className="py-2 px-3">Start</th>
                                <th className="py-2 px-3">Destination</th>
                                <th className="py-2 px-3 w-28 whitespace-nowrap">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {recentShipments.map((ship) => (
                                <tr key={ship.id} className="border-b last:border-0">
                                    <td className="py-2 px-3">{ship.id}</td>
                                    <td className="py-2 px-3">{ship.pickup_location}</td>
                                    <td className="py-2 px-3">{ship.dropoff_location}</td>
                                    <td className="py-2 px-3">{ship.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/*Recent Requests*/}
                <div className="border rounded p-4 overflow-x-auto">
                    <div className="flex justify-between mb-2">
                        <h3 className="font-semibold">Recent Requests</h3>
                        <button onClick={() => router.push("/dashboard/requests")} className="text-blue-600 text-sm">View All</button>
                    </div>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left border-b">
                                <th className="py-2 px-3 w-24 whitespace-nowrap">ID</th>
                                <th className="py-2 px-3">Start</th>
                                <th className="py-2 px-3">Destination</th>
                                <th className="py-2 px-3 w-28 whitespace-nowrap">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {recentRequests.map((req) => (
                                <tr key={req.id} className="border-b last:border-0">
                                    <td className="py-2 px-3">{req.id}</td>
                                    <td className="py-2 px-3">{req.pickup_location}</td>
                                    <td className="py-2 px-3">{req.dropoff_location}</td>
                                    <td className="py-2 px-3">{req.request_status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

            {/*CTA*/}
            <div className="mt-8">
                <button onClick={() => router.push("/dashboard/create-request")} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Create Request
                </button>
            </div>

        </div>
    );

}