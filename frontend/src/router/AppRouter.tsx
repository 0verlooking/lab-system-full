import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import RepositoryPage from '../pages/RepositoryPage';
import ProjectDetailPage from '../pages/ProjectDetailPage';
import { LabsPage } from '../pages/LabsPage';
import { EquipmentPage } from '../pages/EquipmentPage';
import { ReservationsPage } from '../pages/ReservationsPage';
import { LabWorksPage } from '../pages/LabWorksPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PrivateRoute } from '../components/routing/PrivateRoute';

export const AppRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <HomePage />
                    </PrivateRoute>
                }
            />

            <Route
                path="/repository"
                element={
                    <PrivateRoute>
                        <RepositoryPage />
                    </PrivateRoute>
                }
            />

            <Route
                path="/repository/:id"
                element={
                    <PrivateRoute>
                        <ProjectDetailPage />
                    </PrivateRoute>
                }
            />

            <Route
                path="/labs"
                element={
                    <PrivateRoute>
                        <LabsPage />
                    </PrivateRoute>
                }
            />

            <Route
                path="/equipment"
                element={
                    <PrivateRoute>
                        <EquipmentPage />
                    </PrivateRoute>
                }
            />

            <Route
                path="/reservations"
                element={
                    <PrivateRoute>
                        <ReservationsPage />
                    </PrivateRoute>
                }
            />

            <Route
                path="/labworks"
                element={
                    <PrivateRoute>
                        <LabWorksPage />
                    </PrivateRoute>
                }
            />

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};
