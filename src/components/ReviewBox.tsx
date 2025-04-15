'use client'
import { TextField, Button } from "@mui/material";
import React, { useState } from "react";
import Box from '@mui/material/Box';
import { useSession } from "next-auth/react";
import addReview from "@/libs/addReview";
import { useRouter } from "next/navigation";

export default function ReviewBox({
  value,
  onChange,
  restaurantId,
  rating,
}: {
  value: string;
  onChange: (val: string) => void;
  restaurantId: string;
  rating: number;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async () => {
    if (rating <= 0 || !value.trim()) {
      alert("Please provide a rating and a comment.");
      return;
    }
    if(!session || !session.user || !session.user.token) return null;
    const token = session.user.token;
    try {
      const res = await addReview({
        restaurantId,
        rating,
        review: value,
        token,
      });

      alert(`Review submitted successfully!\nOverall Rating: ${res.data.rating}/5`);
      router.push("/");
    } catch (error: any) {
      alert(`Error submitting review: ${error.message}`);
    }
  };

  return (
    <Box
      component="form"
      sx={{ '& .MuiTextField-root': { m: 2, width: '50ch' } }}
      noValidate
      autoComplete="off"
    >
      <div>
        <div className="text-[26px] font-bold">
          Review
        </div>
        <TextField
          id="outlined-multiline-static"
          multiline
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`How was your dining experience?\nTell us what you loved (or didn’t)!`}
          className="w-full px-2 py-2 bg-white border border-gray-300 rounded-xl focus:border-red-500 sm:text-sm"
        />
      </div>
    </Box>
  );
}