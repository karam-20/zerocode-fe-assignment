'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/useLogin';

export default function LoginPage() {
    const router = useRouter();
    const loginMutation = useLogin();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate(
            { email, password },
            {
                onSuccess: () => {
                    router.push('/');
                },

                onError: (error) => {
                    console.error("Login error:", error.message);
                },
            }
        );
    };

    return (
        <div className="flex flex-col bg-black items-center justify-center min-h-screen px-4">
            <h1 className="text-2xl font-bold mb-4 text-white">Login</h1>
            <form
                onSubmit={handleLogin}
                className="bg-white p-6 rounded-xl shadow-md w-full max-w-md"
            >
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 mb-4 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 mb-4 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    disabled={loginMutation.isPending}
                >
                    {loginMutation.isPending ? 'Logging in...' : 'Login'}
                </button>

                {loginMutation.isError && (
                    <p className="text-red-500 mt-2">
                        {(loginMutation.error as Error).message}
                    </p>
                )}
            </form>
        </div>
    );
}
