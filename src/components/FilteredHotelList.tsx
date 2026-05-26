"use client";

import { useState, useMemo, useEffect } from "react";
import HotelCard from "@/components/HotelCard";
import HotelSorter from "@/components/HotelSorter";
import HotelMap from "@/components/HotelMap";
import RedditVibeCheck from "@/components/RedditVibeCheck";

export default function FilteredHotelList({
    initialHotels,
    location,
    checkin,
    checkout
}: {
    initialHotels: any[];
    location: string;
    checkin: string;
    checkout: string;
}) {

    // Find the absolute cheapest and most expensive hotels in the current search array
    const minAvailablePrice = initialHotels.length > 0 ? Math.min(...initialHotels.map(h => h.price)) : 0;
    const maxAvailablePrice = initialHotels.length > 0 ? Math.max(...initialHotels.map(h => h.price)) : 20000;

    // Default the slider to the maximum available price so all hotels show initially
    const [maxPrice, setMaxPrice] = useState<number>(maxAvailablePrice);
    const [minRating, setMinRating] = useState<number>(0);
    const [coupleFriendlyOnly, setCoupleFriendlyOnly] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

    // If the user searches a new city, reset the slider to the new maximum
    useEffect(() => {
        setMaxPrice(maxAvailablePrice);
    }, [maxAvailablePrice]);

    // FILTERING ENGINE
    const filteredHotels = useMemo(() => {
        return initialHotels.filter((hotel) => {
            // Price Check (Now uses the dynamic minAvailablePrice)
            const priceValid = hotel.price >= minAvailablePrice && hotel.price <= maxPrice;

            // Rating Check (Fallback to 0 if API misses it)
            const ratingValid = (hotel.rating || 0) >= minRating;

            // Couple Friendly Check
            const coupleValid = coupleFriendlyOnly ? hotel.isCoupleFriendly === true : true;

            return priceValid && ratingValid && coupleValid;
        });
    }, [initialHotels, maxPrice, minRating, coupleFriendlyOnly, minAvailablePrice]);

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 pt-24">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Search Results</h1>

                    {/* Wrapped the text and button in a flex container for perfect horizontal alignment */}
                    <div className="mt-3 flex items-center gap-4 text-lg text-slate-600">
                        <p>Showing real-time prices for <span className="font-semibold text-blue-600">{location}</span></p>
                        <RedditVibeCheck city={location} />
                    </div>

                    {/* View Controls (List/Map Toggle + Sorter) */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 gap-4">
                        <p className="text-sm text-slate-500">
                            {checkin} to {checkout} • {filteredHotels.length} properties match filters
                        </p>

                        <div className="flex items-center gap-4">
                            <div className="flex bg-gray-200 p-1 rounded-lg">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-4 py-1.5 text-sm font-bold rounded-md transition ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-800' : 'text-gray-500 hover:text-slate-800'}`}
                                >
                                    List
                                </button>
                                <button
                                    onClick={() => setViewMode('map')}
                                    className={`px-4 py-1.5 text-sm font-bold rounded-md transition ${viewMode === 'map' ? 'bg-white shadow-sm text-slate-800' : 'text-gray-500 hover:text-slate-800'}`}
                                >
                                    Map
                                </button>
                            </div>
                            <HotelSorter />
                        </div>
                    </div>
                </div>

                {/* Main Grid Layout: Sidebar + Results */}
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* LEFT SIDEBAR: CORE FILTERS */}
                    <div className="w-full lg:w-1/4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-28">
                            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                Filters
                            </h2>

                            {/* Filter 1: Price Range */}
                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-slate-700 mb-4">
                                    Max Price: <span className="text-blue-600 font-bold">{new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(maxPrice)}</span>
                                </label>
                                <input
                                    type="range"
                                    min={minAvailablePrice}
                                    max={maxAvailablePrice}
                                    step={(maxAvailablePrice - minAvailablePrice) / 20 || 1}
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-2">
                                    <span>{new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(minAvailablePrice)}</span>
                                    <span>{new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(maxAvailablePrice)}</span>
                                </div>
                            </div>

                            <hr className="border-gray-100 mb-6" />

                            {/* Filter 2: Star Rating */}
                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-slate-700 mb-3">Minimum Rating</label>
                                <div className="flex flex-wrap gap-2">
                                    {[0, 3, 4, 4.5].map((rating) => (
                                        <button
                                            key={rating}
                                            onClick={() => setMinRating(rating)}
                                            className={`flex-1 py-2 text-xs font-bold rounded-lg border transition ${minRating === rating
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white text-slate-600 border-gray-200 hover:bg-gray-50"
                                                }`}
                                        >
                                            {rating === 0 ? "Any" : `${rating}+ ⭐`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <hr className="border-gray-100 mb-6" />

                            {/* Filter 3: Couple Friendly */}
                            <div className="mb-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={coupleFriendlyOnly}
                                            onChange={(e) => setCoupleFriendlyOnly(e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`w-11 h-6 rounded-full transition ${coupleFriendlyOnly ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${coupleFriendlyOnly ? 'translate-x-5' : ''}`}></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition">Couple Friendly</p>
                                    </div>
                                </label>
                            </div>

                        </div>
                    </div>

                    {/* RESULTS GRID OR MAP */}
                    <div className="w-full lg:w-3/4">
                        {filteredHotels.length === 0 ? (
                            <div className="bg-white p-12 text-center rounded-2xl border border-gray-200">
                                <h3 className="text-lg font-bold text-slate-800">No hotels match your filters</h3>
                                <p className="text-gray-500 mt-2">Try adjusting your price or rating.</p>
                                <button
                                    onClick={() => {
                                        setMaxPrice(maxAvailablePrice); // Reset to dynamic max
                                        setMinRating(0);
                                        setCoupleFriendlyOnly(false);
                                    }}
                                    className="mt-4 text-blue-600 font-bold hover:underline"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : viewMode === 'map' ? (
                            // SHOW THE INTERACTIVE MAP
                            <HotelMap hotels={filteredHotels} city={location} />
                        ) : (
                            // SHOW THE TRADITIONAL LIST
                            <div className="flex flex-col gap-6">
                                {filteredHotels.map(hotel => (
                                    <HotelCard key={hotel.id} hotel={hotel} city={location} />
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}