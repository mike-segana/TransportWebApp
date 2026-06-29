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
        <div style={{ padding: 20 }}>
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
    ); //json stringify used to convert shipments object into readable text
}