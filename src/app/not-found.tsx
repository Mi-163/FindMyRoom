import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-200 max-w-md w-full">
                <div className="text-6xl mb-4">🗺️</div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">404</h1>
                <h2 className="text-xl font-semibold text-slate-700 mb-4">Off the map!</h2>
                <p className="text-slate-600 mb-8 text-sm">
                    We can't seem to find the destination or page you are looking for. It might have been moved or deleted.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-xl transition"
                >
                    Back to Safety
                </Link>
            </div>
        </div>
    );
}