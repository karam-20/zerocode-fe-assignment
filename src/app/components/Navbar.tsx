import React from 'react'
import { useRouter } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';


const Navbar = () => {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();

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
            <h1 className="text-lg font-semibold">MyApp</h1>
            <div className="flex gap-2">
                {/* <button
                    onClick={toggleTheme}
                    className="bg-white text-black dark:bg-gray-200 dark:text-gray-900 px-3 py-1 rounded"
                >
                    {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
                </button> */}
                <button
                    onClick={handleLogout}
                    className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
                >
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default Navbar
