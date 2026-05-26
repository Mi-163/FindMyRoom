"use client";

import { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import Link from "next/link";



const libraries: ("places")[] = ["places"];

export default function HotelMap({ hotels, city }: { hotels: any[], city: string }) {

    // Load the Google Maps Script securely
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: libraries, //  
    });

    const [selectedHotel, setSelectedHotel] = useState<any | null>(null);

    // Default to a zoomed-out world view until real coordinates are loaded
    const [center, setCenter] = useState({ lat: 20, lng: 0 });

    //  THE GLOBAL LOCATION ENGINE
    useEffect(() => {
        if (!isLoaded) return;

        // Center the map on the first available property.
        if (hotels.length > 0 && hotels[0].latitude && hotels[0].longitude) {
            setCenter({ lat: hotels[0].latitude, lng: hotels[0].longitude });
        }
        // The filter hid all the hotels. Dynamically geocode the city name
        else if (city) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: city }, (results, status) => {
                if (status === "OK" && results?.[0]) {
                    setCenter({
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    });
                } else {
                    console.warn("Could not geocode the city fallback.", status);
                }
            });
        }
    }, [hotels, city, isLoaded]);

    if (loadError) return <div className="p-8 bg-red-50 text-red-600 rounded-xl">Error loading Google Maps. Check your API Key.</div>;
    if (!isLoaded) return <div className="p-8 bg-gray-100 text-gray-500 rounded-xl animate-pulse h-[600px] flex items-center justify-center">Loading Map Interactive...</div>;

    return (
        <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative">
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={center}
                zoom={12}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    styles: [
                        { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] } // Hides clutter
                    ]
                }}
            >
                {/* Render a Marker for every hotel */}
                {hotels.map((hotel) => {
                    // Safety check: don't plot if coordinates are 0 (missing)
                    if (!hotel.latitude || !hotel.longitude) return null;

                    return (
                        <Marker
                            key={hotel.id}
                            position={{ lat: hotel.latitude, lng: hotel.longitude }}
                            onClick={() => setSelectedHotel(hotel)}
                        />
                    );
                })}

                {/* Show details when a pin is clicked */}
                {selectedHotel && (
                    <InfoWindow
                        position={{ lat: selectedHotel.latitude, lng: selectedHotel.longitude }}
                        onCloseClick={() => setSelectedHotel(null)}
                    >
                        <div className="p-2 max-w-[200px]">
                            <img src={selectedHotel.imageUrl} alt={selectedHotel.name} className="w-full h-24 object-cover rounded mb-2" />
                            <h3 className="font-bold text-sm text-slate-800 line-clamp-1">{selectedHotel.name}</h3>
                            <div className="flex justify-between items-center mt-1">
                                <p className="font-bold text-blue-600">
                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: selectedHotel.currency || 'INR', maximumFractionDigits: 0 }).format(selectedHotel.price)}
                                </p>
                                <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">⭐ {selectedHotel.rating}</span>
                            </div>
                            <Link href={`/search/${selectedHotel.id}?name=${encodeURIComponent(selectedHotel.name)}&city=${encodeURIComponent(city)}`} className="mt-3 block w-full text-center bg-gray-900 text-white text-xs font-bold py-1.5 rounded hover:bg-black transition">
                                View Deal
                            </Link>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>

            {/* Warning label if no hotels match the filter */}
            {hotels.length === 0 && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md border border-gray-200 text-sm font-bold text-slate-700 z-10">
                    No hotels match your filters in {city}
                </div>
            )}
        </div>
    );
}