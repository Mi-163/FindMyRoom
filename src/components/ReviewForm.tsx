"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ReviewForm({ hotelId }: { hotelId: string }) {
    const [author, setAuthor] = useState("");
    const [score, setScore] = useState("10");
    const [text, setText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // use the Next.js router to instantly refresh the page data after submitting
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Push the new data directly to your Firestore 'reviews' collection
            await addDoc(collection(db, "reviews"), {
                hotelId: hotelId,
                author: author,
                score: parseFloat(score),
                title: "Verified Guest Review",
                text: text,
                date: new Date().toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })
            });

            // Clear the form fields
            setAuthor("");
            setScore("10");
            setText("");

            // trigger the Server Component to re-fetch and show the new review
            router.refresh();
        } catch (error) {
            console.error("Error writing to database:", error);
            alert("Failed to submit review. Check your console.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <option value="10">⭐ 10</option>
                    <option value="9">⭐ 9</option>
                    <option value="8">⭐ 8</option>
                    <option value="7">⭐ 7</option>
                    <option value="6">⭐ 6</option>
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