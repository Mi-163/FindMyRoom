import { fetchLiveHotels } from "@/lib/aggregator";
import FilteredHotelList from "@/components/FilteredHotelList";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// 📍 TRUST ALGORITHM
function evaluateCoupleFriendlyStatus(hotel: any, firebaseOverrides: Record<string, boolean>) {
    // 1. Community Override (Highest Priority)
    if (firebaseOverrides[hotel.id] !== undefined) {
        return firebaseOverrides[hotel.id];
    }

    // Deterministic Chain Matching
    const safeChains = ["taj", "lemon tree", "ibis", "radisson", "ginger", "novotel", "marriott", "hyatt", "oyo", "treebo", "fabhotel"];
    const hotelName = (hotel.name || "").toLowerCase();

    if (safeChains.some(chain => hotelName.includes(chain))) {
        return true;
    }

    // Review & Description Keyword Mining (NLP)
    const hotelDataString = JSON.stringify(hotel).toLowerCase();

    // Red Flags (Immediate fail)
    const redFlags = ["police", "marriage certificate", "harassment", "denied entry", "moral policing", "not safe for couples", "unmarried couples not allowed"];
    if (redFlags.some(flag => hotelDataString.includes(flag))) {
        return false;
    }

    // Green Flags (Approval)
    const greenFlags = ["couple friendly", "unmarried couples allowed", "safe for couples", "no hassle at check-in", "couples welcome"];
    if (greenFlags.some(flag => hotelDataString.includes(flag))) {
        return true;
    }

    // Default Fallback: If we can't prove it's safe, we assume it isn't.
    return false;
}

export default async function SearchResults({
    searchParams,
}: {
    searchParams: Promise<{ location: string; checkin: string; checkout: string; currency?: string; sort?: string }>;
}) {
    const resolvedParams = await searchParams;

    // 📍 THE GUARD CLAUSE: Catch missing URL parameters before hitting the API
    if (!resolvedParams.location || !resolvedParams.checkin || !resolvedParams.checkout) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 md:p-10 pt-24 flex items-center justify-center">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Search Expired</h2>
                    <p className="text-slate-500 mb-6">Your search parameters are missing. Please start a new search.</p>
                    <a href="/" className="inline-block w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">
                        Return Home
                    </a>
                </div>
            </div>
        );
    }

    const displayCurrency = resolvedParams.currency || "INR";

    // Pass it to the engine to get the raw data
    let rawHotels = await fetchLiveHotels(
        resolvedParams.location,
        resolvedParams.checkin,
        resolvedParams.checkout,
        displayCurrency
    );

    // Grab Community Votes from Firestore (Reading Array Counts!)
    let communityVotes: Record<string, boolean> = {};
    try {
        const querySnapshot = await getDocs(collection(db, "coupleFriendlyVotes"));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const yesCount = data.yesVotes ? data.yesVotes.length : 0;
            const noCount = data.noVotes ? data.noVotes.length : 0;

            // If it has votes, determine the consensus. 
            if (yesCount > 0 || noCount > 0) {
                communityVotes[doc.id] = yesCount >= noCount;
            }
        });
    } catch (error) {
        console.warn("Could not fetch Firebase community votes, relying strictly on NLP/Chains.", error);
    }

    // Strict Real Data, 5-Star Scale Squash & Trust Algorithm
    let hotels = rawHotels.map((hotel: any) => {
        // Grab the raw rating, default to 0 if missing
        let rawRating = hotel.rating || 0;

        // If the API gave us a number out of 10 (greater than 5), divide it by 2 to make it a 5-star scale
        let normalizedRating = rawRating > 5
            ? Number((rawRating / 2).toFixed(1))
            : rawRating;

        return {
            ...hotel,
            rating: normalizedRating, // strictly out of 5
            isCoupleFriendly: evaluateCoupleFriendlyStatus(hotel, communityVotes) // Trust Algorithm applied
        };
    });

    // ARRAY SORTING ENGINE
    const sortParam = resolvedParams.sort;

    if (sortParam === "price_asc") {
        hotels.sort((a: any, b: any) => a.price - b.price);
    } else if (sortParam === "price_desc") {
        hotels.sort((a: any, b: any) => b.price - a.price);
    }

    // Handle API Failure or Empty State Server-Side
    if (hotels.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 md:p-10 pt-24">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-slate-800">Search Results</h1>
                    <div className="bg-white p-8 mt-8 rounded-xl shadow-sm text-center border border-gray-200">
                        <p className="text-gray-500">No hotels found or fetching data. Please check your RapidAPI key or try a different city.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Pass the live, sorted, and normalized data to the Interactive Client Component
    return (
        <FilteredHotelList
            initialHotels={hotels}
            location={resolvedParams.location}
            checkin={resolvedParams.checkin}
            checkout={resolvedParams.checkout}
        />
    );
}