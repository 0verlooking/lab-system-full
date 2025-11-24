import React, { useEffect, useState } from 'react';
import { labsApi } from '../api/labsApi';
import type { Lab } from '../types/Lab';
import { useAuth } from '../context/AuthContext';

export const LabsPage: React.FC = () => {
    const { role } = useAuth();
    const [labs, setLabs] = useState<Lab[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [capacity, setCapacity] = useState('');
    const [description, setDescription] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    const loadLabs = async () => {
        try {
            setLoading(true);
            const data = await labsApi.getAll();
            setLabs(data);
            setError('');
        } catch (err: any) {
            setError('Помилка завантаження лабораторій');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLabs();
    }, []);

    const resetForm = () => {
        setName('');
        setLocation('');
        setCapacity('');
        setDescription('');
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const labData = {
                name,
                location,
                capacity: parseInt(capacity),
                description,
            };

            if (editingId) {
                await labsApi.update(editingId, labData);
            } else {
                await labsApi.create(labData);
            }

            await loadLabs();
            resetForm();
        } catch (err: any) {
            setError(err.message || 'Помилка збереження лабораторії');
        }
    };

    const handleEdit = (lab: Lab) => {
        setName(lab.name);
        setLocation(lab.location);
        setCapacity(lab.capacity.toString());
        setDescription(lab.description || '');
        setEditingId(lab.id);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Ви впевнені, що хочете видалити цю лабораторію?')) {
            return;
        }

        try {
            await labsApi.delete(id);
            await loadLabs();
        } catch (err: any) {
            setError(err.message || 'Помилка видалення лабораторії');
        }
    };

    const isAdmin = role === 'ADMIN';

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">Лабораторії</h1>
                <p className="page-description">Управління лабораторіями системи</p>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {isAdmin && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Скасувати' : 'Додати лабораторію'}
                    </button>
                </div>
            )}

            {showForm && isAdmin && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 className="card-header">
                        {editingId ? 'Редагування лабораторії' : 'Нова лабораторія'}
                    </h2>
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-group">
                            <label className="form-label">Назва</label>
                            <input
                                type="text"
                                className="form-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Наприклад: Лабораторія 101"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Розташування</label>
                            <input
                                type="text"
                                className="form-input"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Наприклад: Корпус А, поверх 1"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Місткість</label>
                            <input
                                type="number"
                                className="form-input"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                placeholder="Наприклад: 20"
                                min="1"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Опис</label>
                            <textarea
                                className="form-textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Опис лабораторії..."
                            />
                        </div>

                        <div className="btn-group">
                            <button type="submit" className="btn btn-primary">
                                {editingId ? 'Оновити' : 'Створити'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={resetForm}
                            >
                                Скасувати
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="loading">
                    <div className="spinner"></div>
                </div>
            ) : labs.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">🔬</div>
                    <h2 className="empty-state-title">Немає лабораторій</h2>
                    <p className="empty-state-description">
                        {isAdmin
                            ? 'Створіть першу лабораторію, щоб почати роботу'
                            : 'Лабораторії поки що не додані'}
                    </p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Назва</th>
                                <th>Розташування</th>
                                <th>Місткість</th>
                                <th>Опис</th>
                                {isAdmin && <th>Дії</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {labs.map((lab) => (
                                <tr key={lab.id}>
                                    <td>{lab.id}</td>
                                    <td>{lab.name}</td>
                                    <td>{lab.location}</td>
                                    <td>{lab.capacity}</td>
                                    <td>{lab.description || '-'}</td>
                                    {isAdmin && (
                                        <td>
                                            <div className="btn-group">
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => handleEdit(lab)}
                                                >
                                                    Редагувати
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(lab.id)}
                                                >
                                                    Видалити
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
