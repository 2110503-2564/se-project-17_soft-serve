'use client'
import React, { useState, ChangeEvent } from 'react';

export default function CreateNotification() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetAudience, setTargetAudience] = useState<string | null>(null);

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTargetAudience(event.target.value === targetAudience ? null : event.target.value);
    };

    const handleClick = () => {
        console.log("Title", title);
        console.log("Message", message);
        console.log("Target", targetAudience);
    };

    return (
        <main className="bg-myred h-[calc(100vh-60px)] flex justify-center items-center flex-col md:px-20 lg:px-80 overflow-auto">
            <div className="w-full bg-white text-gray-800 py-8 px-20 rounded-3xl shadow-2xl relative">
                <div className="text-3xl font-bold text-center mt-6 mb-8">
                    Create a Notification
                </div>
                <form>
                    {/*Title*/}
                    <label htmlFor="title" className="block text-gray-800 text-lg font-semibold mb-2 pl-20">
                        Title
                    </label>
                    <div className="flex justify-center items-center block mb-6">
                        <input onChange={(e) => setTitle(e.target.value)} type="text" id="title" placeholder="title"
                        className="w-4/5 h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-3 placeholder:text-gray-800"/>
                    </div>
                    {/*Message*/}
                    <label htmlFor="message" className="block text-gray-800 text-lg font-semibold mb-2 pl-20">
                        Message
                    </label>
                    <div className="flex justify-center items-center block mb-6">
                        <input onChange={(e) => setMessage(e.target.value)} type="text" id="message" placeholder="message"
                            className="w-4/5 h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-3 placeholder:text-gray-800"/>
                    </div>
                    {/*Target Audience*/}
                    <label htmlFor="arget" className="block text-gray-800 text-lg font-semibold pl-20">
                        Target Audience
                    </label>
                    <div className="flex justify-center items-center p-4 rounded-xl space-x-4">
                        <div className="flex items-center">
                            <input id="customer" type="checkbox" value="customer" name="target"
                                className="w-5 h-5 border-gray-300 rounded-xl" style={{accentColor:'red'}}
                                checked={targetAudience === 'customer'}
                                onChange={handleCheckboxChange}/>
                            <label htmlFor="customer" className="ml-2 text-lg text-gray-800">
                                customers
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input id="manager" type="checkbox" value="manager" name="target"
                                className="w-5 h-5 ml-12 border-gray-300 rounded-xl" style={{accentColor:'red'}}
                                checked={targetAudience === 'manager'}
                                onChange={handleCheckboxChange}/>
                            <label htmlFor="manager" className="ml-2 text-lg text-gray-800">
                                restaurant managers
                            </label>
                        </div>
                    </div>
                    {/*Submit button*/}
                    <div className="flex flex-col justify-center items-center">
                        <div className="relative">
                            <button onClick={handleClick} type="button"
                                className='block bg-myred border border-white text-white text-xl font-semibold w-[150px] py-2 px-4 m-5 rounded-xl shadow-sm hover:bg-white hover:text-red-600 hover:border hover:border-red-600'>
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
                <div className="text-center text-slate-500 mb-4">
                    Please review your input carefully before sending the notification.
                </div>
            </div>
        </main>
    );
}