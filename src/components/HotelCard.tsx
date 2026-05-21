"use client";

import Link from "next/link";
import { FindMyRoomProperty } from "@/types/hotel";

export default function HotelCard({ hotel }: { hotel: FindMyRoomProperty }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
            <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="md:w-1/3 h-48 md:h-auto bg-gray-200">
                    <img
                        src={hotel.imageUrl}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x300?text=No+Image+Available" }}
                    />
                </div>

                {/* Details Section */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            {/* 🚨 THIS IS THE ACTIVE ROUTING LINK 🚨 */}
                            <Link href={`/search/${hotel.id}`} className="block group">
                                <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition cursor-pointer">
                                    {hotel.name}
                                </h3>
                            </Link>

                            <div className="bg-blue-100 text-blue-800 text-sm font-bold px-2 py-1 rounded ml-4 shrink-0">
                                ⭐ {hotel.rating}
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            {hotel.reviewCount} reviews • via {hotel.sourcePlatform}
                        </p>

                        {/* Dynamic Couple Friendly Badge */}
                        {hotel.isCoupleFriendly && (
                            <span className="inline-block mt-3 bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full">
                                💕 Couple Friendly
                            </span>
                        )}
                    </div>

                    {/* Price Section */}
                    <div className="mt-4 text-right">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Best Available Rate</p>
                        <p className="text-2xl font-bold text-slate-800">
                            {hotel.currency} {hotel.price}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}