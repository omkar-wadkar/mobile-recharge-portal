import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../Services/authService';

const ProtectedRoute = ({ children, roles }) => {
    const user = authService.getCurrentUser();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
