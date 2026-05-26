"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

const libraries: ("places")[] = ["places"];

export default function SearchHero() {
    const router = useRouter();

    // State to hold our dates
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");

    //  Dynamically generate today's date string (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    // Ref to hold the Google Maps object
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        libraries: libraries,
    });

    const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    // The function that runs when you click "Search"
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault(); // Stops the page from refreshing

        let locationStr = "";

        // Attempt 1: Try to get the official Google Dropdown selection
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place) {
                locationStr = place.formatted_address || place.name || "";
            }
        }

        // Attempt 2 (Fallback): If they didn't click the dropdown, just grab the text
        if (!locationStr) {
            const inputElement = document.getElementById("location-input") as HTMLInputElement;
            if (inputElement) {
                locationStr = inputElement.value;
            }
        }

        // If we have all three pieces of data, route to the search page!
        if (locationStr && checkIn && checkOut) {
            const queryParams = new URLSearchParams({
                location: locationStr,
                checkin: checkIn,
                checkout: checkOut,
            });
            router.push(`/search?${queryParams.toString()}`);
        } else {
            alert("Please fill out the location and both dates.");
        }
    };

    return (
        <section className="flex flex-col items-center justify-center min-h-[60vh] bg-blue-50 px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-slate-800">
                Find Your Perfect Stay
            </h1>
            <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-4xl">
                {/*  BIND THE SUBMIT EVENT HERE */}
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 md:items-end">

                    {/* Location */}
                    <div className="flex-1 flex flex-col">
                        <label className="text-sm font-semibold text-gray-600 mb-1 ml-1">Location</label>
                        {isLoaded ? (
                            <Autocomplete onLoad={onLoad}>
                                <input
                                    id="location-input"
                                    type="text"
                                    placeholder="Enter city or hotel"
                                    className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-800 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </Autocomplete>
                        ) : (
                            <input type="text" placeholder="Loading maps..." disabled className="w-full px-4 py-2 border border-gray-300 bg-gray-100 text-gray-500 rounded-lg focus:outline-none" />
                        )}
                    </div>

                    {/* Check-in */}
                    <div className="flex-1 flex flex-col">
                        <label className="text-sm font-semibold text-gray-600 mb-1 ml-1">Check-in</label>
                        <input
                            type="date"
                            value={checkIn}
                            min={today} //  Blocks all dates before today
                            onChange={(e) => {
                                setCheckIn(e.target.value);
                                // Safeguard: If the new check-in date crosses the current checkout date, clear checkout
                                if (checkOut && e.target.value > checkOut) {
                                    setCheckOut("");
                                }
                            }}
                            required
                            className="px-4 py-2 border border-gray-300 bg-white text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Check-out */}
                    <div className="flex-1 flex flex-col">
                        <label className="text-sm font-semibold text-gray-600 mb-1 ml-1">Check-out</label>
                        <input
                            type="date"
                            value={checkOut}
                            min={checkIn || today} //  Blocks all dates prior to the selected check-in date (or today if empty)
                            onChange={(e) => setCheckOut(e.target.value)}
                            required
                            className="px-4 py-2 border border-gray-300 bg-white text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md">
                        Search
                    </button>
                </form>
            </div>
        </section>
    );
}