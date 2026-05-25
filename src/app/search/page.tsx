import { fetchLiveHotels } from "@/lib/aggregator";
import HotelCard from "@/components/HotelCard";
import HotelSorter from "@/components/HotelSorter";

export default async function SearchResults({
    searchParams,
}: {
    // Added 'sort' to the expected URL parameters
    searchParams: Promise<{ location: string; checkin: string; checkout: string; currency?: string; sort?: string }>;
}) {
    const resolvedParams = await searchParams;

    const displayCurrency = resolvedParams.currency || "INR";

    // Pass it to the engine
    let hotels = await fetchLiveHotels(
        resolvedParams.location,
        resolvedParams.checkin,
        resolvedParams.checkout,
        displayCurrency
    );

    // 🧠 DAY 7: ARRAY SORTING ENGINE
    // FIX: Extract 'sort' from the fully resolved params, not the promise!
    const sortParam = resolvedParams.sort;

    if (sortParam === "price_asc") {
        hotels.sort((a: any, b: any) => a.price - b.price);
    } else if (sortParam === "price_desc") {
        hotels.sort((a: any, b: any) => b.price - a.price);
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 pt-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-800">Search Results</h1>
                <p className="mt-2 text-lg text-slate-600">
                    Showing real-time prices for <span className="font-semibold text-blue-600">{resolvedParams.location}</span>
                </p>

                {/* Wrap the dates and the dropdown in a flexbox so they sit nicely next to each other */}
                <div className="flex justify-between items-center mt-1 mb-8">
                    <p className="text-sm text-slate-500">
                        {resolvedParams.checkin} to {resolvedParams.checkout}
                    </p>

                    {/* FIX: Actually render the dropdown on the screen! */}
                    <HotelSorter />
                </div>

                {/* Conditional Rendering based on API results */}
                {hotels.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200">
                        <p className="text-gray-500">No hotels found or fetching data. Please check your RapidAPI key or try a different city.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {hotels.map((hotel) => (
                            <HotelCard key={hotel.id} hotel={hotel} city={resolvedParams.location} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}