"use client"; //  tells Next.js to run this component in the user's browser

import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

//  define the libraries array OUTSIDE the component so it doesn't trigger infinite re-renders
const libraries: ("places")[] = ["places"];

export default function SearchHero() {
    //  securely loads the Google script using your hidden API key
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        libraries: libraries,
    });

    return (
        <section className="flex flex-col items-center justify-center min-h-[60vh] bg-blue-50 px-4">

            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-slate-800">
                Find Your Perfect Stay
            </h1>

            <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-4xl">
                <form className="flex flex-col md:flex-row gap-4 md:items-end">

                    {/* Location */}
                    <div className="flex-1 flex flex-col">
                        <label className="text-sm font-semibold text-gray-600 mb-1 ml-1">Location</label>

                        {/*  check if the Google script is loaded. If yes, show Autocomplete. If no, show a disabled loading state. */}
                        {isLoaded ? (
                            <Autocomplete>
                                <input
                                    type="text"
                                    placeholder="Enter city or hotel"
                                    className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-800 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </Autocomplete>
                        ) : (
                            <input
                                type="text"
                                placeholder="Loading maps..."
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 bg-gray-100 text-gray-500 rounded-lg focus:outline-none"
                            />
                        )}
                    </div>

                    {/* Check-in */}
                    <div className="flex-1 flex flex-col">
                        <label className="text-sm font-semibold text-gray-600 mb-1 ml-1">Check-in</label>
                        <input
                            type="date"
                            className="px-4 py-2 border border-gray-300 bg-white text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Check-out */}
                    <div className="flex-1 flex flex-col">
                        <label className="text-sm font-semibold text-gray-600 mb-1 ml-1">Check-out</label>
                        <input
                            type="date"
                            className="px-4 py-2 border border-gray-300 bg-white text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Search Button */}
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md"
                    >
                        Search
                    </button>

                </form>
            </div>
        </section>
    );
}