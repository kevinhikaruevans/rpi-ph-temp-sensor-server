import React from 'react';
import SamplePng from './sample.webp';
import { Link } from 'react-router-dom';

export default function MapPage() {
    return <div style={{textAlign: 'center'}}>
        <Link to="/devices/1">
            <img src={SamplePng} alt="Sample" style={{maxHeight: '100%', maxWidth: '100%', borderRadius: '0.5em'}} />
        </Link>
    </div>;
}