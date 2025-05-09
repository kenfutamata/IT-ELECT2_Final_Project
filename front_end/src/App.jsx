import React from 'react'; 
import { Route, Routes } from 'react-router-dom'; 

// Import your page components
import Login from './login.jsx'; // Adjusted path
import Employee from './employee.jsx'; // Adjusted path


export default function App() {
    return (
        <> 
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/employee" element={<Employee />} />
            </Routes>
        </>
    );
}