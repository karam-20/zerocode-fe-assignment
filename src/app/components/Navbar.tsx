import React from 'react'
import { useRouter } from 'next/navigation';


const Navbar = () => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch("/api/logout", {
                method: "POST",
            });

            router.push("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };
    return (

        <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
            <h1 className="text-lg font-semibold">Chat Bot</h1>
            <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition"
            >
                Logout
            </button>
        </nav>
    )
}

export default Navbar
