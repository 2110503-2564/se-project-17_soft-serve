import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getUserProfile from "@/libs/getUserProfile";
import { User } from "../../../../../interfaces";

export default async function ChangePasswordPage() {
    const session = await getServerSession(authOptions);
            
    if(!session || !session.user.token) return null;

    const profile = await getUserProfile(session.user.token);
    const user : User = profile.data;

    return (
        <main className="bg-myred h-[calc(100vh-60px)] justify-center items-center flex flex-col px-80">
            <div className="w-full bg-white text-gray-800 py-10 px-20 rounded-3xl shadow-2xl relative">
                <div className="text-3xl font-bold text-center mt-6 mb-12">
                    Change Password
                </div>
                <div className="flex justify-center items-center block mb-6">
                    <input 
                        type="email" 
                        id="email" 
                        value={user.email} 
                        placeholder="Email"
                        readOnly
                        className="w-4/5 h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-3 placeholder:text-gray-800"
                    />
                </div>
                <div className="flex justify-center items-center block mb-6">
                    <input type="password" id="oldPassword" placeholder="Old Password"
                        className="w-4/5 h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-3 placeholder:text-gray-800"/>
                </div>
                <div className="flex justify-center items-center block mb-6">
                    <input type="password" id="newPassword" placeholder="New Password"
                        className="w-4/5 h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-3 placeholder:text-gray-800"/>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <div className="relative">
                        <button className='block bg-myred border border-white text-white text-xl font-semibold py-2 px-8 m-5 rounded-xl shadow-sm hover:bg-white hover:text-red-600 hover:border hover:border-red-600'>
                            Change Password
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}