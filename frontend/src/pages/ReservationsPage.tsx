import React, { useEffect, useState } from 'react';
import { reservationsApi } from '../api/reservationsApi';
import { labsApi } from '../api/labsApi';
import { equipmentApi } from '../api/equipmentApi';
import { labWorksApi } from '../api/labWorksApi';
import type { Reservation } from '../types/Reservation';
import { ReservationStatus } from '../types/Reservation';
import type { Lab } from '../types/Lab';
import type { Equipment } from '../types/Equipment';
import type { LabWork } from '../types/LabWork';
import { useAuth } from '../context/AuthContext';

export const ReservationsPage: React.FC = () => {
    const { role } = useAuth();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [labs, setLabs] = useState<Lab[]>([]);
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [labWorks, setLabWorks] = useState<LabWork[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [labId, setLabId] = useState('');
    const [labWorkId, setLabWorkId] = useState('');
    const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<number[]>([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [purpose, setPurpose] = useState('');

    const loadData = async () => {
        try {
            setLoading(true);
            const [reservationsData, labsData, equipmentData, labWorksData] = await Promise.all([
                role === 'ADMIN' ? reservationsApi.getAll() : reservationsApi.getMy(),
                labsApi.getAll(),
                equipmentApi.getAll(),
                labWorksApi.getPublished(),
            ]);
            setReservations(reservationsData);
            setLabs(labsData);
            setEquipment(equipmentData);
            setLabWorks(labWorksData);
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
        setLabId('');
        setLabWorkId('');
        setSelectedEquipmentIds([]);
        setStartTime('');
        setEndTime('');
        setPurpose('');
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
            await reservationsApi.create({
                labId: parseInt(labId),
                labWorkId: labWorkId ? parseInt(labWorkId) : undefined,
                equipmentIds: selectedEquipmentIds,
                startTime,
                endTime,
                purpose: purpose || undefined,
            });

            await loadData();
            resetForm();
        } catch (err: any) {
            setError(err.message || 'Помилка створення резервації');
        }
    };

    const handleApprove = async (id: number) => {
        try {
            await reservationsApi.approve(id);
            await loadData();
        } catch (err: any) {
            setError(err.message || 'Помилка підтвердження резервації');
        }
    };

    const handleReject = async (id: number) => {
        try {
            await reservationsApi.reject(id);
            await loadData();
        } catch (err: any) {
            setError(err.message || 'Помилка відхилення резервації');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Ви впевнені, що хочете видалити цю резервацію?')) {
            return;
        }

        try {
            await reservationsApi.delete(id);
            await loadData();
        } catch (err: any) {
            setError(err.message || 'Помилка видалення резервації');
        }
    };

    const getStatusBadgeClass = (status: ReservationStatus) => {
        switch (status) {
            case ReservationStatus.APPROVED:
                return 'badge badge-approved';
            case ReservationStatus.PENDING:
                return 'badge badge-pending';
            case ReservationStatus.REJECTED:
                return 'badge badge-rejected';
            case ReservationStatus.CANCELLED:
                return 'badge badge-danger';
            default:
                return 'badge';
        }
    };

    const getStatusLabel = (status: ReservationStatus) => {
        switch (status) {
            case ReservationStatus.APPROVED:
                return 'Підтверджено';
            case ReservationStatus.PENDING:
                return 'Очікує';
            case ReservationStatus.REJECTED:
                return 'Відхилено';
            case ReservationStatus.CANCELLED:
                return 'Скасовано';
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

    const isAdmin = role === 'ADMIN';

    // Get minimum datetime for reservation (current time + 1 hour)
    const getMinDateTime = () => {
        const now = new Date();
        now.setHours(now.getHours() + 1);
        return now.toISOString().slice(0, 16);
    };

    // Filter equipment by selected lab
    const availableEquipment = equipment.filter(
        (eq) => !labId || eq.labId === parseInt(labId)
    );

    const toggleEquipment = (eqId: number) => {
        setSelectedEquipmentIds((prev) =>
            prev.includes(eqId) ? prev.filter((id) => id !== eqId) : [...prev, eqId]
        );
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">Резервації</h1>
                <p className="page-description">
                    {isAdmin ? 'Управління всіма резерваціями' : 'Ваші резервації лабораторій'}
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
                    {showForm ? 'Скасувати' : 'Створити резервацію'}
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 className="card-header">Нова резервація</h2>
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-group">
                            <label className="form-label">Лабораторія*</label>
                            <select
                                className="form-select"
                                value={labId}
                                onChange={(e) => {
                                    setLabId(e.target.value);
                                    setSelectedEquipmentIds([]);
                                }}
                                required
                            >
                                <option value="">Оберіть лабораторію</option>
                                {labs.map((lab) => (
                                    <option key={lab.id} value={lab.id}>
                                        {lab.name} - {lab.location} (Місткість: {lab.capacity})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Лабораторна робота (опціонально)</label>
                            <select
                                className="form-select"
                                value={labWorkId}
                                onChange={(e) => setLabWorkId(e.target.value)}
                            >
                                <option value="">Не вибрано</option>
                                {labWorks.map((work) => (
                                    <option key={work.id} value={work.id}>
                                        {work.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {labId && availableEquipment.length > 0 && (
                            <div className="form-group">
                                <label className="form-label">Обладнання</label>
                                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem' }}>
                                    {availableEquipment.map((eq) => (
                                        <div key={eq.id} style={{ marginBottom: '0.5rem' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEquipmentIds.includes(eq.id)}
                                                    onChange={() => toggleEquipment(eq.id)}
                                                    style={{ marginRight: '0.5rem' }}
                                                />
                                                <span>{eq.name} ({eq.inventoryNumber}) - {eq.status}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">Час початку*</label>
                            <input
                                type="datetime-local"
                                className="form-input"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                min={getMinDateTime()}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Час завершення*</label>
                            <input
                                type="datetime-local"
                                className="form-input"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                min={startTime || getMinDateTime()}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Мета використання (опціонально)</label>
                            <textarea
                                className="form-input"
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                rows={3}
                                placeholder="Опишіть мету використання лабораторії..."
                            />
                        </div>

                        <div className="btn-group">
                            <button type="submit" className="btn btn-primary">
                                Створити
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
            ) : reservations.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📅</div>
                    <h2 className="empty-state-title">Немає резервацій</h2>
                    <p className="empty-state-description">
                        {isAdmin
                            ? 'Резервації поки що не створені'
                            : 'Створіть першу резервацію, щоб забронювати лабораторію'}
                    </p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Лабораторія</th>
                                {isAdmin && <th>Користувач</th>}
                                <th>Лаб. робота</th>
                                <th>Обладнання</th>
                                <th>Початок</th>
                                <th>Завершення</th>
                                <th>Статус</th>
                                {isAdmin && <th>Підтверджено</th>}
                                <th>Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td>{reservation.id}</td>
                                    <td>{reservation.labName}</td>
                                    {isAdmin && <td>{reservation.username}</td>}
                                    <td>{reservation.labWorkTitle || '-'}</td>
                                    <td>
                                        {reservation.equipment.length > 0 ? (
                                            <div style={{ fontSize: '0.875rem' }}>
                                                {reservation.equipment.map((eq) => eq.name).join(', ')}
                                            </div>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td>{formatDateTime(reservation.startTime)}</td>
                                    <td>{formatDateTime(reservation.endTime)}</td>
                                    <td>
                                        <span className={getStatusBadgeClass(reservation.status)}>
                                            {getStatusLabel(reservation.status)}
                                        </span>
                                    </td>
                                    {isAdmin && (
                                        <td>
                                            {reservation.approvedBy ? (
                                                <div style={{ fontSize: '0.875rem' }}>
                                                    {reservation.approvedBy}
                                                    <br />
                                                    {reservation.approvedAt && formatDateTime(reservation.approvedAt)}
                                                </div>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                    )}
                                    <td>
                                        <div className="btn-group">
                                            {isAdmin && reservation.status === ReservationStatus.PENDING && (
                                                <>
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => handleApprove(reservation.id)}
                                                    >
                                                        Підтвердити
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleReject(reservation.id)}
                                                    >
                                                        Відхилити
                                                    </button>
                                                </>
                                            )}
                                            {!isAdmin && reservation.status === ReservationStatus.PENDING && (
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(reservation.id)}
                                                >
                                                    Скасувати
                                                </button>
                                            )}
                                            {isAdmin && (
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(reservation.id)}
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
