'use client';
import { useState } from 'react';

export default function RestaurantManagerNotificationTogglePanel() {
    const [selectedTab, setSelectedTab] = useState<'sent' | 'received'>('sent');

    const handleTabClick = (tab: 'sent' | 'received') => {
        setSelectedTab(tab);
    };

    return (
        <div className="relative flex justify-center mt-10 w-full">
            {/* Main Box with Shadow */}
            <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl p-6 pl-12">
                {/* Conditional Content */}
                <div>
                    {selectedTab === 'sent' ? (
                        <div>
                            {/* Replace with actual sent notifications */}
                            <p className="text-gray-700">Showing sent notifications...</p>
                        </div>
                    ) : (
                        <div>
                            {/* Replace with actual received notifications */}
                            <p className="text-gray-700">Showing received notifications...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Tab Buttons Box outside the main box */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex flex-col bg-white shadow-xl border border-gray-300 rounded-lg">
                <button
                    onClick={() => handleTabClick('sent')}
                    className={`px-6 py-3 rounded-t-lg text-sm font-semibold text-left w-32 ${
                        selectedTab === 'sent'
                            ? 'bg-myred text-white'
                            : 'text-gray-800 hover:bg-gray-100'
                    }`}
                >
                    Sent
                </button>
                <button
                    onClick={() => handleTabClick('received')}
                    className={`px-6 py-3 rounded-b-lg text-sm font-semibold text-left w-32 ${
                        selectedTab === 'received'
                            ? 'bg-myred text-white'
                            : 'text-gray-800 hover:bg-gray-100'
                    }`}
                >
                    Received
                </button>
            </div>
        </div>
    );
}
