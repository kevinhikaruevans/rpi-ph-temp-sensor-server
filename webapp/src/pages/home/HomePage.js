import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

export default function HomePage() {
    return <>
        <Button variant="contained" color="primary" component={Link} to="/devices">Devices</Button>
        &nbsp;
        <Button variant="outlined" color="primary" component={Link} to="/map">Map</Button>
    </>;
}