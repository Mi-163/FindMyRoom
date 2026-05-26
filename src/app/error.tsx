"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {

        console.error("Global App Error Caught:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-200 max-w-md w-full">
                <div className="text-6xl mb-4">🌩️</div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">We hit a turbulent patch.</h1>
                <p className="text-slate-600 mb-8 text-sm leading-relaxed">
                    Our servers encountered an unexpected issue while fetching your travel data.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => reset()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="w-full bg-gray-100 hover:bg-gray-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition block"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
}