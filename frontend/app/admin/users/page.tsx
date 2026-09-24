"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

type User = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    role: string;
};

type UsersResponse = {
    items: User[];
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
};

export default function AdminUsersPage() {
    const router = useRouter();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [activeSearch, setActiveSearch] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);

    const pageSize = 50;

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

    const fetchUsers = useCallback(async (): Promise<UsersResponse> => {
        const params = new URLSearchParams({
            page: String(page),
            page_size: String(pageSize),
        });

        if (activeSearch) {
            params.set("search", activeSearch);
        }

        const response = await api.get<UsersResponse>(
            `/api/backend/users/?${params.toString()}`
        );

        return response.data;
    }, [activeSearch, page]);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const data = await fetchUsers();

                if (cancelled) return;

                setUsers(data.items);
                setTotalPages(data.total_pages);
                setTotal(data.total);
                setError(null);
            } catch (error: unknown) {
                if (cancelled) return;

                if (handleAuthError(error)) {
                    return;
                }

                console.error("Failed to load users:", error);
                setError("Failed to load users.");
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
    }, [fetchUsers, handleAuthError]);

    const refreshUsers = async () => {
        setRefreshing(true);

        try {
            const data = await fetchUsers();

            setUsers(data.items);
            setTotalPages(data.total_pages);
            setTotal(data.total);
            setError(null);
        } catch (error: unknown) {
            if (handleAuthError(error)) {
                return;
            }

            console.error("Failed to load users:", error);
            setError("Failed to load users.");
        } finally {
            setRefreshing(false);
        }
    };

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setPage(1);
        setActiveSearch(search.trim());
    };

    const clearSearch = () => {
        setSearch("");
        setActiveSearch("");
        setPage(1);
    };

    if (loading) {
        return (
            <div className="flex min-h-[360px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-black/10 border-t-[#315CFF]" />
                    <p className="mt-3 text-sm text-black/40">
                        Loading users...
                    </p>
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
                        Users
                    </h1>

                    <p className="mt-1 text-sm text-black/40">
                        Manage and view registered users.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={refreshUsers}
                    disabled={refreshing}
                    className="h-9 rounded-xl border border-black/[0.07] bg-white px-3.5 text-xs font-semibold text-black/60 hover:bg-black/[0.02] disabled:opacity-50"
                >
                    {refreshing ? "Refreshing..." : "Refresh"}
                </button>
            </header>

            <div className="grid gap-3 sm:grid-cols-2">
                <SummaryCard
                    label="Total users"
                    value={total}
                    accent
                />

                <SummaryCard
                    label="Current page"
                    value={users.length}
                />
            </div>

            {error && (
                <div
                    role="alert"
                    className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {error}
                </div>
            )}

            <section className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_6px_25px_rgba(0,0,0,0.025)]">
                <form
                    onSubmit={handleSearch}
                    className="flex flex-col gap-2 sm:flex-row"
                >
                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search by name, email or username..."
                        maxLength={100}
                        className="h-9 flex-1 rounded-xl border border-black/[0.08] px-3 text-xs outline-none focus:border-[#315CFF]/40 focus:ring-2 focus:ring-[#315CFF]/10"
                    />

                    <button
                        type="submit"
                        className="h-9 rounded-xl bg-[#315CFF] px-4 text-xs font-semibold text-white hover:bg-[#244ce0]"
                    >
                        Search
                    </button>

                    {activeSearch && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="h-9 rounded-xl border border-black/[0.07] bg-white px-4 text-xs font-semibold text-black/60 hover:bg-black/[0.02]"
                        >
                            Clear
                        </button>
                    )}
                </form>
            </section>

            <section className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_6px_25px_rgba(0,0,0,0.025)]">
                <div className="flex flex-col justify-between gap-2 border-b border-black/[0.05] px-5 py-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-sm font-semibold">
                            All users
                        </h2>

                        <p className="mt-0.5 text-[10px] text-black/35">
                            {total} user
                            {total === 1 ? "" : "s"}
                            {activeSearch
                                ? ` matching "${activeSearch}"`
                                : ""}
                        </p>
                    </div>

                    {totalPages > 0 && (
                        <p className="text-[10px] text-black/35">
                            Page {page} of {totalPages}
                        </p>
                    )}
                </div>

                {users.length === 0 ? (
                    <div className="px-5 py-14 text-center text-sm text-black/35">
                        {activeSearch
                            ? "No users found matching your search."
                            : "No users found."}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-sm">
                            <thead>
                                <tr className="border-b border-black/[0.05] text-left text-[9px] uppercase tracking-[0.12em] text-black/30">
                                    <th className="px-5 py-3 font-semibold">
                                        User
                                    </th>

                                    <th className="px-5 py-3 font-semibold">
                                        Email
                                    </th>

                                    <th className="px-5 py-3 font-semibold">
                                        Username
                                    </th>

                                    <th className="px-5 py-3 font-semibold">
                                        Role
                                    </th>

                                    <th className="px-5 py-3 text-right font-semibold">
                                        ID
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-black/[0.04] last:border-0"
                                    >
                                        <td className="px-5 py-3.5">
                                            <div className="font-semibold text-black/75">
                                                {user.first_name}{" "}
                                                {user.last_name}
                                            </div>

                                            <div className="text-[10px] text-black/30">
                                                {user.username}
                                            </div>
                                        </td>

                                        <td className="px-5 py-3.5 text-black/55">
                                            {user.email}
                                        </td>

                                        <td className="px-5 py-3.5 text-black/55">
                                            {user.username}
                                        </td>

                                        <td className="px-5 py-3.5">
                                            <RoleBadge
                                                role={user.role}
                                            />
                                        </td>

                                        <td className="px-5 py-3.5 text-right text-black/40">
                                            #{user.id}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-black/[0.05] px-5 py-3">
                        <button
                            type="button"
                            onClick={() =>
                                setPage((current) =>
                                    Math.max(1, current - 1)
                                )
                            }
                            disabled={page <= 1}
                            className="h-8 rounded-lg border border-black/[0.07] bg-white px-3 text-xs font-semibold text-black/60 hover:bg-black/[0.02] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <span className="text-[10px] text-black/35">
                            Page {page} of {totalPages}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setPage((current) =>
                                    Math.min(
                                        totalPages,
                                        current + 1
                                    )
                                )
                            }
                            disabled={page >= totalPages}
                            className="h-8 rounded-lg border border-black/[0.07] bg-white px-3 text-xs font-semibold text-black/60 hover:bg-black/[0.02] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                )}
            </section>
        </div>
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
                className={`mt-1.5 text-2xl font-semibold ${
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

function RoleBadge({ role }: { role: string }) {
    const normalized = role.toLowerCase();

    const styles: Record<string, string> = {
        admin: "bg-blue-50 text-blue-700",
        user: "bg-black/[0.05] text-black/45",
    };

    return (
        <span
            className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${
                styles[normalized] ??
                "bg-black/[0.05] text-black/45"
            }`}
        >
            {normalized}
        </span>
    );
}