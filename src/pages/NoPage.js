import {Box, Typography} from "@mui/material";
import React from "react";

const NoPage = () => {
    return (
        <Box marginTop={20}>
            <Typography variant='h5' align='center'>Page at the provided address doesn't exist!</Typography>
        </Box>
    );
};
  
export default NoPage;