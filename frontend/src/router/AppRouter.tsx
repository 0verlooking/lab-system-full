import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import RepositoryPage from '../pages/RepositoryPage';
import ProjectDetailPage from '../pages/ProjectDetailPage';
import ProjectFormPage from '../pages/ProjectFormPage';
import { LabsPage } from '../pages/LabsPage';
import EquipmentCatalogPage from '../pages/EquipmentCatalogPage';
import CartPage from '../pages/CartPage';
import DocumentPage from '../pages/DocumentPage';
import AdminPanelPage from '../pages/AdminPanelPage';
import ProfilePage from '../pages/ProfilePage';
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
                path="/repository/new"
                element={
                    <PrivateRoute>
                        <ProjectFormPage />
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
                path="/repository/:id/edit"
                element={
                    <PrivateRoute>
                        <ProjectFormPage />
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
                        <EquipmentCatalogPage />
                    </PrivateRoute>
                }
            />

            <Route
                path="/cart"
                element={
                    <PrivateRoute>
                        <CartPage />
                    </PrivateRoute>
                }
            />

            <Route
                path="/document/:projectId?"
                element={
                    <PrivateRoute>
                        <DocumentPage />
                    </PrivateRoute>
                }
            />

            <Route
                path="/admin"
                element={
                    <PrivateRoute>
                        <AdminPanelPage />
                    </PrivateRoute>
                }
            />

            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <ProfilePage />
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
