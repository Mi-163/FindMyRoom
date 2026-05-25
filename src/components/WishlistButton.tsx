"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { checkIsSaved, toggleWishlist } from "@/lib/wishlist";
import { FindMyRoomProperty } from "@/types/hotel";

export default function WishlistButton({ hotel }: { hotel: FindMyRoomProperty }) {
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const saved = await checkIsSaved(currentUser.uid, hotel.id);
                setIsSaved(saved);
            } else {
                setIsSaved(false);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [hotel.id]);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            alert("Please log in or sign up to save hotels to your wishlist!");
            return;
        }

        const previousState = isSaved;
        setIsSaved(!isSaved);

        try {
            const newState = await toggleWishlist(user.uid, hotel);
            setIsSaved(newState);
        } catch (error) {
            console.error("Failed to save:", error);
            setIsSaved(previousState);
            alert("Something went wrong saving to your wishlist.");
        }
    };

    if (loading) return null;

    return (
        <button
            onClick={handleToggle}
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform z-10 group"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isSaved ? "#ef4444" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke={isSaved ? "#ef4444" : "currentColor"}
                className="w-5 h-5 text-gray-700 group-hover:text-red-500 transition-colors"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
        </button>
    );
}