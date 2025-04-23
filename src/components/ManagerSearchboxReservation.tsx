'use client';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

export default function ManagerSearchBox({ token }: { token: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    useEffect(() => {
        const dateParam = searchParams.get('date') || "";
        const timeParam = searchParams.get('time') || "";
        setSelectedDate(dateParam);
        setSelectedTime(timeParam);
    }, [searchParams]);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (selectedDate) params.set('date', selectedDate);
        if (selectedTime) params.set('time', selectedTime);
        router.push(`/reservations/manager?${params.toString()}`);
    };

    const handleClearFilters = () => {
        setSelectedDate("");
        setSelectedTime("");
        router.push('/reservations/manager');
    };

    return (
        <main className="flex flex-center p-5 w-[90vw] mt-10 h-fit rounded-lg shadow-lg bg-white mx-auto px-6 py-6">
            <Stack spacing={2} sx={{ width: "100%" }}>
                <div className="flex items-center mb-2">
                    <label className="w-40 mr-5 font-semibold text-gray-800">
                        Reservation Date
                    </label>
                    <TextField
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        sx={{ flex: 1 }}
                        inputProps={{ max: "9999-12-31" }}
                    />
                </div>

                <div className="flex items-center mb-2">
                    <label className="w-40 mr-5 font-semibold text-gray-800">
                        Reservation Time
                    </label>
                    <TextField
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        sx={{ flex: 1 }}
                    />
                </div>

                <div className="flex gap-4 mt-2">
                    <button
                        onClick={handleSearch}
                        className="bg-[#D40303] text-white font-bold py-2 px-4 rounded shadow-lg hover:bg-red-700"
                    >
                        Search
                    </button>
                    <button
                        onClick={handleClearFilters}
                        className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded shadow-lg hover:bg-gray-300"
                    >
                        Clear
                    </button>
                </div>
            </Stack>
        </main>
    );
}
