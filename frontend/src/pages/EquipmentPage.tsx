import React, { useEffect, useState } from 'react';
import { equipmentApi } from '../api/equipmentApi';
import { labsApi } from '../api/labsApi';
import type { Equipment } from '../types/Equipment';
import { EquipmentStatus } from '../types/Equipment';
import type { Lab } from '../types/Lab';
import { useAuth } from '../context/AuthContext';

export const EquipmentPage: React.FC = () => {
    const { role } = useAuth();
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [labs, setLabs] = useState<Lab[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [inventoryNumber, setInventoryNumber] = useState('');
    const [status, setStatus] = useState<EquipmentStatus>(EquipmentStatus.AVAILABLE);
    const [labId, setLabId] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);
            const [equipmentData, labsData] = await Promise.all([
                equipmentApi.getAll(),
                labsApi.getAll(),
            ]);
            setEquipment(equipmentData);
            setLabs(labsData);
            setError('');
        } catch (err: any) {
            setError('Помилка завантаження даних');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const resetForm = () => {
        setName('');
        setInventoryNumber('');
        setStatus(EquipmentStatus.AVAILABLE);
        setLabId('');
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!labId) {
            setError('Будь ласка, оберіть лабораторію');
            return;
        }

        try {
            const equipmentData = {
                name,
                inventoryNumber,
                status,
                labId: parseInt(labId),
            };

            if (editingId) {
                await equipmentApi.update(editingId, equipmentData);
            } else {
                await equipmentApi.create(equipmentData);
            }

            await loadData();
            resetForm();
        } catch (err: any) {
            setError(err.message || 'Помилка збереження обладнання');
        }
    };

    const handleEdit = (item: Equipment) => {
        setName(item.name);
        setInventoryNumber(item.inventoryNumber);
        setStatus(item.status);
        setLabId(item.labId.toString());
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Ви впевнені, що хочете видалити це обладнання?')) {
            return;
        }

        try {
            await equipmentApi.delete(id);
            await loadData();
        } catch (err: any) {
            setError(err.message || 'Помилка видалення обладнання');
        }
    };

    const getStatusBadgeClass = (status: EquipmentStatus) => {
        switch (status) {
            case EquipmentStatus.AVAILABLE:
                return 'badge badge-available';
            case EquipmentStatus.IN_USE:
                return 'badge badge-in-use';
            case EquipmentStatus.MAINTENANCE:
                return 'badge badge-maintenance';
            case EquipmentStatus.BROKEN:
                return 'badge badge-danger';
            default:
                return 'badge';
        }
    };

    const getStatusLabel = (status: EquipmentStatus) => {
        switch (status) {
            case EquipmentStatus.AVAILABLE:
                return 'Доступне';
            case EquipmentStatus.IN_USE:
                return 'Використовується';
            case EquipmentStatus.MAINTENANCE:
                return 'На обслуговуванні';
            case EquipmentStatus.BROKEN:
                return 'Зламане';
            default:
                return status;
        }
    };

    const isAdmin = role === 'ADMIN';

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">Обладнання</h1>
                <p className="page-description">Управління обладнанням лабораторій</p>
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
                        {showForm ? 'Скасувати' : 'Додати обладнання'}
                    </button>
                </div>
            )}

            {showForm && isAdmin && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 className="card-header">
                        {editingId ? 'Редагування обладнання' : 'Нове обладнання'}
                    </h2>
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-group">
                            <label className="form-label">Назва</label>
                            <input
                                type="text"
                                className="form-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Наприклад: Мікроскоп"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Інвентарний номер</label>
                            <input
                                type="text"
                                className="form-input"
                                value={inventoryNumber}
                                onChange={(e) => setInventoryNumber(e.target.value)}
                                placeholder="Наприклад: INV-001"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Статус</label>
                            <select
                                className="form-select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as EquipmentStatus)}
                                required
                            >
                                <option value={EquipmentStatus.AVAILABLE}>Доступне</option>
                                <option value={EquipmentStatus.IN_USE}>Використовується</option>
                                <option value={EquipmentStatus.MAINTENANCE}>На обслуговуванні</option>
                                <option value={EquipmentStatus.BROKEN}>Зламане</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Лабораторія</label>
                            <select
                                className="form-select"
                                value={labId}
                                onChange={(e) => setLabId(e.target.value)}
                                required
                            >
                                <option value="">Оберіть лабораторію</option>
                                {labs.map((lab) => (
                                    <option key={lab.id} value={lab.id}>
                                        {lab.name}
                                    </option>
                                ))}
                            </select>
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
            ) : equipment.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">🔧</div>
                    <h2 className="empty-state-title">Немає обладнання</h2>
                    <p className="empty-state-description">
                        {isAdmin
                            ? 'Додайте перше обладнання, щоб почати роботу'
                            : 'Обладнання поки що не додане'}
                    </p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Назва</th>
                                <th>Інв. номер</th>
                                <th>Статус</th>
                                <th>Лабораторія</th>
                                {isAdmin && <th>Дії</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {equipment.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.inventoryNumber}</td>
                                    <td>
                                        <span className={getStatusBadgeClass(item.status)}>
                                            {getStatusLabel(item.status)}
                                        </span>
                                    </td>
                                    <td>{item.labName}</td>
                                    {isAdmin && (
                                        <td>
                                            <div className="btn-group">
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    Редагувати
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(item.id)}
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
