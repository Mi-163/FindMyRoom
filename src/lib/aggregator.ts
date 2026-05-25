import { FindMyRoomProperty } from "@/types/hotel";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

function extractBestPrice(propertyData: any, defaultCurrency: string) {
    let finalPrice = 0;
    let finalCurrency = defaultCurrency;

    // Look for the standard Gross Price (most common)
    if (propertyData.priceBreakdown?.grossPrice?.value) {
        finalPrice = propertyData.priceBreakdown.grossPrice.value;
        finalCurrency = propertyData.priceBreakdown.grossPrice.currency;
    }
    // Fallback to the All-Inclusive Price
    else if (propertyData.priceBreakdown?.allInclusivePrice?.value) {
        finalPrice = propertyData.priceBreakdown.allInclusivePrice.value;
        finalCurrency = propertyData.priceBreakdown.allInclusivePrice.currency;
    }
    // Absolute desperation (legacy Booking API format)
    else if (propertyData.minPrice?.value) {
        finalPrice = propertyData.minPrice.value;
        finalCurrency = propertyData.minPrice.currency;
    }

    return {
        // Round to nearest whole number to keep the UI clean
        value: Math.round(finalPrice),
        currency: finalCurrency || defaultCurrency
    };
}

const RAPID_API_HOST = 'booking-com15.p.rapidapi.com';

export async function fetchLiveHotels(
    location: string,
    checkin: string,
    checkout: string,
    userCurrency: string = "USD"
): Promise<FindMyRoomProperty[]> {

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY as string,
            'X-RapidAPI-Host': RAPID_API_HOST
        }
    };

    try {
        const destUrl = `https://${RAPID_API_HOST}/api/v1/hotels/searchDestination?query=${encodeURIComponent(location)}`;
        const destResponse = await fetch(destUrl, options);
        const destData = await destResponse.json();

        // API RATE LIMIT DETECTOR
        if (destData?.message && destData.message.includes("exceeded")) {
            console.warn("⚠️ RapidAPI Quota Exceeded! Serving Vice City fallback data.");
            return [
                {
                    id: "ocean-view-vc",
                    name: "Ocean View Hotel",
                    price: 150,
                    currency: "USD",
                    rating: 8.5,
                    reviewCount: 1240,
                    imageUrl: "/ocean-view.webp",
                    isCoupleFriendly: true,
                    sourcePlatform: "FindMyRoom Fallback"
                },
                {
                    id: "vercetti-estate",
                    name: "Vercetti Estate",
                    price: 5000,
                    currency: "USD",
                    rating: 10.0,
                    reviewCount: 89,
                    imageUrl: "/vercetti.jpg",
                    isCoupleFriendly: true,
                    sourcePlatform: "FindMyRoom Fallback"
                }
            ];
        }

        // Extract the unique ID from the first result (Duplicates removed!)
        const destId = destData?.data?.[0]?.dest_id;
        const searchType = destData?.data?.[0]?.search_type || "CITY";

        if (!destId) {
            console.log("=== DESTINATION SEARCH PAYLOAD ===");
            console.log(JSON.stringify(destData, null, 2).substring(0, 500));
            console.log("==================================");
            console.error("Could not find a destination ID for this location.");
            return [];
        }

        const hotelsUrl = `https://${RAPID_API_HOST}/api/v1/hotels/searchHotels?dest_id=${destId}&search_type=${searchType}&arrival_date=${checkin}&departure_date=${checkout}&adults=2&room_qty=1&page_number=1&currency_code=${userCurrency}`;

        const hotelsResponse = await fetch(hotelsUrl, options);
        const hotelsData = await hotelsResponse.json();

        if (!hotelsData || !hotelsData.data || !hotelsData.data.hotels) {
            return [];
        }

        const normalizedData: FindMyRoomProperty[] = hotelsData.data.hotels.map((item: any) => {
            // Run the raw API data through new normalization engine
            const cleanPrice = extractBestPrice(item.property, userCurrency);

            return {
                id: item.property.id?.toString() || Math.random().toString(),
                name: item.property.name,

                // Use the cleaned data
                price: cleanPrice.value,
                currency: cleanPrice.currency,

                rating: item.property.reviewScore || 0,
                reviewCount: item.property.reviewCount || 0,
                imageUrl: item.property.photoUrls?.[0] || "",
                isCoupleFriendly: true,
                sourcePlatform: "Booking.com"
            };
        });

        return normalizedData;

    } catch (error) {
        console.error("Aggregator Engine Error:", error);
        console.warn("⚠️ RapidAPI Connection Failed/Timed Out! Serving Vice City fallback data.");

        // The Ultimate Safety Net: If the API completely dies, the UI survives.
        return [
            {
                id: "ocean-view-vc",
                name: "Ocean View Hotel",
                price: 150,
                currency: "USD",
                rating: 8.5,
                reviewCount: 1240,
                imageUrl: "/ocean-view.webp",
                isCoupleFriendly: true,
                sourcePlatform: "FindMyRoom Fallback"
            },
            {
                id: "vercetti-estate",
                name: "Vercetti Estate",
                price: 5000,
                currency: "USD",
                rating: 10.0,
                reviewCount: 89,
                imageUrl: "/vercetti.jpg",
                isCoupleFriendly: true,
                sourcePlatform: "FindMyRoom Fallback"
            }
        ];
    }
} // <-- This crucial bracket was missing to close the function

