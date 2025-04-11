'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SelectUserTypePage() {
    const router = useRouter();

    const handleUserSelection = (userType: 'user' | 'manager') => {
        router.push(`/register/${userType}`);
    };

    return (
        <main className="bg-myred min-h-[calc(100vh-60px)] flex justify-center items-center flex-col px-4 md:px-20 lg:px-80 pt-[80px] py-10">
            <div className="w-full max-w-2xl bg-white text-gray-800 py-10 px-6 md:px-20 rounded-3xl shadow-2xl">
                <div className="text-3xl font-bold text-center mt-6 mb-10">
                    Select Account Type
                </div>
                
                <div className="flex flex-col md:flex-row justify-center gap-8 mb-12">
                    {/* User Option */}
                    <div 
                        onClick={() => handleUserSelection('user')}
                        className="cursor-pointer bg-white hover:bg-slate-50 border-2 border-gray-200 rounded-2xl p-6 flex flex-col items-center transition-all hover:shadow-lg w-full md:w-1/2"
                    >
                        <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">User Account</h3>
                        <p className="text-gray-500 text-center">Create a standard user account to access services</p>
                    </div>

                    {/* Manager Option */}
                    <div 
                        onClick={() => handleUserSelection('manager')}
                        className="cursor-pointer bg-white hover:bg-slate-50 border-2 border-gray-200 rounded-2xl p-6 flex flex-col items-center transition-all hover:shadow-lg w-full md:w-1/2"
                    >
                        <div className="h-24 w-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Manager Account</h3>
                        <p className="text-gray-500 text-center">Register as a restaurant manager with administrative privileges</p>
                    </div>
                </div>

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