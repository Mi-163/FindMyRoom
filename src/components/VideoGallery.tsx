"use client";

import { useState, useEffect } from "react";
import { getVideos } from "@/app/actions/getVideos";

export default function VideoGallery({ hotelName, city }: { hotelName: string, city: string }) {
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchVideos() {
            // Call server action when the component mounts
            const data = await getVideos(hotelName, city);
            if (data) {
                setVideos(data);
            }
            setLoading(false);
        }
        fetchVideos();
    }, [hotelName, city]);

    if (loading) {
        return (
            <div className="mt-8 animate-pulse">
                <h3 className="text-xl font-bold text-slate-800 mb-4">📹 Finding Video Reviews...</h3>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="h-48 md:h-64 bg-slate-200 rounded-xl w-full"></div>
                    <div className="h-48 md:h-64 bg-slate-200 rounded-xl w-full"></div>
                </div>
            </div>
        );
    }

    if (videos.length === 0) return null;

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4">📹 Traveler Vlogs & Reviews</h3>
            <div className="flex flex-col md:flex-row gap-4">
                {videos.map((video) => (
                    <div key={video.id} className="w-full flex-1 flex flex-col">
                        <div className="relative w-full overflow-hidden rounded-xl bg-slate-900 shadow-md" style={{ paddingTop: '56.25%' }}>
                            <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${video.id}`}
                                title={video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <p className="text-sm font-semibold text-slate-700 mt-2 line-clamp-1">{video.title}</p>
                        <p className="text-xs text-slate-500">{video.channel}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}