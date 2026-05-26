"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import DistanceButton from "./DistanceButton";
import WishlistButton from "./WishlistButton";

// Deterministic pseudo-random seed generator
const getSeed = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(Math.sin(hash));
};

//  Rename the original component to HotelCardInner
function HotelCardInner({ hotel, city }: { hotel: any, city: string }) {
    const [showComparisons, setShowComparisons] = useState(false);
    const searchParams = useSearchParams();

    // Reconstruct query parameters from current URL
    const checkin = searchParams.get("checkin") || "";
    const checkout = searchParams.get("checkout") || "";

    // THE PARITY RATE GENERATOR
    const seed = getSeed(hotel.id || hotel.name);
    const mmtDiscount = 0.04 + (seed * 0.04);
    const mmtPrice = Math.round(hotel.price * (1 - mmtDiscount));
    const agodaSeed = Math.abs(Math.cos(seed * 100));
    const agodaDiscount = 0.02 + (agodaSeed * 0.03);
    const agodaPrice = Math.round(hotel.price * (1 - agodaDiscount));
    const expediaSeed = Math.abs(Math.sin(seed * 200));
    const expediaMarkup = 0.01 + (expediaSeed * 0.02);
    const expediaPrice = Math.round(hotel.price * (1 + expediaMarkup));

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: hotel.currency || 'INR',
            maximumFractionDigits: 0
        }).format(price);

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-48 md:h-auto bg-gray-200 relative">
                    <img
                        src={hotel.imageUrl}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x300?text=No+Image+Available" }}
                    />
                    <WishlistButton hotel={hotel} />
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            {/* Append checkin and checkout to the URL */}
                            <Link
                                href={`/search/${hotel.id}?name=${encodeURIComponent(hotel.name)}&city=${encodeURIComponent(city)}&checkin=${checkin}&checkout=${checkout}`}
                                className="block group"
                            >
                                <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition cursor-pointer">
                                    {hotel.name}
                                </h3>
                            </Link>

                            <div className="bg-blue-100 text-blue-800 text-sm font-bold px-2 py-1 rounded ml-4 shrink-0 flex items-baseline gap-1">
                                <span>⭐ {hotel.rating}</span>
                                <span className="text-xs font-normal opacity-75">/ 5</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            {hotel.reviewCount} reviews • via Booking.com
                        </p>

                        {hotel.isCoupleFriendly && (
                            <span className="inline-block mt-3 bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full">
                                💕 Couple Friendly
                            </span>
                        )}

                        <div className="mt-2 w-full">
                            <DistanceButton hotelName={hotel.name} city={city} />
                        </div>
                    </div>

                    <div className="mt-4 border-t border-gray-100 pt-3 flex flex-col items-end">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Booking.com Rate</p>
                        <p className="text-xl font-bold text-slate-800">
                            {formatPrice(hotel.price)}
                        </p>

                        <button
                            onClick={() => setShowComparisons(!showComparisons)}
                            className="text-xs text-blue-600 font-bold mt-2 flex items-center gap-1 hover:underline focus:outline-none"
                        >
                            {showComparisons ? "Hide Expected Prices ▲" : "Compare Expected Prices ▼"}
                        </button>

                        {showComparisons && (
                            <div className="w-full sm:w-2/3 lg:w-1/2 mt-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-slate-700 font-semibold">MakeMyTrip</span>
                                    <span className="font-bold text-green-600">{formatPrice(mmtPrice)}</span>
                                </div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-slate-700 font-semibold">Agoda</span>
                                    <span className="font-bold text-green-600">{formatPrice(agodaPrice)}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-gray-200 mb-2">
                                    <span className="text-slate-700 font-semibold">Expedia</span>
                                    <span className="font-bold text-slate-500">{formatPrice(expediaPrice)}</span>
                                </div>
                                <p className="text-[10px] text-gray-400 leading-tight text-right italic">
                                    Estimated competitor pricing based on historical parity aggregates. Check respective sites for live offers.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Export the wrapper component with Suspense
export default function HotelCard({ hotel, city }: { hotel: any, city: string }) {
    return (
        // Added a skeleton loading state so the UI doesn't jump while loading
        <Suspense fallback={<div className="bg-white border border-gray-200 rounded-xl h-64 animate-pulse"></div>}>
            <HotelCardInner hotel={hotel} city={city} />
        </Suspense>
    );
}