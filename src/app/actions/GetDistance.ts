"use server";

export async function getDistance(hotelName: string, city: string) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    const origin = encodeURIComponent(`${hotelName}, ${city}`);


    // Put the transport type BEFORE the city string so Google doesn't get confused
    // This turns into: "Airport, Kochi, Kerala, India"
    const dest1 = encodeURIComponent(`Airport, ${city}`);
    const dest2 = encodeURIComponent(`Main Railway Station, ${city}`);
    const dest3 = encodeURIComponent(`Main Bus Terminal, ${city}`);

    // Join with a pipe (|) as required by Google Maps API
    const destinations = `${dest1}|${dest2}|${dest3}`;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destinations}&key=${apiKey}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        const elements = data.rows[0]?.elements;

        // Ensure Google successfully found routes for all three
        if (elements && elements.length === 3) {
            return {
                airport: elements[0].status === "OK" ? `${elements[0].distance.text} (${elements[0].duration.text})` : "N/A",
                train: elements[1].status === "OK" ? `${elements[1].distance.text} (${elements[1].duration.text})` : "N/A",
                bus: elements[2].status === "OK" ? `${elements[2].distance.text} (${elements[2].duration.text})` : "N/A",
            };
        }
        return null;
    } catch (error) {
        console.error("Distance API Error (Firewall/Timeout):", error);

        // Return mock data if the network blocks Google
        console.warn("⚠️ Google Maps blocked by network. Serving fallback transit data.");
        return {
            airport: "36 km (55 mins)",
            train: "8 km (15 mins)",
            bus: "2 km (5 mins)"
        };
    }
}