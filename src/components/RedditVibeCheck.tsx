"use client";

import { useState } from "react";
import { getRedditSummary } from "@/app/actions/GetRedditSummary";


export default function RedditVibeCheck({ city }: { city: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<string | null>(null);

    const handleOpen = async () => {
        setIsOpen(true);
        if (!summary) {
            setLoading(true);
            const result = await getRedditSummary(city);
            setSummary(result || "Could not fetch the Reddit consensus at this time. Please try again later.");
            setLoading(false);
        }
    };

    return (
        <>
            {/* The Trigger Button - Designed to sit next to city titles or float */}
            <button
                onClick={handleOpen}
                className="flex items-center gap-2 bg-[#FF4500] hover:bg-[#e03d00] text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-sm transition transform hover:scale-105"
            >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                </svg>
                Vibe Check
            </button>

            {/* The Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="bg-[#FF4500] p-4 flex justify-between items-center text-white">
                            <h2 className="font-bold flex items-center gap-2">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" /></svg>
                                Reddit Consensus: {city}
                            </h2>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition">
                                ✖
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                    <div className="w-8 h-8 border-4 border-[#FF4500] border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <p>Scanning Reddit threads for {city}...</p>
                                </div>
                            ) : (
                                <div
                                    className="prose prose-sm prose-slate max-w-none text-gray-700"
                                    // React markdown parsing trick for Gemini bullet points
                                    dangerouslySetInnerHTML={{ __html: summary?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') || "" }}
                                />
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 p-4 border-t border-gray-100 text-xs text-gray-400 text-center">
                            Aggregated via AI from community discussions. Opinions may vary.
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}