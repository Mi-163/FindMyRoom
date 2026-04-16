export default function Navbar() {
    return (
        <nav className="flex justify-between items-center p-4 bg-white shadow-sm">

            <div className="text-xl font-bold text-blue-600">
                FindMyRoom
            </div>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Sign In
            </button>

        </nav>
    );
}