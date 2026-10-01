"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type RequestFlowData = {
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

const initialRequest: RequestFlowData = {
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
};

type RequestFlowContextValue = {
    request: RequestFlowData;
    updateRequest: <K extends keyof RequestFlowData>(
        field: K,
        value: RequestFlowData[K]
    ) => void;
    clearRequest: () => void;
};

const RequestFlowContext = createContext<RequestFlowContextValue | null>(null);

export function RequestFlowProvider({
    children,
} : {
    children: ReactNode;
}) {
    const [request, setRequests] = useState<RequestFlowData>(initialRequest);
    const updateRequest = <K extends keyof RequestFlowData>(
        field: K,
        value: RequestFlowData[K]
    ) => {
        setRequests((current) => ({
            ...current,
            [field]: value
        }));
    };
    const clearRequest = () => {
        setRequests(initialRequest);
    };
    const value = useMemo(
        () => ({
            request,
            updateRequest,
            clearRequest
        }),
        [request]
    );
    return (
        <RequestFlowContext.Provider value={value}>
            {children}
        </RequestFlowContext.Provider>
    );
}

export function useRequestFlow() {
    const context = useContext(RequestFlowContext);
    if (!context) {
        throw new Error("useRequestFlow must be used inside RequestFlowProvider");
    }
    return context;
}