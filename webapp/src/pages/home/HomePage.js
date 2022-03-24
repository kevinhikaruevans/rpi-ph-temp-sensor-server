import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { Divider, Typography } from '@mui/material';

export default function HomePage() {
    return <>
        <Typography variant="h3">AquaSmart</Typography>
        <Typography variant="subtitle1">Protecting water for future generations.</Typography>
        <Divider sx={{my: 2}}/>
        <Button variant="contained" color="primary" component={Link} to="/devices">Devices</Button>
        &nbsp;
        <Button variant="outlined" color="primary" component={Link} to="/map">Map</Button>
    </>;
}