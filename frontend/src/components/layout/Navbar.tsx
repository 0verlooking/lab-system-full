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
        return null;
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    Lab System
                </Link>

                <div className="navbar-menu">
                    <Link to="/" className={isActive('/')}>
                        Головна
                    </Link>
                    <Link to="/repository" className={isActive('/repository')}>
                        Репозиторій
                    </Link>
                    <Link to="/equipment" className={isActive('/equipment')}>
                        Каталог
                    </Link>
                    <Link to="/labs" className={isActive('/labs')}>
                        Лабораторії
                    </Link>
                </div>

                <div className="navbar-actions">
                    {token && (
                        <>
                            <div className="navbar-user">
                                <span className="navbar-role">
                                    {role === 'ADMIN'
                                        ? 'Адміністратор'
                                        : role === 'CURATOR'
                                        ? 'Куратор'
                                        : role === 'LABORANT'
                                        ? 'Лаборант'
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
