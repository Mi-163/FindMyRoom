

//FindMyRoom standard. 

export interface FindMyRoomProperty {
    id: string;
    name: string;
    price: number;
    currency: string;
    rating: number;
    reviewCount: number;
    imageUrl: string;
    isCoupleFriendly: boolean;
    sourcePlatform: string; // e.g., "Booking.com" or "Agoda"
}