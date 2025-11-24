import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export const Navbar: React.FC = () => {
    const { token, role, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => {
        return location.pathname === path ? 'navbar-link active' : 'navbar-link';
    };

    if (!token) {
        return null; // Don't show navbar on login/register pages
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/labs" className="navbar-brand">
                    Lab System
                </Link>

                <div className="navbar-menu">
                    <Link to="/labs" className={isActive('/labs')}>
                        Лабораторії
                    </Link>
                    <Link to="/equipment" className={isActive('/equipment')}>
                        Обладнання
                    </Link>
                    <Link to="/reservations" className={isActive('/reservations')}>
                        Резервації
                    </Link>
                    <Link to="/labworks" className={isActive('/labworks')}>
                        Лаб. роботи
                    </Link>
                </div>

                <div className="navbar-actions">
                    {token && (
                        <>
                            <div className="navbar-user">
                                <span className="navbar-role">
                                    {role === 'ADMIN'
                                        ? 'Адміністратор'
                                        : role === 'LAB_MANAGER'
                                        ? 'Менеджер лабораторії'
                                        : 'Студент'}
                                </span>
                            </div>
                            <button className="navbar-logout" onClick={handleLogout}>
                                Вийти
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
