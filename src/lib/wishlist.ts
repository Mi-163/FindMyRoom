import { db } from "./firebase";
import { doc, setDoc, deleteDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { FindMyRoomProperty } from "@/types/hotel";

export async function checkIsSaved(userId: string, hotelId: string) {
    if (!userId) return false;
    const docRef = doc(db, "users", userId, "wishlist", hotelId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
}

export async function toggleWishlist(userId: string, hotel: FindMyRoomProperty) {
    if (!userId) throw new Error("Must be logged in to save");

    const docRef = doc(db, "users", userId, "wishlist", hotel.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        await deleteDoc(docRef);
        return false;
    } else {
        await setDoc(docRef, {
            ...hotel,
            savedAt: new Date().toISOString()
        });
        return true;
    }
}

export async function getUserWishlist(userId: string) {
    const wishlistRef = collection(db, "users", userId, "wishlist");
    const snapshot = await getDocs(wishlistRef);
    return snapshot.docs.map(doc => doc.data() as FindMyRoomProperty);
}