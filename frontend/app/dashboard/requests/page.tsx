"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Requests() {
    const router = useRouter();
    return (
        <div>
            <h1 className="mb-1">Requests Page</h1>
            <button onClick={() => router.push("/dashboard")}>Dashboard</button>
        </div>
    );
}