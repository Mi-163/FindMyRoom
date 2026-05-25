import LoginButton from "./LoginButton";

export default function Navbar() {
    return (
        <nav className="flex justify-between items-center p-4 bg-white shadow-sm">

            <div className="text-xl font-bold text-blue-600">
                FindMyRoom
            </div>


            <LoginButton />

        </nav>
    );
}