export async function fetchHotelReviews(hotelId: string) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY as string,
            'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
        }
    };

    let globalReviews: any[] = [];

    try {
        const reviewUrl = `https://booking-com15.p.rapidapi.com/api/v1/hotels/getHotelReviews?hotel_id=${hotelId}&page_number=1`;
        const response = await fetch(reviewUrl, options);
        const data = await response.json();

        // API RATE LIMIT DETECTOR FOR REVIEWS
        if (data?.message && data.message.includes("exceeded")) {
            console.warn("⚠️ RapidAPI Quota Exceeded! Serving Vice City fallback reviews.");
            globalReviews = [
                {
                    id: "mock-rev-1",
                    author: "Lance Vance",
                    score: 9.0,
                    title: "Great views, terrible security.",
                    text: "The Art Deco vibe is nice, but some guy in a Hawaiian shirt kept running through the lobby with a chainsaw.",
                    date: "Oct 1986"
                },
                {
                    id: "mock-rev-2",
                    author: "Ken Rosenberg",
                    score: 8.5,
                    title: "Good place to lay low.",
                    text: "Nice and quiet. Exactly what you need when the heat is on and you need to stay out of sight.",
                    date: "Sep 1986"
                }
            ];
        } else {
            // Normal API Data Extraction
            let reviewsArray = [];
            if (data?.data?.result && Array.isArray(data.data.result)) {
                reviewsArray = data.data.result;
            } else if (Array.isArray(data?.data)) {
                reviewsArray = data.data;
            } else {
                console.error("CRITICAL: Could not find the reviews array in the payload.");
            }

            globalReviews = reviewsArray.map((review: any) => ({
                id: review.review_id?.toString() || Math.random().toString(),
                author: review.author?.name || review.author?.nickname || "Anonymous Guest",
                score: review.average_score || review.rating || review.score || 0,
                title: review.title || "Review",
                text: review.pros || review.cons || review.text || "No detailed comments provided.",
                date: review.date || "Recent"
            }));
        }

        // Fetching real local reviews
        // happens REGARDLESS of the RapidAPI rate limit
        let localReviews: any[] = [];
        try {
            const q = query(collection(db, "reviews"), where("hotelId", "==", hotelId));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                const reviewData = doc.data();
                localReviews.push({
                    id: doc.id,
                    author: reviewData.author || "Anonymous User",
                    score: parseFloat(reviewData.score) || 0,
                    title: reviewData.title || "Review",
                    text: reviewData.text || "No text provided.",
                    date: reviewData.date || "Recent"
                });
            });
        } catch (firebaseError) {
            console.error("Firebase Pipeline Error:", firebaseError);
        }

        return { globalReviews, localReviews };
    } catch (error) {
        console.error("Failed to fetch hotel reviews:", error);
        return { globalReviews: [], localReviews: [] };
    }
}