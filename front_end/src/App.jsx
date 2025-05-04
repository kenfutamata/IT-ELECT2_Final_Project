import { Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import LandingPage from './landing_page/landing_page.jsx';

export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<LandingPage />} />
            </Routes>
        </>
    )
}