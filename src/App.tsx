import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                {/* Placeholder redirect for other routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
