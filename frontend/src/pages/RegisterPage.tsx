import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Паролі не співпадають');
            return;
        }

        if (password.length < 6) {
            setError('Пароль має містити мінімум 6 символів');
            return;
        }

        setLoading(true);

        try {
            const response = await authApi.register({
                username,
                password,
            });
            login(response.token, response.role);
            navigate('/labs');
        } catch (err: any) {
            setError(err.message || 'Помилка реєстрації. Спробуйте інше імʼя користувача.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
                <h1 className="card-header" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    Реєстрація
                </h1>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label className="form-label">Імʼя користувача</label>
                        <input
                            type="text"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Введіть імʼя користувача (мінімум 3 символи)"
                            minLength={3}
                            maxLength={50}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Пароль</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введіть пароль (мінімум 6 символів)"
                            minLength={6}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Підтвердження паролю</label>
                        <input
                            type="password"
                            className="form-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Підтвердіть пароль"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Завантаження...' : 'Зареєструватися'}
                    </button>
                </form>

                <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    Вже є обліковий запис?{' '}
                    <Link to="/login" style={{ fontWeight: 600 }}>
                        Увійти
                    </Link>
                </div>
            </div>
        </div>
    );
};
