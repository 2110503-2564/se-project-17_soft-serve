'use client';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { ChangeEvent, useState } from 'react';

interface RateProps {
    ratingName: string;
    onCompare: (ratingName: string, rating: number | null) => void;
    initialRating: number | null;
}

export default function ReviewRating({ ratingName, onCompare, initialRating = null }: RateProps) {
    const [value, setValue] = useState<number | null>(initialRating);

    const handleRatingChange = (event: ChangeEvent<{}>, newValue: number | null) => {
        setValue(newValue);
        //if (newValue !== null) {
            onCompare(ratingName, newValue);
        //}
    };

    return (
        <Box sx={{ '& > legend': { mt: 2 } }}>
            <Rating
                id={`${ratingName} Rating`}
                name={`${ratingName} Rating`}
                value={value}
                onChange={handleRatingChange}
                sx={{
                    fontSize: '2rem',
                    color: '#FFDD00', // Change default color
                    '& .MuiRating-iconFilled': {
                        color: '#FFDD00', // Filled star color
                    },
                    '& .MuiRating-iconEmpty': {
                        color: '#b0b0b0', // Empty star color (optional)
                    },
                }}
            />
        </Box>
    );
}
