"use client";

import { useState } from "react";
import { getDistance } from "@/app/actions/GetDistance";

export default function DistanceButton({ hotelName, city }: { hotelName: string, city: string }) {
    const [info, setInfo] = useState<{ airport: string, train: string, bus: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleCheck = async () => {
        setLoading(true);
        setError(false); // Reset error state on new attempt

        const result = await getDistance(hotelName, city);

        if (result) {
            setInfo(result);
        } else {
            // Replace the ugly alert() with our clean error state
            setError(true);
        }
        setLoading(false);
    };

    // State 1: Success
    if (info) {
        return (
            <div className="flex flex-col gap-2 mt-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Travel Times</p>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                    <span>✈️</span> <span className="font-medium">Airport:</span> {info.airport}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                    <span>🚆</span> <span className="font-medium">Railway:</span> {info.train}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                    <span>🚌</span> <span className="font-medium">Bus Terminal:</span> {info.bus}
                </div>
            </div>
        );
    }

    // State 2: Network Error
    if (error) {
        return (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-md mt-4 inline-flex items-center gap-2">
                ⚠️ Network timeout. Route blocked by local firewall.
                <button onClick={handleCheck} className="ml-2 underline font-medium hover:text-red-800">
                    Retry
                </button>
            </div>
        );
    }

    // State 3: Default Button
    return (
        <button
            onClick={handleCheck}
            disabled={loading}
            className="text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors px-4 py-2 rounded-lg mt-4 font-medium flex items-center gap-2 w-fit border border-blue-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {loading ? "⏳ Calculating routes..." : "📍 Check Transit Distances"}
        </button>
    );
}