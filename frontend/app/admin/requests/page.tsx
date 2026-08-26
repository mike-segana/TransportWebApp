"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

type RequestStatus = "pending" | "accepted" | "denied";

type Request = {
    id: number;
    user_id: number;

    pickup_location: string;
    dropoff_location: string;

    pickup_date?: string | null;
    pickup_time_slot?: string | null;

    pickup_address?: string | null;
    pickup_postcode?: string | null;

    dropoff_address?: string | null;
    dropoff_postcode?: string | null;

    helpers_needed?: number | null;

    pickup_floor?: number | null;
    pickup_has_lift?: boolean | null;

    dropoff_floor?: number | null;
    dropoff_has_lift?: boolean | null;

    pickup_loading_minutes?: number | null;
    dropoff_loading_minutes?: number | null;

    distance_miles?: number | null;

    request_status: RequestStatus;
};

type ApiError = {
    response?: {
        status?: number;
        data?: {
            detail?: string;
        };
    };
};

type StatusFilter = "all" | RequestStatus;

export default function AdminRequestsPage() {
    const router = useRouter();

    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [processingId, setProcessingId] =
        useState<number | null>(null);

    const [selectedRequest, setSelectedRequest] =
        useState<Request | null>(null);

    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("all");

    const [userIdFilter, setUserIdFilter] =
        useState("");

    const handleAuthError = useCallback(
        (error: ApiError) => {
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

    const fetchRequests = useCallback(
        async (showRefreshState = false) => {
            try {
                if (showRefreshState) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError(null);

                const response = await api.get(
                    "/api/backend/requests"
                );

                const nextRequests = Array.isArray(response.data)
                    ? response.data
                    : [];

                setRequests(nextRequests);

                /*
                 * Keep the currently open modal synchronized
                 * with refreshed request data.
                 */
                setSelectedRequest((current) => {
                    if (!current) {
                        return null;
                    }

                    return (
                        nextRequests.find(
                            (request: Request) =>
                                request.id === current.id
                        ) ?? null
                    );
                });
            } catch (error) {
                const apiError = error as ApiError;

                if (handleAuthError(apiError)) {
                    return;
                }

                console.error(
                    "Failed to load requests:",
                    error
                );

                setError(
                    apiError.response?.data?.detail ||
                        "Failed to load requests."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [handleAuthError]
    );

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const approveRequest = async (requestId: number) => {
        try {
            setProcessingId(requestId);
            setError(null);

            await api.patch(
                `/api/backend/requests/${requestId}/approve`
            );

            setSelectedRequest(null);

            await fetchRequests();
        } catch (error) {
            const apiError = error as ApiError;

            if (handleAuthError(apiError)) {
                return;
            }

            setError(
                apiError.response?.data?.detail ||
                    "Failed to approve request."
            );
        } finally {
            setProcessingId(null);
        }
    };

    const denyRequest = async (requestId: number) => {
        const confirmed = window.confirm(
            "Are you sure you want to deny this request?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setProcessingId(requestId);
            setError(null);

            await api.patch(
                `/api/backend/requests/${requestId}/deny`
            );

            setSelectedRequest(null);

            await fetchRequests();
        } catch (error) {
            const apiError = error as ApiError;

            if (handleAuthError(apiError)) {
                return;
            }

            setError(
                apiError.response?.data?.detail ||
                    "Failed to deny request."
            );
        } finally {
            setProcessingId(null);
        }
    };

    /*
     * Filter requests locally.
     *
     * This is only UI filtering.
     *
     * Security is still enforced by the backend:
     * - /requests is protected by admin_dependency
     * - approve is protected by admin_dependency
     * - deny is protected by admin_dependency
     *
     * user_id is never used here to grant permissions.
     */
    const filteredRequests = useMemo(() => {
        const normalizedUserId =
            userIdFilter.trim();

        return requests.filter((request) => {
            const matchesStatus =
                statusFilter === "all" ||
                request.request_status === statusFilter;

            const matchesUser =
                normalizedUserId === "" ||
                String(request.user_id).includes(
                    normalizedUserId
                );

            return matchesStatus && matchesUser;
        });
    }, [
        requests,
        statusFilter,
        userIdFilter,
    ]);

    const pendingCount = requests.filter(
        (request) =>
            request.request_status === "pending"
    ).length;

    const acceptedCount = requests.filter(
        (request) =>
            request.request_status === "accepted"
    ).length;

    const deniedCount = requests.filter(
        (request) =>
            request.request_status === "denied"
    ).length;

    const hasFilters =
        statusFilter !== "all" ||
        userIdFilter.trim() !== "";

    const clearFilters = () => {
        setStatusFilter("all");
        setUserIdFilter("");
    };

    if (loading) {
        return (
            <div className="flex min-h-[360px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-black/10 border-t-[#315CFF]" />

                    <p className="mt-3 text-sm text-black/40">
                        Loading requests...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Header */}
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#315CFF]">
                        Administration
                    </p>

                    <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.05em] text-[#171A1F]">
                        Requests
                    </h1>

                    <p className="mt-1 text-sm text-black/40">
                        Review and manage customer transport
                        requests.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => fetchRequests(true)}
                    disabled={refreshing}
                    className="inline-flex h-9 items-center justify-center rounded-xl border border-black/[0.07] bg-white px-3.5 text-xs font-semibold text-black/60 shadow-sm transition hover:bg-black/[0.02] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}
                </button>
            </header>

            {/* Summary */}
            <div className="grid gap-3 sm:grid-cols-3">
                <SummaryCard
                    label="Pending"
                    value={pendingCount}
                    accent
                />

                <SummaryCard
                    label="Accepted"
                    value={acceptedCount}
                />

                <SummaryCard
                    label="Denied"
                    value={deniedCount}
                />
            </div>

            {/* Error */}
            {error && (
                <div
                    role="alert"
                    className="flex items-start justify-between gap-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() => setError(null)}
                        className="shrink-0 text-red-500 hover:text-red-700"
                        aria-label="Dismiss error"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Filters */}
            <section className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-[0_6px_25px_rgba(0,0,0,0.025)]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="grid gap-3 sm:grid-cols-2">
                        {/* Status filter */}
                        <div>
                            <label
                                htmlFor="request-status-filter"
                                className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.12em] text-black/35"
                            >
                                Status
                            </label>

                            <select
                                id="request-status-filter"
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(
                                        event.target
                                            .value as StatusFilter
                                    )
                                }
                                className="h-9 min-w-[160px] rounded-xl border border-black/[0.08] bg-white px-3 text-xs font-medium text-black/65 outline-none transition focus:border-[#315CFF]/40 focus:ring-2 focus:ring-[#315CFF]/10"
                            >
                                <option value="all">
                                    All statuses
                                </option>

                                <option value="pending">
                                    Pending
                                </option>

                                <option value="accepted">
                                    Accepted
                                </option>

                                <option value="denied">
                                    Denied
                                </option>
                            </select>
                        </div>

                        {/* User filter */}
                        <div>
                            <label
                                htmlFor="request-user-filter"
                                className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.12em] text-black/35"
                            >
                                User ID
                            </label>

                            <input
                                id="request-user-filter"
                                type="text"
                                inputMode="numeric"
                                value={userIdFilter}
                                onChange={(event) =>
                                    setUserIdFilter(
                                        event.target.value.replace(
                                            /\D/g,
                                            ""
                                        )
                                    )
                                }
                                placeholder="e.g. 42"
                                className="h-9 w-full min-w-[160px] rounded-xl border border-black/[0.08] bg-white px-3 text-xs font-medium text-black/65 outline-none transition placeholder:text-black/25 focus:border-[#315CFF]/40 focus:ring-2 focus:ring-[#315CFF]/10"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 lg:justify-end">
                        <p className="text-xs text-black/35">
                            Showing{" "}
                            <span className="font-semibold text-black/55">
                                {filteredRequests.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-black/55">
                                {requests.length}
                            </span>
                        </p>

                        {hasFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#315CFF] transition hover:bg-[#315CFF]/5"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Requests table */}
            <section className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_6px_25px_rgba(0,0,0,0.025)]">
                <div className="flex items-center justify-between border-b border-black/[0.05] px-5 py-4">
                    <div>
                        <h2 className="text-sm font-semibold text-[#171A1F]">
                            All requests
                        </h2>

                        <p className="mt-0.5 text-[10px] text-black/35">
                            {filteredRequests.length} request
                            {filteredRequests.length === 1
                                ? ""
                                : "s"}{" "}
                            shown
                        </p>
                    </div>

                    {pendingCount > 0 && (
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
                            {pendingCount} awaiting review
                        </span>
                    )}
                </div>

                {filteredRequests.length === 0 ? (
                    <div className="px-5 py-14 text-center">
                        <p className="text-sm font-medium text-black/55">
                            {hasFilters
                                ? "No requests match these filters."
                                : "No requests found."}
                        </p>

                        <p className="mt-1 text-xs text-black/30">
                            {hasFilters
                                ? "Try changing or clearing your filters."
                                : "New customer requests will appear here."}
                        </p>

                        {hasFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="mt-4 rounded-lg bg-[#315CFF] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#244ce0]"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1050px] text-sm">
                            <thead>
                                <tr className="border-b border-black/[0.05] text-left text-[9px] uppercase tracking-[0.12em] text-black/30">
                                    <th className="px-5 py-3 font-semibold">
                                        Request
                                    </th>

                                    <th className="px-5 py-3 font-semibold">
                                        Customer
                                    </th>

                                    <th className="px-5 py-3 font-semibold">
                                        Route
                                    </th>

                                    <th className="px-5 py-3 font-semibold">
                                        Distance
                                    </th>

                                    <th className="px-5 py-3 font-semibold">
                                        Pickup
                                    </th>

                                    <th className="px-5 py-3 font-semibold">
                                        Status
                                    </th>

                                    <th className="px-5 py-3 text-right font-semibold">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredRequests.map(
                                    (request) => {
                                        const pending =
                                            request.request_status ===
                                            "pending";

                                        const processing =
                                            processingId ===
                                            request.id;

                                        return (
                                            <tr
                                                key={request.id}
                                                className={`border-b border-black/[0.04] last:border-0 ${
                                                    pending
                                                        ? "border-l-2 border-l-[#315CFF]"
                                                        : "border-l-2 border-l-transparent"
                                                }`}
                                            >
                                                {/* Request ID */}
                                                <td className="px-5 py-3.5">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedRequest(
                                                                request
                                                            )
                                                        }
                                                        className="text-left font-semibold text-black/80 hover:text-[#315CFF]"
                                                    >
                                                        #
                                                        {
                                                            request.id
                                                        }
                                                    </button>
                                                </td>

                                                {/* User ID */}
                                                <td className="px-5 py-3.5">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setUserIdFilter(
                                                                String(
                                                                    request.user_id
                                                                )
                                                            )
                                                        }
                                                        className="rounded-md text-left text-xs font-semibold text-black/55 transition hover:bg-black/[0.03] hover:text-[#315CFF]"
                                                        title="Filter by this user"
                                                    >
                                                        User #
                                                        {
                                                            request.user_id
                                                        }
                                                    </button>
                                                </td>

                                                {/* Route */}
                                                <td className="px-5 py-3.5">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedRequest(
                                                                request
                                                            )
                                                        }
                                                        className="block max-w-[280px] truncate text-left text-black/60 hover:text-black"
                                                        title={`${request.pickup_location} → ${request.dropoff_location}`}
                                                    >
                                                        {
                                                            request.pickup_location
                                                        }{" "}
                                                        →{" "}
                                                        {
                                                            request.dropoff_location
                                                        }
                                                    </button>
                                                </td>

                                                {/* Distance */}
                                                <td className="px-5 py-3.5 text-black/50">
                                                    {request.distance_miles !=
                                                    null
                                                        ? `${request.distance_miles} mi`
                                                        : "—"}
                                                </td>

                                                {/* Pickup */}
                                                <td className="px-5 py-3.5">
                                                    <div className="text-black/60">
                                                        {formatDate(
                                                            request.pickup_date
                                                        )}
                                                    </div>

                                                    {request.pickup_time_slot && (
                                                        <div className="mt-0.5 text-[10px] text-black/35">
                                                            {
                                                                request.pickup_time_slot
                                                            }
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Status */}
                                                <td className="px-5 py-3.5">
                                                    <StatusBadge
                                                        status={
                                                            request.request_status
                                                        }
                                                    />
                                                </td>

                                                {/* Actions */}
                                                <td className="px-5 py-3.5">
                                                    {pending ? (
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    processing
                                                                }
                                                                onClick={() =>
                                                                    approveRequest(
                                                                        request.id
                                                                    )
                                                                }
                                                                className="rounded-lg bg-[#315CFF] px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#244ce0] disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                {processing
                                                                    ? "..."
                                                                    : "Approve"}
                                                            </button>

                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    processing
                                                                }
                                                                onClick={() =>
                                                                    denyRequest(
                                                                        request.id
                                                                    )
                                                                }
                                                                className="rounded-lg bg-red-50 px-3 py-1.5 text-[10px] font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                Deny
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="text-right text-[10px] text-black/25">
                                                            Completed
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Details modal */}
            {selectedRequest && (
                <RequestDetails
                    request={selectedRequest}
                    onClose={() =>
                        setSelectedRequest(null)
                    }
                    onApprove={() =>
                        approveRequest(
                            selectedRequest.id
                        )
                    }
                    onDeny={() =>
                        denyRequest(
                            selectedRequest.id
                        )
                    }
                    processing={
                        processingId ===
                        selectedRequest.id
                    }
                />
            )}
        </div>
    );
}

function RequestDetails({
    request,
    onClose,
    onApprove,
    onDeny,
    processing,
}: {
    request: Request;
    onClose: () => void;
    onApprove: () => void;
    onDeny: () => void;
    processing: boolean;
}) {
    const pending =
        request.request_status === "pending";

    useEffect(() => {
        const handleKeyDown = (
            event: KeyboardEvent
        ) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [onClose]);

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-details-title"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4 backdrop-blur-[2px]"
        >
            <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-2xl">
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-black/[0.05] px-5 py-4">
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#315CFF]">
                            Request details
                        </p>

                        <h2
                            id="request-details-title"
                            className="mt-1 text-lg font-semibold text-[#171A1F]"
                        >
                            #{request.id}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close request details"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-black/35 transition hover:bg-black/[0.04] hover:text-black"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-5">
                    {/* Request summary */}
                    <div className="mb-5 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-black/[0.025] px-4 py-3">
                            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-black/30">
                                Customer
                            </p>

                            <p className="mt-1 text-sm font-semibold text-black/70">
                                User #
                                {request.user_id}
                            </p>
                        </div>

                        <div className="rounded-xl bg-black/[0.025] px-4 py-3">
                            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-black/30">
                                Current status
                            </p>

                            <div className="mt-1">
                                <StatusBadge
                                    status={
                                        request.request_status
                                    }
                                />
                            </div>
                        </div>

                        <div className="rounded-xl bg-black/[0.025] px-4 py-3">
                            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-black/30">
                                Distance
                            </p>

                            <p className="mt-1 text-sm font-semibold text-black/70">
                                {request.distance_miles !=
                                null
                                    ? `${request.distance_miles} miles`
                                    : "—"}
                            </p>
                        </div>
                    </div>

                    {/* Locations */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <DetailBlock
                            title="Pickup"
                            values={[
                                request.pickup_location,
                                request.pickup_address,
                                request.pickup_postcode,
                            ]}
                        />

                        <DetailBlock
                            title="Drop-off"
                            values={[
                                request.dropoff_location,
                                request.dropoff_address,
                                request.dropoff_postcode,
                            ]}
                        />

                        <DetailItem
                            label="Pickup date"
                            value={formatDate(
                                request.pickup_date
                            )}
                        />

                        <DetailItem
                            label="Time slot"
                            value={
                                request.pickup_time_slot ||
                                "—"
                            }
                        />

                        <DetailItem
                            label="Helpers needed"
                            value={
                                request.helpers_needed !=
                                null
                                    ? String(
                                          request.helpers_needed
                                      )
                                    : "—"
                            }
                        />

                        <DetailItem
                            label="Pickup floor"
                            value={formatFloor(
                                request.pickup_floor,
                                request.pickup_has_lift
                            )}
                        />

                        <DetailItem
                            label="Drop-off floor"
                            value={formatFloor(
                                request.dropoff_floor,
                                request.dropoff_has_lift
                            )}
                        />

                        <DetailItem
                            label="Pickup loading"
                            value={
                                request.pickup_loading_minutes !=
                                null
                                    ? `${request.pickup_loading_minutes} min`
                                    : "—"
                            }
                        />

                        <DetailItem
                            label="Drop-off loading"
                            value={
                                request.dropoff_loading_minutes !=
                                null
                                    ? `${request.dropoff_loading_minutes} min`
                                    : "—"
                            }
                        />
                    </div>
                </div>

                {/* Actions */}
                {pending && (
                    <div className="flex shrink-0 justify-end gap-2 border-t border-black/[0.05] px-5 py-4">
                        <button
                            type="button"
                            disabled={processing}
                            onClick={onDeny}
                            className="rounded-xl bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Deny
                        </button>

                        <button
                            type="button"
                            disabled={processing}
                            onClick={onApprove}
                            className="rounded-xl bg-[#315CFF] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#244ce0] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing
                                ? "Processing..."
                                : "Approve request"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function DetailBlock({
    title,
    values,
}: {
    title: string;
    values: (string | null | undefined)[];
}) {
    return (
        <div className="rounded-xl border border-black/[0.05] p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-black/30">
                {title}
            </p>

            <div className="mt-2 space-y-1">
                {values.map((value, index) =>
                    value ? (
                        <p
                            key={`${title}-${index}`}
                            className={
                                index === 0
                                    ? "text-sm font-medium text-black/70"
                                    : "text-xs text-black/40"
                            }
                        >
                            {value}
                        </p>
                    ) : null
                )}
            </div>
        </div>
    );
}

function DetailItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-black/30">
                {label}
            </p>

            <p className="mt-1 text-sm text-black/60">
                {value}
            </p>
        </div>
    );
}

function formatFloor(
    floor?: number | null,
    hasLift?: boolean | null
) {
    if (floor == null) {
        return "—";
    }

    let suffix = "th";

    if (floor % 100 < 11 || floor % 100 > 13) {
        if (floor % 10 === 1) {
            suffix = "st";
        } else if (floor % 10 === 2) {
            suffix = "nd";
        } else if (floor % 10 === 3) {
            suffix = "rd";
        }
    }

    return `${floor}${suffix} floor${
        hasLift === true
            ? " · Lift"
            : hasLift === false
              ? " · No lift"
              : ""
    }`;
}

function formatDate(date?: string | null) {
    if (!date) {
        return "—";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "—";
    }

    return parsed.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function StatusBadge({
    status,
}: {
    status: string;
}) {
    const normalized = status.toLowerCase();

    const styles: Record<string, string> = {
        pending: "bg-amber-50 text-amber-700",
        accepted: "bg-blue-50 text-blue-700",
        denied: "bg-red-50 text-red-700",
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
                className={`mt-1.5 text-2xl font-semibold tracking-[-0.04em] ${
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