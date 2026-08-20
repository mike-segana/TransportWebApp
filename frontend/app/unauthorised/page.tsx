export default function UnauthorizedPage() {
    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-semibold">
                    Access denied
                </h1>
                <p className="mt-2 text-sm text-black/50">
                    You don't have permission to access this page.
                </p>
            </div>
        </main>
    );
}