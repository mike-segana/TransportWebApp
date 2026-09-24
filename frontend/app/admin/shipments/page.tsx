"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

type ShipmentStatus = string;

type Shipment = {
  id: number;
  request_id?: number | null;
  user_id?: number | null;
  driver_id?: number | null;
  pickup_address?: string | null;
  pickup_postcode?: string | null;
  dropoff_address?: string | null;
  dropoff_postcode?: string | null;
  scheduled_date?: string | null;
  status: ShipmentStatus;
};

type Driver = {
  id: number;
  first_name: string;
  last_name: string;
  availability: string;
};

export default function AdminShipmentsPage() {
  const router = useRouter();

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [processingId, setProcessingId] = useState<number | null>(null);

  const [assigningShipmentId, setAssigningShipmentId] = useState<number | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<number | "">("");

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

  const getErrorDetail = (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return null;
    }

    const detail = error.response?.data?.detail;

    return typeof detail === "string" ? detail : null;
  };

  const fetchShipments = useCallback(async () => {
    const response = await api.get("/api/backend/shipments");
    return Array.isArray(response.data) ? (response.data as Shipment[]) : [];
  }, []);

  const fetchDrivers = useCallback(async () => {
    const response = await api.get("/api/backend/drivers");
    return Array.isArray(response.data) ? (response.data as Driver[]) : [];
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [shipmentData, driverData] = await Promise.all([
          fetchShipments(),
          fetchDrivers(),
        ]);

        if (cancelled) return;

        setShipments(shipmentData);
        setDrivers(driverData);
        setError(null);
      } catch (error: unknown) {
        if (cancelled) return;

        if (handleAuthError(error)) {
          return;
        }

        console.error("Failed to load shipment data:", error);
        setError(getErrorDetail(error) ?? "Failed to load shipment data.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [fetchShipments, fetchDrivers, handleAuthError]);

  const loadData = useCallback(async () => {
    try {
      const [shipmentData, driverData] = await Promise.all([
        fetchShipments(),
        fetchDrivers(),
      ]);

      setShipments(shipmentData);
      setDrivers(driverData);
      setError(null);
    } catch (error: unknown) {
      if (handleAuthError(error)) {
        return;
      }

      console.error("Failed to load shipment data:", error);
      setError(getErrorDetail(error) ?? "Failed to load shipment data.");
    }
  }, [fetchShipments, fetchDrivers, handleAuthError]);

  const refreshData = async () => {
    setRefreshing(true);
    setError(null);

    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  };

  const startTrip = async (shipmentId: number) => {
    const confirmed = window.confirm("Are you sure you want to start this trip?");

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(shipmentId);
      setError(null);

      await api.patch(`/api/backend/shipments/${shipmentId}/start-trip`);
      await loadData();
    } catch (error: unknown) {
      if (handleAuthError(error)) {
        return;
      }

      setError(getErrorDetail(error) ?? "Failed to start trip.");
    } finally {
      setProcessingId(null);
    }
  };

  const endTrip = async (shipmentId: number) => {
    const confirmed = window.confirm("Are you sure you want to end this trip?");

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(shipmentId);
      setError(null);

      await api.patch(`/api/backend/shipments/${shipmentId}/end-trip`);
      await loadData();
    } catch (error: unknown) {
      if (handleAuthError(error)) {
        return;
      }

      setError(getErrorDetail(error) ?? "Failed to end trip.");
    } finally {
      setProcessingId(null);
    }
  };

  const openAssignment = (shipmentId: number) => {
    setAssigningShipmentId(shipmentId);
    setSelectedDriverId("");
    setError(null);
  };

  const closeAssignment = () => {
    setAssigningShipmentId(null);
    setSelectedDriverId("");
  };

  const assignDriver = async () => {
    if (assigningShipmentId === null || selectedDriverId === "") {
      return;
    }

    const driver = drivers.find((item) => item.id === selectedDriverId);
    const driverName = driver ? `${driver.first_name} ${driver.last_name}` : "this driver";

    const confirmed = window.confirm(
      `Are you sure you want to assign ${driverName} to shipment #${assigningShipmentId}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(assigningShipmentId);
      setError(null);

      await api.post("/api/backend/assignment/", {
        driver_id: selectedDriverId,
        shipment_id: assigningShipmentId,
      });

      closeAssignment();
      await loadData();
    } catch (error: unknown) {
      if (handleAuthError(error)) {
        return;
      }

      setError(getErrorDetail(error) ?? "Failed to assign driver.");
    } finally {
      setProcessingId(null);
    }
  };

  const availableDrivers = drivers.filter((driver) => driver.availability === "available");

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-black/10 border-t-[#315CFF]" />
          <p className="mt-3 text-sm text-black/40">Loading shipments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#315CFF]">
            Administration
          </p>

          <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.05em] text-[#171A1F]">
            Shipments
          </h1>

          <p className="mt-1 text-sm text-black/40">
            Monitor shipments and manage trip operations.
          </p>
        </div>

        <button
          type="button"
          onClick={refreshData}
          disabled={refreshing}
          className="h-9 rounded-xl border border-black/[0.07] bg-white px-3.5 text-xs font-semibold text-black/60 hover:bg-black/[0.02] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </header>

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

      <section className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_6px_25px_rgba(0,0,0,0.025)]">
        <div className="border-b border-black/[0.05] px-5 py-4">
          <h2 className="text-sm font-semibold text-[#171A1F]">All shipments</h2>

          <p className="mt-0.5 text-[10px] text-black/35">
            {shipments.length} shipment{shipments.length === 1 ? "" : "s"}
          </p>
        </div>

        {shipments.length === 0 ? (
          <div className="px-5 py-14 text-center text-sm text-black/35">
            No shipments found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-sm">
              <thead>
                <tr className="border-b border-black/[0.05] text-left text-[9px] uppercase tracking-[0.12em] text-black/30">
                  <th className="px-5 py-3 font-semibold">Shipment</th>
                  <th className="px-5 py-3 font-semibold">Pickup</th>
                  <th className="px-5 py-3 font-semibold">Drop-off</th>
                  <th className="px-5 py-3 font-semibold">Driver</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {shipments.map((shipment) => {
                  const processing = processingId === shipment.id;
                  const driver = drivers.find((item) => item.id === shipment.driver_id);

                  const canAssign =
                    shipment.status === "pending" && !shipment.driver_id;

                  const canStart =
                    shipment.status === "assigned" && !!shipment.driver_id;

                  const canEnd = shipment.status === "in_transit";

                  return (
                    <tr key={shipment.id} className="border-b border-black/[0.04] last:border-0">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-black/75">#{shipment.id}</div>

                        {shipment.request_id != null && (
                          <div className="text-[10px] text-black/30">
                            Request #{shipment.request_id}
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="max-w-[230px] truncate text-black/60">
                          {shipment.pickup_address ?? "—"}
                        </div>

                        <div className="text-[10px] text-black/30">
                          {shipment.pickup_postcode ?? ""}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="max-w-[230px] truncate text-black/60">
                          {shipment.dropoff_address ?? "—"}
                        </div>

                        <div className="text-[10px] text-black/30">
                          {shipment.dropoff_postcode ?? ""}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        {driver ? (
                          <div>
                            <div className="font-medium text-black/65">
                              {driver.first_name} {driver.last_name}
                            </div>

                            <div className="text-[10px] text-black/30">
                              Driver #{driver.id}
                            </div>
                          </div>
                        ) : (
                          <span className="text-black/30">Unassigned</span>
                        )}
                      </td>

                      <td className="px-5 py-3.5">
                        <StatusBadge status={shipment.status} />
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-2">
                          {canAssign && (
                            <button
                              type="button"
                              disabled={processing}
                              onClick={() => openAssignment(shipment.id)}
                              className="rounded-lg bg-[#315CFF] px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#244ce0] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Assign driver
                            </button>
                          )}

                          {canStart && (
                            <button
                              type="button"
                              disabled={processing}
                              onClick={() => startTrip(shipment.id)}
                              className="rounded-lg bg-[#315CFF] px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#244ce0] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {processing ? "..." : "Start trip"}
                            </button>
                          )}

                          {canEnd && (
                            <button
                              type="button"
                              disabled={processing}
                              onClick={() => endTrip(shipment.id)}
                              className="rounded-lg bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {processing ? "..." : "End trip"}
                            </button>
                          )}

                          {!canAssign && !canStart && !canEnd && (
                            <span className="text-[10px] text-black/25">No actions</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {assigningShipmentId !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="assignment-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeAssignment();
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-black/[0.06] bg-white p-5 shadow-2xl">
            <div className="mb-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#315CFF]">
                Shipment assignment
              </p>

              <h2 id="assignment-title" className="mt-1 text-lg font-semibold text-[#171A1F]">
                Assign driver
              </h2>

              <p className="mt-1 text-xs text-black/40">Shipment #{assigningShipmentId}</p>
            </div>

            {availableDrivers.length === 0 ? (
              <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                No available drivers are currently available.
              </div>
            ) : (
              <>
                <label
                  htmlFor="driver-select"
                  className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.12em] text-black/35"
                >
                  Available driver
                </label>

                <select
                  id="driver-select"
                  value={selectedDriverId}
                  onChange={(event) =>
                    setSelectedDriverId(event.target.value ? Number(event.target.value) : "")
                  }
                  className="h-10 w-full rounded-xl border border-black/[0.08] bg-white px-3 text-xs outline-none focus:border-[#315CFF]/40 focus:ring-2 focus:ring-[#315CFF]/10"
                >
                  <option value="">Select a driver</option>

                  {availableDrivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.first_name} {driver.last_name}
                    </option>
                  ))}
                </select>
              </>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeAssignment}
                className="rounded-xl border border-black/[0.08] px-4 py-2 text-xs font-semibold text-black/55 transition hover:bg-black/[0.02]"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  selectedDriverId === "" ||
                  processingId === assigningShipmentId ||
                  availableDrivers.length === 0
                }
                onClick={assignDriver}
                className="rounded-xl bg-[#315CFF] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#244ce0] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processingId === assigningShipmentId ? "Assigning..." : "Assign driver"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();

  const styles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    assigned: "bg-blue-50 text-blue-700",
    in_transit: "bg-indigo-50 text-indigo-700",
    completed: "bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${
        styles[normalized] ?? "bg-black/[0.05] text-black/45"
      }`}
    >
      {normalized.replaceAll("_", " ")}
    </span>
  );
}