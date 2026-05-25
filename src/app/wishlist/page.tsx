"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { getUserWishlist } from "@/lib/wishlist";
import { FindMyRoomProperty } from "@/types/hotel";
import HotelCard from "@/components/HotelCard";
import Link from "next/link";

export default function WishlistPage() {
    const [savedHotels, setSavedHotels] = useState<FindMyRoomProperty[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    //  When the page loads, see if someone is logged in.
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // If they are logged in, go to Firebase and grab their specific hotels
                const hotels = await getUserWishlist(currentUser.uid);
                setSavedHotels(hotels);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // If it finished loading and there is NO user, block them.
    if (!loading && !user) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-gray-200 max-w-md">
                    <span className="text-6xl mb-4 block">🔒</span>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Sign in Required</h1>
                    <p className="text-gray-500 mb-6">You must be logged in to view and manage your saved hotels.</p>
                </div>
            </div>
        );
    }

    // If they passed the wall, show them their saved hotels!
    return (
        <div className="min-h-screen pt-24 pb-20 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">My Wishlist ❤️</h1>
                <p className="text-gray-500 mb-8">Properties you have saved for your next trip.</p>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading your favorites...</div>
                ) : savedHotels.length === 0 ? (
                    <div className="text-center bg-white p-16 rounded-2xl shadow-sm border border-gray-200 mt-10">
                        <span className="text-4xl block mb-4">🧳</span>
                        <h2 className="text-xl font-bold text-slate-700 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-6">Start exploring and save places you'd like to stay.</p>
                        <Link href="/search" className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition">
                            Explore Hotels
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {/*reuse the exact same HotelCard from search page! */}
                        {savedHotels.map(hotel => (
                            <HotelCard key={hotel.id} hotel={hotel} city={hotel.city || "Saved Location"} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}