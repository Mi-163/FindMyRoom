export default function SearchHero() {
    return (
        <section className="flex flex-col items-center justify-center min-h-[60vh] bg-blue-50 px-4">

            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-slate-800">
                Find Your Perfect Stay
            </h1>

            <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-4xl">
                {/* Added md:items-end so the button aligns with the bottom of the inputs */}
                <form className="flex flex-col md:flex-row gap-4 md:items-end">

                    {/* Location */}
                    <div className="flex-1 flex flex-col">
                        <label className="text-sm font-semibold text-gray-600 mb-1 ml-1">Location</label>
                        <input
                            type="text"
                            placeholder="Enter city or hotel"
                            className="px-4 py-2 border border-gray-300 bg-white text-gray-800 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Check-in */}
                    <div className="flex-1 flex flex-col">
                        <label className="text-sm font-semibold text-gray-600 mb-1 ml-1">Check-in</label>
                        <input
                            type="date"
                            className="px-4 py-2 border border-gray-300 bg-white text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Check-out */}
                    <div className="flex-1 flex flex-col">
                        <label className="text-sm font-semibold text-gray-600 mb-1 ml-1">Check-out</label>
                        <input
                            type="date"
                            className="px-4 py-2 border border-gray-300 bg-white text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Search Button */}
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md"
                    >
                        Search
                    </button>

                </form>
            </div>
        </section>
    );
}