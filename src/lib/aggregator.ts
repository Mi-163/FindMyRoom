import { FindMyRoomProperty } from "@/types/hotel";

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

        // Extract the unique ID from the first result
        const destId = destData?.data?.[0]?.dest_id;
        const searchType = destData?.data?.[0]?.search_type || "CITY";

        if (!destId) {
            console.error("Could not find a destination ID for this location.");
            return [];
        }


        const hotelsUrl = `https://${RAPID_API_HOST}/api/v1/hotels/searchHotels?dest_id=${destId}&search_type=${searchType}&arrival_date=${checkin}&departure_date=${checkout}&adults=2&room_qty=1&page_number=1&currency_code=${userCurrency}`;

        const hotelsResponse = await fetch(hotelsUrl, options);
        const hotelsData = await hotelsResponse.json();

        if (!hotelsData || !hotelsData.data || !hotelsData.data.hotels) {
            return [];
        }

        const normalizedData: FindMyRoomProperty[] = hotelsData.data.hotels.map((item: any) => ({
            id: item.property.id?.toString() || Math.random().toString(),
            name: item.property.name,
            price: Math.round(item.property.priceBreakdown?.grossPrice?.value || 0),
            currency: item.property.priceBreakdown?.grossPrice?.currency || userCurrency,
            rating: item.property.reviewScore || 0,
            reviewCount: item.property.reviewCount || 0,
            imageUrl: item.property.photoUrls?.[0] || "",
            isCoupleFriendly: true,
            sourcePlatform: "Booking.com"
        }));


        return normalizedData;
    } catch (error) {
        console.error("Aggregator Engine Error:", error);
        return [];
    }
}

export async function fetchHotelReviews(hotelId: string) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY as string,
            'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
        }
    };

    try {
        const reviewUrl = `https://booking-com15.p.rapidapi.com/api/v1/hotels/getHotelReviews?hotel_id=${hotelId}&page_number=1`;
        const response = await fetch(reviewUrl, options);
        const data = await response.json();

        // 🛡️ SAFETY NET: Target the exact 'result' array we found in the payload
        let reviewsArray = [];
        if (data?.data?.result && Array.isArray(data.data.result)) {
            reviewsArray = data.data.result;
        } else if (Array.isArray(data?.data)) {
            reviewsArray = data.data;
        } else {
            console.error("CRITICAL: Could not find the reviews array in the payload.");
        }

        // Mapping the extracted array into our FindMyRoom format
        const globalReviews = reviewsArray.map((review: any) => ({
            id: review.review_id?.toString() || Math.random().toString(),
            author: review.author?.name || review.author?.nickname || "Anonymous Guest",
            score: review.average_score || review.rating || review.score || 0,
            title: review.title || "Review",
            // Booking often splits text into pros and cons
            text: review.pros || review.cons || review.text || "No detailed comments provided.",
            date: review.date || "Recent"
        }));

        // Mocking the localized FindMyRoom reviews s
        const localReviews = [
            {
                id: "local-1",
                author: "Verified FindMyRoom User",
                score: 9.0,
                title: "Great location for students",
                text: "Stayed here during my placements. The Wi-Fi is incredibly fast and there are great food spots nearby.",
                date: "2 days ago"
            }
        ];

        return { globalReviews, localReviews };
    } catch (error) {
        console.error("Failed to fetch hotel reviews:", error);
        return { globalReviews: [], localReviews: [] };
    }
}