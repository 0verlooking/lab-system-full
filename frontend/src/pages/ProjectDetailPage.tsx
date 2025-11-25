import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { labWorksApi } from '../api/labWorksApi';
import type { LabWork } from '../types/LabWork';

export default function ProjectDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<LabWork | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthor, setIsAuthor] = useState(false);
    const [comment, setComment] = useState('');

    useEffect(() => {
        loadProject();
    }, [id]);

    const loadProject = async () => {
        try {
            if (!id) return;
            const data = await labWorksApi.getById(Number(id));
            setProject(data);

            // Check if current user is author (simplified)
            const username = localStorage.getItem('auth_username');
            setIsAuthor(data.authorUsername === username);
        } catch (error) {
            console.error('Error loading project:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = () => {
        if (!comment.trim()) {
            alert('Введіть коментар');
            return;
        }
        // In real app, submit comment to API
        alert('Коментар додано!');
        setComment('');
    };

    if (loading) {
        return (
            <div className="page">
                <div className="container">
                    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                        <div className="spinner" style={{ margin: '0 auto' }}></div>
                        <p style={{ marginTop: '1rem', color: 'var(--gray-600)' }}>Завантаження проекту...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="page">
                <div className="container">
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📁</div>
                        <h2 style={{ marginBottom: '0.5rem' }}>Проект не знайдено</h2>
                        <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>Можливо, проект було видалено або він недоступний</p>
                        <button onClick={() => navigate('/repository')} className="btn btn-primary">
                            Повернутись до репозиторію
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PUBLISHED':
                return <span className="badge badge-approved">✓ Опубліковано</span>;
            case 'DRAFT':
                return <span className="badge badge-pending">📝 Чернетка</span>;
            case 'ARCHIVED':
                return <span className="badge" style={{ background: 'var(--gray-100)', color: 'var(--gray-700)' }}>📦 Архів</span>;
            default:
                return <span className="badge badge-pending">{status}</span>;
        }
    };

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: '1200px' }}>
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-secondary btn-sm"
                    style={{ marginBottom: '1.5rem' }}
                >
                    ← Назад
                </button>

                <div className="card">
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>{project.title}</h1>
                                {getStatusBadge(project.status)}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--gray-600)', fontSize: '0.9375rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>👤</span>
                                    <span>Автор: <strong>{project.authorUsername}</strong></span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>📅</span>
                                    <span>Створено: {new Date(project.createdAt).toLocaleDateString('uk-UA')}</span>
                                </div>
                            </div>
                        </div>
                        {isAuthor && (
                            <button
                                onClick={() => navigate(`/repository/${id}/edit`)}
                                className="btn btn-primary"
                            >
                                ✏️ Редагувати
                            </button>
                        )}
                    </div>

                    {/* Photos Section */}
                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>📸</span> Фотографії проекту
                        </h2>
                        <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
                            {['Схема', 'Результат', 'Алгоритм', 'Процес'].map((label, index) => (
                                <div
                                    key={index}
                                    style={{
                                        aspectRatio: '1',
                                        background: 'linear-gradient(135deg, var(--gray-100), var(--gray-200))',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '2px dashed var(--gray-300)',
                                        color: 'var(--gray-500)',
                                        fontWeight: '600',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    {label}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Description */}
                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>📝</span> Опис та алгоритм роботи
                        </h2>
                        <div style={{
                            padding: '1.5rem',
                            background: 'var(--gray-50)',
                            borderRadius: '12px',
                            border: '1px solid var(--gray-200)'
                        }}>
                            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', color: 'var(--gray-700)' }}>
                                {project.description || 'Опис відсутній'}
                            </p>
                        </div>
                    </section>

                    {/* Required Equipment */}
                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>🔧</span> Необхідне обладнання
                            <span className="badge" style={{ background: 'var(--primary-100)', color: 'var(--primary-700)', marginLeft: '0.5rem' }}>
                                {project.requiredEquipment.length}
                            </span>
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {project.requiredEquipment.map(equipment => (
                                <div
                                    key={equipment.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '1.25rem',
                                        border: '1px solid var(--gray-200)',
                                        borderRadius: '12px',
                                        background: 'white',
                                        boxShadow: 'var(--shadow-sm)',
                                        transition: 'all var(--transition-fast)'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                    }}
                                >
                                    <div style={{
                                        width: '70px',
                                        height: '70px',
                                        background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2rem',
                                        flexShrink: 0
                                    }}>
                                        🔧
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontWeight: '700', marginBottom: '0.25rem', fontSize: '1.0625rem' }}>{equipment.name}</h3>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.25rem' }}>
                                            Інв. №: {equipment.inventoryNumber}
                                        </p>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                                            Лабораторія: {equipment.labName}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        {equipment.status === 'AVAILABLE' ? (
                                            <span className="badge badge-available">✓ В наявності</span>
                                        ) : (
                                            <div>
                                                <span className="badge badge-in-use" style={{ marginBottom: '0.5rem' }}>⚠️ Недоступно</span>
                                                {equipment.documentationLink && (
                                                    <a
                                                        href={equipment.documentationLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            display: 'block',
                                                            fontSize: '0.875rem',
                                                            color: 'var(--primary-600)',
                                                            textDecoration: 'underline',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        🛒 Купити онлайн
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Comments Section */}
                    <section>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>💬</span> Коментарі
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{
                                padding: '1.5rem',
                                background: 'var(--gray-50)',
                                borderRadius: '12px',
                                border: '1px solid var(--gray-200)'
                            }}>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="form-input"
                                    rows={3}
                                    placeholder="Додати коментар..."
                                    style={{ marginBottom: '1rem' }}
                                />
                                <button
                                    onClick={handleSubmitComment}
                                    className="btn btn-primary"
                                >
                                    📤 Відправити
                                </button>
                            </div>
                            {/* Comments will be loaded here */}
                            <div style={{
                                padding: '2rem',
                                textAlign: 'center',
                                background: 'var(--gray-50)',
                                borderRadius: '12px',
                                border: '1px solid var(--gray-200)'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💭</div>
                                <p style={{ color: 'var(--gray-500)' }}>Коментарів поки немає</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
