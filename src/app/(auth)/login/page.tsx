'use client'

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!email || !password) {
            setMessage({ text: 'Please fill in all fields', type: 'error' });
            return;
        }

        try {
            const response = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (response?.error) {
                if (response.error === 'not verified') {
                    setMessage({ text: 'You are yet to be verified. Please wait for admin.', type: 'error' });
                    return;
                }
                if (response.error === 'Invalid credentials') {
                    setMessage({ text: 'Login failed. Please make sure your email and password are correct.', type: 'error' });
                    return;
                }
                setMessage({ text: 'Error logging in, please try again.(failed to fetch)', type: 'error' });
                return;
            }

            setMessage({ text: 'Login successful!', type: 'success' });
            router.replace('/');
            router.refresh();
        } catch (error) {
            console.error('Error logging in:', error);
            setMessage({ text: 'Error logging in, please try again.', type: 'error' });
        }
    };

    return (
        <main className="bg-myred min-h-[calc(100vh-60px)] flex justify-center items-center flex-col md:px-20 lg:px-80">
            <div className="w-full bg-white text-gray-800 py-8 px-20 rounded-3xl shadow-2xl relative">
                <div className="text-3xl font-bold text-center mt-6 mb-8">
                    Login to your account
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center items-center block mb-6">
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="Email"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-4/5 h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-3 placeholder:text-gray-800"
                        />
                    </div>
                    <div className="flex justify-center items-center block mb-4">
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="Password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-4/5 h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-3 placeholder:text-gray-800"
                        />
                    </div>
                    {message && (
                        <div className={`text-center w-4/5 mx-auto mb-4 py-2 px-4 rounded-xl ${
                            message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                            {message.text}
                        </div>
                    )}
                    <div className="flex flex-col justify-center items-center">
                        <button 
                            type="submit"
                            className="block bg-myred border border-white text-white text-xl font-semibold w-[150px] py-2 px-4 m-5 rounded-xl shadow-sm hover:bg-white hover:text-red-600 hover:border hover:border-red-600"
                        >
                            Login
                        </button>
                    </div>
                </form>
                <div className="text-center mb-4 relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-400"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-4 text-gray-500">Or</span>
                    </div>
                </div>
                <div className="text-center text-slate-500 mb-2">
                    Need an account?
                </div>
                <div className="text-3xl font-bold text-center mb-2">
                    Create an account
                </div>
                <div className="flex flex-col justify-center items-center">
                    <Link href="/register">
                        <button className="block bg-myred border border-white text-white text-xl font-semibold w-[150px] py-2 px-4 m-5 rounded-xl shadow-sm hover:bg-white hover:text-red-600 hover:border hover:border-red-600">
                            Sign up
                        </button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
