"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

export default function CoupleFriendlyVote({ hotelId }: { hotelId: string }) {
    const [user, setUser] = useState<User | null>(null);
    const [userVote, setUserVote] = useState<'yes' | 'no' | null>(null);
    const [isVoting, setIsVoting] = useState(false);

    //  Listen for User Login
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    //  Fetch the user's existing vote when they load the page
    useEffect(() => {
        if (!user) return;

        const fetchVote = async () => {
            const docRef = doc(db, "coupleFriendlyVotes", hotelId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                // Check which array the user's ID is sitting in
                if (data.yesVotes?.includes(user.uid)) setUserVote('yes');
                else if (data.noVotes?.includes(user.uid)) setUserVote('no');
            }
        };
        fetchVote();
    }, [user, hotelId]);

    //  Handle the Vote Click
    const handleVote = async (voteYes: boolean) => {
        if (!user) return; // UI handles this, but double-checking for security
        if (isVoting) return;

        setIsVoting(true);
        const docRef = doc(db, "coupleFriendlyVotes", hotelId);

        try {
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                // First time anyone has ever voted on this hotel-Create the document.
                await setDoc(docRef, {
                    yesVotes: voteYes ? [user.uid] : [],
                    noVotes: voteYes ? [] : [user.uid]
                });
            } else {
                // Document exists, atomically update the arrays (prevents double voting)
                await updateDoc(docRef, {
                    yesVotes: voteYes ? arrayUnion(user.uid) : arrayRemove(user.uid),
                    noVotes: voteYes ? arrayRemove(user.uid) : arrayUnion(user.uid)
                });
            }

            // Update local UI instantly
            setUserVote(voteYes ? 'yes' : 'no');
        } catch (error) {
            console.error("Failed to cast vote", error);
        } finally {
            setIsVoting(false);
        }
    };

    // If not logged in, show a disabled state
    if (!user) {
        return (
            <div className="bg-pink-50 border border-pink-100 p-4 rounded-xl mt-6">
                <p className="text-sm font-semibold text-pink-900 mb-2">💕 Is this hotel Couple Friendly?</p>
                <p className="text-xs text-pink-700 opacity-75">You must log in to cast your vote and help the community.</p>
            </div>
        );
    }

    //  Logged in users can vote
    return (
        <div className="bg-pink-50 border border-pink-100 p-4 rounded-xl mt-6 flex items-center justify-between">
            <div>
                <p className="text-sm font-semibold text-pink-900">💕 Is this hotel Couple Friendly?</p>
                <p className="text-xs text-pink-700 opacity-75">Help other travelers by verifying.</p>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => handleVote(true)}
                    disabled={isVoting}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition border ${userVote === 'yes'
                        ? "bg-pink-600 text-white border-pink-600 shadow-sm"
                        : "bg-white text-pink-600 border-pink-200 hover:bg-pink-100"
                        }`}
                >
                    Yes
                </button>
                <button
                    onClick={() => handleVote(false)}
                    disabled={isVoting}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition border ${userVote === 'no'
                        ? "bg-gray-800 text-white border-gray-800 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                        }`}
                >
                    No
                </button>
            </div>
        </div>
    );
}