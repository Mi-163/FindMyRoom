# FindMyRoom | Global Travel Aggregator

A full-stack, AI-integrated travel platform engineered to provide comprehensive hotel search, deterministic parity pricing analysis, and verified local reviews. Built with Next.js and Tailwind CSS, this platform empowers users with actionable insights for global travel planning.

## Core Features

* **Global Hotel Search & Aggregation:** Search for hotels by city and dates.
* **Parity Rate Generator:** A deterministic algorithm that estimates expected prices across major booking platforms (MakeMyTrip, Agoda, Expedia) based on a base rate, helping users identify potential savings.
* **Reddit Vibe Check API:** An integrated feature that scrapes Reddit discussions to provide real, unfiltered community sentiment and "vibe checks" about specific hotels or neighborhoods.
* **AI-Powered Insights (ChatWidget):** An integrated AI chatbot (powered by Google Gemini) provides real-time, context-aware assistance, acting as a personal travel guide directly within the application.
* **Verified Local Ratings Engine:** Access a dual-review system comparing standard global API reviews (e.g., Booking.com) with localized, authenticated user ratings (FindMyRoom Data).
* **Couple-Friendly Verification:** Quick visual indicators for properties that are welcoming to couples.
* **Interactive Video Galleries:** Integrated YouTube vlogs and property tours for a comprehensive visual understanding of the destination.
* **Distance Calculators:** Tools to help users understand proximity to key landmarks or city centers.

## Tech Stack

* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS (v4)
* **Icons:** Lucide React & React Icons (FontAwesome)
* **AI Integration:** Google Gemini API
* **Fonts:** Geist & Geist Mono (via next/font)
* **Language:** TypeScript

## Getting Started

### Prerequisites

* Node.js (v18 or higher recommended)
* npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Mi-163/findmyroom.git](https://github.com/Mi-163/findmyroom.git)
    cd findmyroom
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add necessary keys.
    ```env
    NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
    # Add other necessary keys for Firebase, etc., if applicable
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the application:**
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is optimized for deployment on Vercel.

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  Configure your environment variables in the Vercel dashboard.
4.  Deploy.

## Creator

Built with ❤️ by **Midhun Murali**

* [GitHub](https://github.com/Mi-163)
* [LinkedIn](https://linkedin.com/in/midhun-p-m-96551a291)
* [Instagram](https://www.instagram.com/mpm_163?igsh=MjY4cndwOGQ3eXg2)


---
© 2026 FindMyRoom. All rights reserved.
