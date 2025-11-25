import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { labWorksApi } from '../api/labWorksApi';
import type { LabWork } from '../types/LabWork';

export default function RepositoryPage() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<LabWork[]>([]);
    const [myProjects, setMyProjects] = useState<LabWork[]>([]);
    const [loading, setLoading] = useState(true);
    const [showMy, setShowMy] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [allProjects, myProjectsData] = await Promise.all([
                labWorksApi.getPublished(),
                labWorksApi.getMy()
            ]);
            setProjects(allProjects);
            setMyProjects(myProjectsData);
        } catch (error) {
            console.error('Error loading projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const displayProjects = showMy ? myProjects : projects;
    const filteredProjects = displayProjects.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.authorUsername.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="page">
                <div className="loading">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 className="page-title">📁 Репозиторій проектів</h1>
                        <p className="page-description">Перегляд та пошук лабораторних робіт</p>
                    </div>
                    <button
                        onClick={() => navigate('/repository/new')}
                        className="btn btn-success"
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        ✨ Створити проект
                    </button>
                </div>

                {/* Tabs and Search */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--gray-200)', paddingBottom: '1rem' }}>
                        <button
                            onClick={() => setShowMy(false)}
                            className={showMy ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm'}
                        >
                            🌐 Публічні проекти ({projects.length})
                        </button>
                        <button
                            onClick={() => setShowMy(true)}
                            className={showMy ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                        >
                            📂 Мої проекти ({myProjects.length})
                        </button>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Пошук проектів</label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="🔍 Назва, опис або автор..."
                            className="form-input"
                        />
                    </div>
                </div>

                {/* Results Count */}
                {searchQuery && (
                    <div style={{
                        marginBottom: '1.5rem',
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '10px',
                        boxShadow: 'var(--shadow)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span style={{ fontWeight: '600', color: 'var(--primary-600)' }}>
                            Знайдено: {filteredProjects.length}
                        </span>
                        <span style={{ color: 'var(--gray-500)' }}>з {displayProjects.length} проектів</span>
                    </div>
                )}

                {/* Projects Grid */}
                {filteredProjects.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🔍</div>
                        <h3 className="empty-state-title">
                            {searchQuery ? 'Нічого не знайдено' : 'Немає проектів'}
                        </h3>
                        <p className="empty-state-description">
                            {searchQuery
                                ? 'Спробуйте змінити критерії пошуку'
                                : showMy
                                ? 'Створіть свій перший проект!'
                                : 'Поки що немає публічних проектів'}
                        </p>
                        {showMy && !searchQuery && (
                            <button
                                onClick={() => navigate('/repository/new')}
                                className="btn btn-primary"
                                style={{ marginTop: '1rem' }}
                            >
                                ✨ Створити проект
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-3">
                        {filteredProjects.map(project => (
                            <Link key={project.id} to={`/repository/${project.id}`} style={{ textDecoration: 'none' }}>
                                <div className="card" style={{ height: '100%' }}>
                                    {/* Preview Image */}
                                    <div style={{
                                        width: '100%',
                                        aspectRatio: '16/9',
                                        background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))',
                                        borderRadius: '10px',
                                        marginBottom: '1.25rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '2px solid var(--primary-200)'
                                    }}>
                                        <span style={{ fontSize: '3rem' }}>📊</span>
                                    </div>

                                    {/* Project Info */}
                                    <h3 style={{ fontWeight: '700', fontSize: '1.125rem', marginBottom: '0.75rem', color: 'var(--gray-800)' }}>
                                        {project.title}
                                    </h3>
                                    <p style={{
                                        fontSize: '0.875rem',
                                        color: 'var(--gray-600)',
                                        marginBottom: '1rem',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        lineHeight: '1.5'
                                    }}>
                                        {project.description || 'Без опису'}
                                    </p>

                                    {/* Meta Info */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span>👤</span>
                                            <span className="badge badge-approved" style={{ fontSize: '0.75rem' }}>
                                                {project.authorUsername}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span>📅</span>
                                            <span>{new Date(project.createdAt).toLocaleDateString('uk-UA')}</span>
                                        </div>
                                        {project.requiredEquipment.length > 0 && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span>🔧</span>
                                                <span>{project.requiredEquipment.length} деталей</span>
                                            </div>
                                        )}
                                        <div>
                                            <span className={
                                                project.status === 'PUBLISHED' ? 'badge badge-approved' :
                                                project.status === 'DRAFT' ? 'badge badge-pending' :
                                                'badge'
                                            } style={{ fontSize: '0.75rem' }}>
                                                {project.status === 'PUBLISHED' && '✓ Опубліковано'}
                                                {project.status === 'DRAFT' && '⏳ Чернетка'}
                                                {project.status === 'ARCHIVED' && '📦 Архів'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
