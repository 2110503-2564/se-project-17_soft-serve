import { TextField } from "@mui/material";
import React from "react";
import Box from '@mui/material/Box';

export default function ReviewBox() {
    return (
        <Box 
            component = "form"
            sx= {{ '& .MuiTextField-root': { 
                m: 2, 
                width: '50ch'
                } 
            }}
            noValidate
            autoComplete="off"
        >
            <div>
                <div className="text-xl font-bold scale-150">
                    Review
                </div>
                <TextField
                    id="outlined-multiline-static"
                    // label="Multiline"
                    multiline
                    rows={4}
                    placeholder={`How was your dining experience?\nTell us what you loved (or didn’t)!`}
                />
            </div>

        </Box>
    );
}