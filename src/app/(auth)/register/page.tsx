'use client'

import userRegister from "@/libs/userRegister";
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [tel, setTel] = useState('');

    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!name || !email || !password || !confirmPassword || !tel) {
            alert('Please fill in all fields');
            return; // Don't continue if any field is missing
        }

        if(password.length < 8){
            alert('Password must be at least 8 characters long');
            return; // Don't continue if password is too short
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return; // Don't continue if passwords don't match
        }
        
        try {
            await userRegister({
                userName: name,
                userEmail: email,
                userPassword: password,
                userTel: tel
            });

            alert('Registration successful!');
            router.replace('/login');
        } catch (err : any) {
            console.error('Error registering user:', err);
            alert(err.message || 'Failed to register. Please try again.');
        }
    };

    return (
        <main className="bg-myred h-[calc(100vh-60px)] flex justify-center items-center flex-col px-80 pt-[80px] overflow-auto">
            <div className="w-full bg-white text-gray-800 py-10 px-20 rounded-3xl shadow-2xl relative">
                <div className="text-3xl font-bold text-center mt-6 mb-12">
                    Create an account
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center items-center block mb-6">
                        <input onChange={(e) => setEmail(e.target.value)} type="email" id="email" placeholder="Email"
                            className="w-4/5 h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-3 placeholder:text-gray-800"/>
                    </div>
                    <div className="flex justify-center items-center block mb-6">
                        <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" placeholder="Password"
                            className="w-4/5 h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-3 placeholder:text-gray-800"/>
                    </div>
                    <div className="flex justify-center items-center block mb-6">
                        <input onChange={(e) => setConfirmPassword(e.target.value)} type="password" id="confirm-password" placeholder="Confirm Password"
                            className="w-4/5 h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-3 placeholder:text-gray-800"/>
                    </div>
                    <div className="flex justify-center items-center block mb-6">
                        <input onChange={(e) => setName(e.target.value)} type="text" id="name" placeholder="Name"
                            className="w-4/5 h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-3 placeholder:text-gray-800"/>
                    </div>
                    <div className="flex justify-center items-center block mb-6">
                        <input onChange={(e) => setTel(e.target.value)} type="tel" id="tel" placeholder="Tel"
                            className="w-4/5 h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-3 placeholder:text-gray-800"/>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <div className="relative">
                            <button type="submit" className='block bg-myred border border-white text-white text-xl font-semibold w-[150px] py-2 px-4 m-5 rounded-xl shadow-sm hover:bg-white hover:text-red-600 hover:border hover:border-red-600'>
                                Sign up
                            </button>
                        </div>
                    </div>
                </form>
                <div className="text-center text-slate-500 mb-6">
                    Already have an account?
                    <Link href="/login" className="text-slate-800 hover:underline ml-2">
                        Log in
                    </Link>
                </div>
            </div>
        </main>
    );
}
