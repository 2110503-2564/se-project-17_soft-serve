'use client'

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        if (!email || !password) {
            alert('Please fill in all fields');
            return; // Don't continue if any field is missing
        }
    
        try {
            const response = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });
    
            // console.log('Login response:', response);
    
            if (response?.error) {
                alert('Error logging in, please try again.');
                return;
            }
    
            alert('Login successful!');
            router.replace('/');
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Error logging in, please try again.');
        }
    };

    return (
        <main className="bg-myred h-[calc(100vh-60px)] flex justify-center items-center flex-col px-80">
            <div className="w-full bg-white text-gray-800 py-10 px-20 rounded-3xl shadow-2xl relative">
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
                    <div className="flex justify-center items-center block mb-6">
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="Password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-4/5 h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-3 placeholder:text-gray-800"
                        />
                    </div>
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
                <div className="flex flex-col justify-center items-center mb-2">
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
