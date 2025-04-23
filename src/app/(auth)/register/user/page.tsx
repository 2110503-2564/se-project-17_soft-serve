'use client'

import userRegister from "@/libs/userRegister";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [tel, setTel] = useState('');
    const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!name || !email || !password || !confirmPassword || !tel) {
            setMessage({ text: 'Please fill in all fields', type: 'error' });
            return;
        }

        if (password.length < 8) {
            setMessage({ text: 'Password must be at least 8 characters long', type: 'error' });
            return;
        }

        if (password !== confirmPassword) {
            setMessage({ text: 'Passwords do not match', type: 'error' });
            return;
        }

        try {
            await userRegister({
                userName: name,
                userEmail: email,
                userPassword: password,
                userTel: tel,
            });

            setMessage({ text: 'Registration successful!', type: 'success' });
            router.replace('/login');
        } catch (err: any) {
            console.error('Error registering user:', err);
            setMessage({ text: err.message || 'Failed to register. Please try again.', type: 'error' });
        }
    };

    return (
        <main className="bg-myred min-h-[calc(100vh-60px)] flex justify-center items-center flex-col md:px-20 lg:px-80 py-10 overflow-auto">
            <div className="w-full bg-white text-gray-800 py-8 px-20 rounded-3xl shadow-2xl relative">
                <div className="text-3xl font-bold text-center mt-6 mb-10">
                    Create an account
                </div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email" className="block text-lg font-semibold mb-2 pl-20">
                        Email
                    </label>
                    <div className="flex justify-center items-center block mb-4">
                        <input onChange={(e) => setEmail(e.target.value)} type="email" id="email" placeholder="Email"
                            className="w-4/5 h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-3 placeholder:text-gray-800" />
                    </div>
                    <label htmlFor="password" className="block text-lg font-semibold mb-2 pl-20">
                        Password
                    </label>
                    <div className="flex justify-center items-center block mb-4">
                        <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" placeholder="Password"
                            className="w-4/5 h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-3 placeholder:text-gray-800" />
                    </div>
                    <label htmlFor="confirm-password" className="block text-lg font-semibold mb-2 pl-20">
                        Confirm Password
                    </label>
                    <div className="flex justify-center items-center block mb-4">
                        <input onChange={(e) => setConfirmPassword(e.target.value)} type="password" id="confirm-password" placeholder="Confirm Password"
                            className="w-4/5 h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-3 placeholder:text-gray-800" />
                    </div>
                    <label htmlFor="name" className="block text-lg font-semibold mb-2 pl-20">
                        Name
                    </label>
                    <div className="flex justify-center items-center block mb-4">
                        <input onChange={(e) => setName(e.target.value)} type="text" id="name" placeholder="Name"
                            className="w-4/5 h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-3 placeholder:text-gray-800" />
                    </div>
                    <label htmlFor="tel" className="block text-lg font-semibold mb-2 pl-20">
                        Phone Number
                    </label>
                    <div className="flex justify-center items-center block mb-4">
                        <input onChange={(e) => setTel(e.target.value)} type="tel" id="tel" placeholder="Phone Number"
                            className="w-4/5 h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-3 placeholder:text-gray-800" />
                    </div>

                    {message && (
                        <div className={`text-center w-4/5 mx-auto mb-4 px-4 rounded-xl ${
                            message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="flex flex-col justify-center items-center">
                        <div className="relative">
                            <button type="submit" className='block bg-myred border border-white text-white text-xl font-semibold w-[150px] py-2 px-4 m-5 rounded-xl shadow-sm hover:bg-white hover:text-red-600 hover:border hover:border-red-600'>
                                Sign up
                            </button>
                        </div>
                    </div>
                </form>
                <div className="text-center text-slate-500 mb-2">
                    Already have an account?
                    <Link href="/login" className="text-slate-800 hover:underline ml-2">
                        Log in
                    </Link>
                </div>
            </div>
        </main>
    );
}
