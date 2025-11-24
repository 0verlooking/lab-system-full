import React, { useEffect, useState } from 'react';
import { labWorksApi } from '../api/labWorksApi';
import { equipmentApi } from '../api/equipmentApi';
import type { LabWork } from '../types/LabWork';
import { LabWorkStatus } from '../types/LabWork';
import type { Equipment } from '../types/Equipment';
import { useAuth } from '../context/AuthContext';

export const LabWorksPage: React.FC = () => {
    const { role } = useAuth();
    const [labWorks, setLabWorks] = useState<LabWork[]>([]);
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<number[]>([]);
    const [status, setStatus] = useState<LabWorkStatus>(LabWorkStatus.DRAFT);
    const [editingId, setEditingId] = useState<number | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);
            const [labWorksData, equipmentData] = await Promise.all([
                role === 'ADMIN' ? labWorksApi.getAll() : labWorksApi.getMy(),
                equipmentApi.getAll(),
            ]);
            setLabWorks(labWorksData);
            setEquipment(equipmentData);
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
    }, [role]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setSelectedEquipmentIds([]);
        setStatus(LabWorkStatus.DRAFT);
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const labWorkData = {
                title,
                description: description || undefined,
                equipmentIds: selectedEquipmentIds,
                ...(editingId && { status }),
            };

            if (editingId) {
                await labWorksApi.update(editingId, labWorkData);
            } else {
                await labWorksApi.create({
                    title,
                    description: description || undefined,
                    equipmentIds: selectedEquipmentIds,
                });
            }

            await loadData();
            resetForm();
        } catch (err: any) {
            setError(err.message || 'Помилка збереження лабораторної роботи');
        }
    };

    const handleEdit = (labWork: LabWork) => {
        setTitle(labWork.title);
        setDescription(labWork.description || '');
        setSelectedEquipmentIds(labWork.requiredEquipment.map((eq) => eq.id));
        setStatus(labWork.status);
        setEditingId(labWork.id);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Ви впевнені, що хочете видалити цю лабораторну роботу?')) {
            return;
        }

        try {
            await labWorksApi.delete(id);
            await loadData();
        } catch (err: any) {
            setError(err.message || 'Помилка видалення лабораторної роботи');
        }
    };

    const getStatusBadgeClass = (status: LabWorkStatus) => {
        switch (status) {
            case LabWorkStatus.PUBLISHED:
                return 'badge badge-approved';
            case LabWorkStatus.DRAFT:
                return 'badge badge-pending';
            case LabWorkStatus.ARCHIVED:
                return 'badge badge-rejected';
            default:
                return 'badge';
        }
    };

    const getStatusLabel = (status: LabWorkStatus) => {
        switch (status) {
            case LabWorkStatus.PUBLISHED:
                return 'Опубліковано';
            case LabWorkStatus.DRAFT:
                return 'Чернетка';
            case LabWorkStatus.ARCHIVED:
                return 'Архівовано';
            default:
                return status;
        }
    };

    const formatDateTime = (dateTime: string) => {
        return new Date(dateTime).toLocaleString('uk-UA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const toggleEquipment = (eqId: number) => {
        setSelectedEquipmentIds((prev) =>
            prev.includes(eqId) ? prev.filter((id) => id !== eqId) : [...prev, eqId]
        );
    };

    const isAdmin = role === 'ADMIN';

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">Лабораторні роботи</h1>
                <p className="page-description">
                    {isAdmin ? 'Управління всіма лабораторними роботами' : 'Ваші лабораторні роботи'}
                </p>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Скасувати' : 'Створити лабораторну роботу'}
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 className="card-header">
                        {editingId ? 'Редагування лабораторної роботи' : 'Нова лабораторна робота'}
                    </h2>
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-group">
                            <label className="form-label">Назва*</label>
                            <input
                                type="text"
                                className="form-input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Наприклад: Дослідження електричних кіл"
                                minLength={3}
                                maxLength={200}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Опис (опціонально)</label>
                            <textarea
                                className="form-input"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                maxLength={1000}
                                placeholder="Детальний опис лабораторної роботи..."
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Необхідне обладнання</label>
                            <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem' }}>
                                {equipment.length === 0 ? (
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                        Обладнання не знайдено
                                    </p>
                                ) : (
                                    equipment.map((eq) => (
                                        <div key={eq.id} style={{ marginBottom: '0.5rem' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEquipmentIds.includes(eq.id)}
                                                    onChange={() => toggleEquipment(eq.id)}
                                                    style={{ marginRight: '0.5rem' }}
                                                />
                                                <span>
                                                    {eq.name} ({eq.inventoryNumber}) - {eq.labName}
                                                </span>
                                            </label>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {editingId && (
                            <div className="form-group">
                                <label className="form-label">Статус</label>
                                <select
                                    className="form-select"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as LabWorkStatus)}
                                    required
                                >
                                    <option value={LabWorkStatus.DRAFT}>Чернетка</option>
                                    <option value={LabWorkStatus.PUBLISHED}>Опубліковано</option>
                                    <option value={LabWorkStatus.ARCHIVED}>Архівовано</option>
                                </select>
                            </div>
                        )}

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
            ) : labWorks.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📚</div>
                    <h2 className="empty-state-title">Немає лабораторних робіт</h2>
                    <p className="empty-state-description">
                        {isAdmin
                            ? 'Лабораторні роботи поки що не створені'
                            : 'Створіть першу лабораторну роботу, щоб почати'}
                    </p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Назва</th>
                                <th>Автор</th>
                                <th>Обладнання</th>
                                <th>Статус</th>
                                <th>Створено</th>
                                <th>Оновлено</th>
                                <th>Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {labWorks.map((labWork) => (
                                <tr key={labWork.id}>
                                    <td>{labWork.id}</td>
                                    <td>
                                        <div>
                                            <div style={{ fontWeight: 500 }}>{labWork.title}</div>
                                            {labWork.description && (
                                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                                    {labWork.description.length > 100
                                                        ? labWork.description.substring(0, 100) + '...'
                                                        : labWork.description}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>{labWork.authorUsername}</td>
                                    <td>
                                        {labWork.requiredEquipment.length > 0 ? (
                                            <div style={{ fontSize: '0.875rem' }}>
                                                {labWork.requiredEquipment.map((eq) => eq.name).join(', ')}
                                            </div>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td>
                                        <span className={getStatusBadgeClass(labWork.status)}>
                                            {getStatusLabel(labWork.status)}
                                        </span>
                                    </td>
                                    <td>{formatDateTime(labWork.createdAt)}</td>
                                    <td>{formatDateTime(labWork.updatedAt)}</td>
                                    <td>
                                        <div className="btn-group">
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => handleEdit(labWork)}
                                            >
                                                Редагувати
                                            </button>
                                            {(isAdmin || labWork.status === LabWorkStatus.DRAFT) && (
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(labWork.id)}
                                                >
                                                    Видалити
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
