"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export default function ReviewForm({ hotelId }: { hotelId: string }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const [author, setAuthor] = useState("");
    // 📍 FIXED: Default score is now 5
    const [score, setScore] = useState("5");
    const [text, setText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser?.displayName) {
                setAuthor(currentUser.displayName);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            alert("You must be logged in to submit a review.");
            return;
        }

        setIsSubmitting(true);

        try {
            await addDoc(collection(db, "reviews"), {
                hotelId: hotelId,
                author: author,
                score: parseFloat(score),
                title: "Verified Guest Review",
                text: text,
                date: new Date().toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })
            });

            setAuthor("");
            setScore("5");
            setText("");

            router.refresh();
        } catch (error) {
            console.error("Error writing to database:", error);
            alert("Failed to submit review. Check your console.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="mb-6 h-48 bg-pink-50/50 animate-pulse rounded-lg border border-pink-100"></div>;
    }

    if (!user) {
        return (
            <div className="mb-6 p-6 bg-slate-50 border border-slate-200 rounded-lg text-center">
                <h3 className="text-sm font-bold text-slate-800 mb-2">Want to share your experience?</h3>
                <p className="text-slate-500 text-sm">You must be logged in to leave a review for this property.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
            <h3 className="text-sm font-bold text-pink-900 mb-3">Leave a Local Review</h3>

            <div className="flex gap-4 mb-3">
                <input
                    type="text"
                    placeholder="Your Name"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="flex-1 p-2 text-sm border rounded outline-none focus:border-pink-400 text-black"
                />


                <select
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="p-2 text-sm border rounded outline-none focus:border-pink-400 bg-white text-black"
                >
                    <option value="5">⭐ 5</option>
                    <option value="4">⭐ 4</option>
                    <option value="3">⭐ 3</option>
                    <option value="2">⭐ 2</option>
                    <option value="1">⭐ 1</option>
                </select>
            </div>

            <textarea
                placeholder="What was your experience like?"
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-2 text-sm border rounded outline-none focus:border-pink-400 mb-3 h-20 resize-none text-black"
            />

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-pink-600 text-white font-bold py-2 rounded hover:bg-pink-700 transition disabled:opacity-50"
            >
                {isSubmitting ? "Posting..." : "Post Review"}
            </button>
        </form>
    );
}