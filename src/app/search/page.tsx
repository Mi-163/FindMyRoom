import { fetchLiveHotels } from "@/lib/aggregator";
import HotelCard from "@/components/HotelCard";


export default async function SearchResults({
    searchParams,
}: {

    searchParams: Promise<{ location: string; checkin: string; checkout: string; currency?: string }>;
}) {
    const resolvedParams = await searchParams;


    const displayCurrency = resolvedParams.currency || "INR";

    // Pass it to the engine
    const hotels = await fetchLiveHotels(
        resolvedParams.location,
        resolvedParams.checkin,
        resolvedParams.checkout,
        displayCurrency
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 pt-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-800">Search Results</h1>
                <p className="mt-2 text-lg text-slate-600">
                    Showing real-time prices for <span className="font-semibold text-blue-600">{resolvedParams.location}</span>
                </p>
                <p className="text-sm text-slate-500 mt-1 mb-8">
                    {resolvedParams.checkin} to {resolvedParams.checkout}
                </p>

                {/* Conditional Rendering based on API results */}
                {hotels.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200">
                        <p className="text-gray-500">No hotels found or fetching data. Please check your RapidAPI key or try a different city.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {hotels.map((hotel) => (
                            <HotelCard key={hotel.id} hotel={hotel} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}