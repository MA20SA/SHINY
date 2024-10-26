import React from 'react';
import CircularProgress from "@mui/material/CircularProgress";

function LoadingDialog({ loading }) {
    if (!loading) return null;

    return (
        <div>
           <CircularProgress color="primary" />
        </div>
    );
}



export default LoadingDialog;