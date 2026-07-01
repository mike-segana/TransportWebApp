"use client";

import { useEffect, useState } from "react"; //useEffect runs side effects things outside of rendering such as api calls, timers, subscriptions, DOM interactions
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const [shipments, setShipments] = useState<any[]>([]); //specifies shipments as an array of any type (loose typing)
    const router = useRouter();
    
    useEffect(() => {
        const fetchData = async () => {
            const res = await api.get("/shipments/my");
            setShipments(res.data); //saves data into state
        };

        fetchData();
    }, []); //empty array means this only run once when page loads

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">TransitFlow</h1>
                    <p className="text-gray-500">Welcome back</p>
                </div>

                <button 
                    onClick={() => {
                        localStorage.removeItem("token");
                        router.push("/login");
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                >
                    Logout
                </button>
            </div>

            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="border rounded p-4">
                    <p>Active Shipments</p>
                    <h3 className="text-2x-l font-bold">{shipments.length}</h3>
                </div>
                <div className="border rounded p-4">
                    <p>Pending Requests</p>
                    <h3 className="text-2xl font-bold">0</h3>
                </div>
                <div className="border rounded p-4">
                    <p>Delivered</p>
                    <h3 className="text-2xl font-bold">0</h3>
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">My Shipments</h2>
            <table className="w-full border">
                <thead>
                    <tr>
                        <th className="border p-2">Shipment</th>
                        <th className="border p-2">Data</th>
                    </tr>
                </thead>
                <tbody>
                    {shipments.map((shipment, index) => (
                        <tr key={index}>
                            <td className="border p-2">{index + 1}</td>
                            <td className="border p-2">
                                <pre>{JSON.stringify(shipment, null, 2)}</pre>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <div className="mt-8">
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    Create Request
                </button>
            </div>
        </div>

    ); //json stringify used to convert shipments object into readable text
}
{/*<div style={{ padding: 20 }}>
            <h1>Dashboard</h1>

            <pre>{JSON.stringify(shipments, null, 2)}</pre>

            <button
                onClick={() => {
                    localStorage.removeItem("token");
                    //window.location.href = "/login";
                    router.push("/login");
                }}
            >Logout</button>
        </div>
*/}