'use client';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

export default function OverallRating({ value }: { value : number}) {
    return (
        <Box sx={{ '& > legend': { mt: 2 } }}>
            <Rating
                value={value}
                precision={0.05}  // Supports half-star ratings
                readOnly
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
