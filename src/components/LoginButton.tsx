"use client";

import { useState, useEffect, useRef } from "react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";

export default function LoginButton() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [imgFailed, setImgFailed] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setImgFailed(false);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleGoogleAuth = async (e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        if (isAuthenticating) return;

        setIsAuthenticating(true);

        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error: any) {
            const errorString = String(error?.message || "") + String(error?.code || "");
            if (errorString.includes('popup') || errorString.includes('cancelled')) {
                console.info("Popup blocked or closed by user. Safely ignored.");
            } else {
                console.warn("Auth issue:", error);
            }
        } finally {
            setIsAuthenticating(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsDropdownOpen(false);
        } catch (error) {
            console.warn("Logout failed:", error);
        }
    };

    if (loading) {
        return <div className="h-10 w-32 bg-slate-200 animate-pulse rounded-full"></div>;
    }

    if (user) {
        const useGooglePhoto = user.photoURL && !imgFailed;

        return (
            <div className="relative" ref={dropdownRef}>
                {/* Profile Toggle */}
                <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 cursor-pointer select-none hover:opacity-85 transition"
                >
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800 line-clamp-1">{user.displayName}</p>
                        <p className="text-xs text-slate-500">Traveler</p>
                    </div>

                    {/* Centered containment settings for the default avatar asset */}
                    <img
                        src={useGooglePhoto ? user.photoURL! : "/default-avatar.png"}
                        alt="Profile"
                        onError={() => setImgFailed(true)}
                        className={`w-10 h-10 rounded-full border-2 border-blue-500 shadow-sm bg-white ${useGooglePhoto
                            ? "object-cover"
                            : "object-contain p-0.5"
                            }`}
                    />
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
                            <p className="text-sm font-bold text-slate-800 truncate">{user.displayName}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>

                        <Link
                            href="/wishlist"
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition w-full text-left"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            ❤️ My Wishlist
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition w-full text-left border-t border-gray-50 mt-1"
                        >
                            🚪 Log Out
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleGoogleAuth}
                disabled={isAuthenticating}
                className="text-slate-600 hover:text-slate-900 font-semibold px-4 py-2 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Log in
            </button>
            <button
                onClick={handleGoogleAuth}
                disabled={isAuthenticating}
                className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-full font-semibold transition shadow-sm text-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
            >
                {isAuthenticating ? "Opening..." : "Sign up"}
            </button>
        </div>
    );
}