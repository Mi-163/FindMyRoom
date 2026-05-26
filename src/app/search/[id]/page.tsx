import Link from "next/link";
import { fetchHotelReviews } from "@/lib/aggregator";
import ReviewForm from "@/components/ReviewForm";
import VideoGallery from "@/components/VideoGallery";
import CoupleFriendlyVote from "@/components/CoupleFriendlyVote";
import DistanceButton from "@/components/DistanceButton";

export default async function HotelDetails({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ name?: string; city?: string }>;
}) {
    const resolvedParams = await params;
    const hotelId = resolvedParams.id;

    const resolvedSearchParams = await searchParams;
    const hotelName = resolvedSearchParams.name || "Luxury Hotel";
    const city = resolvedSearchParams.city || "Kochi";

    // Fetch the reviews from new engine
    const { globalReviews, localReviews } = await fetchHotelReviews(hotelId);

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 pt-24">
            <div className="max-w-6xl mx-auto">

                <div className="mb-6">
                    <Link href="/search" className="text-blue-600 hover:underline font-medium">
                        &larr; Back to Search Results
                    </Link>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">{hotelName}</h1>
                    <p className="text-gray-500 mt-2 text-lg">Located in {city} • ID: {hotelId}</p>

                    <div className="mt-6">
                        <DistanceButton hotelName={hotelName} city={city} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Window: Global Platform Reviews */}
                    {/*  Removed p-6 from the outer container */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] overflow-y-auto">

                        {/*  Added p-6 to the sticky header so it touches the absolute top edge */}
                        <div className="sticky top-0 bg-white p-6 pb-4 border-b z-10 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-800 flex justify-between items-center">
                                Global Platform Reviews
                                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Booking.com API</span>
                            </h2>
                        </div>

                        {/*  Added padding back to the content wrapper so it still looks beautiful */}
                        <div className="flex flex-col gap-4 px-6 pb-6 pt-2">
                            {globalReviews.length > 0 ? globalReviews.map((review: any) => (
                                <div key={review.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-semibold text-slate-700">{review.author}</span>
                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                                            ⭐ {Number(review.score > 5 ? review.score / 2 : review.score).toFixed(1)}
                                        </span>
                                    </div>
                                    <h4 className="font-medium text-slate-800 text-sm mb-1">{review.title}</h4>
                                    <p className="text-sm text-gray-600 line-clamp-3">{review.text}</p>
                                    <p className="text-xs text-gray-400 mt-2">{review.date}</p>
                                </div>
                            )) : (
                                <p className="text-gray-500 text-center mt-10">No global reviews available.</p>
                            )}
                        </div>
                    </div>

                    {/* Right Window: Local Authenticated Ratings */}
                    {/*  Removed p-6 from the outer container */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] overflow-y-auto border-t-4 border-t-pink-500">

                        {/*  Pushed sticky to the absolute ceiling */}
                        <div className="sticky top-0 bg-white p-6 pb-4 border-b z-10 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-800 flex justify-between items-center">
                                Local Authenticated Ratings
                                <span className="text-sm bg-pink-100 text-pink-800 px-2 py-1 rounded">FindMyRoom Data</span>
                            </h2>
                        </div>

                        {/*  Wrapped the rest of the components in a padded content box */}
                        <div className="px-6 pb-6 pt-4">
                            <div className="mb-6">
                                <CoupleFriendlyVote hotelId={hotelId} />
                            </div>

                            <ReviewForm hotelId={hotelId} />

                            <div className="flex flex-col gap-4 mt-6">
                                {localReviews.length > 0 ? localReviews.map((review: any) => (
                                    <div key={review.id} className="p-4 bg-pink-50 rounded-lg border border-pink-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-semibold text-slate-700">{review.author}</span>
                                            <span className="bg-pink-200 text-pink-900 text-xs font-bold px-2 py-1 rounded">
                                                ⭐ {Number(review.score).toFixed(1)}
                                            </span>
                                        </div>
                                        <h4 className="font-medium text-slate-800 text-sm mb-1">{review.title}</h4>
                                        <p className="text-sm text-gray-600">{review.text}</p>
                                        <p className="text-xs text-gray-400 mt-2">{review.date}</p>
                                    </div>
                                )) : (
                                    <p className="text-gray-500 text-center mt-10">No local reviews yet. Be the first!</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* VIDEO GALLERY PLACEMENT */}
                <div className="mt-12 border-t border-gray-200 pt-8">
                    <VideoGallery hotelName={hotelName} city={city} />
                </div>

            </div>
        </div>
    );
}