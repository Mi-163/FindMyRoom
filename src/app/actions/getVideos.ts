"use server";

export async function getVideos(hotelName: string, city: string) {
    // THE FALLBACK PAYLOAD
    const fallbackVideos = [
        {
            id: "LXb3EKWsInQ",
            title: "Inside the Ultimate Luxury Resort (Fallback)",
            channel: "Travel & Discover"
        },
        {
            id: "9No-FiEInLA",
            title: "Honest Hotel Review & Walkthrough (Fallback)",
            channel: "Global Vlogger"
        }
    ];

    //  THE MOCK DATA BYPASS

    if (hotelName === "Ocean View Hotel" || hotelName === "Vercetti Estate") {
        console.log("Serving YouTube fallbacks for mock hotel.");
        return fallbackVideos;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // We add "hotel tour review" to force YouTube to find actual vlogs
    const searchQuery = encodeURIComponent(`${hotelName} ${city} hotel tour review`);

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=2&q=${searchQuery}&type=video&key=${apiKey}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        // Catch YouTube-specific quota errors
        if (data.error) {
            console.error("YouTube API Error:", data.error.message);
            throw new Error("YouTube Quota Exceeded");
        }

        return data.items.map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            channel: item.snippet.channelTitle
        }));

    } catch (error) {
        console.warn("⚠️ YouTube API failed/quota hit. Serving fallback vlogs.");
        return fallbackVideos;
    }
}