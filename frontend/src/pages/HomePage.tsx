import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { labWorksApi } from '../api/labWorksApi';
import { newsApi } from '../api/newsApi';
import type { LabWork } from '../types/LabWork';
import type { News } from '../types/News';

export default function HomePage() {
    const [recentProjects, setRecentProjects] = useState<LabWork[]>([]);
    const [news, setNews] = useState<News[]>([]);
    const [myProjects, setMyProjects] = useState<LabWork[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [newsData, myProjectsData, allProjects] = await Promise.all([
                newsApi.getActive(),
                labWorksApi.getMy(),
                labWorksApi.getAll()
            ]);
            setNews(newsData.slice(0, 5));
            setMyProjects(myProjectsData);
            setRecentProjects(allProjects.slice(0, 6));
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const inProgressProjects = myProjects.filter(p => p.status === 'DRAFT').length;
    const completedProjects = myProjects.filter(p => p.status === 'PUBLISHED').length;

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
                <div className="page-header">
                    <h1 className="page-title">🏠 Головна</h1>
                    <p className="page-description">Огляд ваших проектів та останніх новин</p>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-3" style={{ marginBottom: '2rem' }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
                        <h3 style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Мої проекти</h3>
                        <p style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary-600)' }}>{myProjects.length}</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                        <h3 style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>В роботі</h3>
                        <p style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--warning-600)' }}>{inProgressProjects}</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                        <h3 style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Завершені</h3>
                        <p style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--success-600)' }}>{completedProjects}</p>
                    </div>
                </div>

                {/* News Section */}
                {news.length > 0 && (
                    <section style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 className="card-header" style={{ marginBottom: 0 }}>📰 Новини та оголошення</h2>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {news.map(item => (
                                <div key={item.id} className="card">
                                    <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                                        <div style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '10px',
                                            background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.75rem',
                                            flexShrink: 0
                                        }}>
                                            {item.type === 'NEW_EQUIPMENT' && '🔧'}
                                            {item.type === 'NEW_PROJECT' && '📁'}
                                            {item.type === 'ANNOUNCEMENT' && '📢'}
                                            {item.type === 'SYSTEM' && '⚙️'}
                                            {item.type === 'UPDATE' && '🔄'}
                                            {item.type === 'EVENT' && '🎉'}
                                            {!['NEW_EQUIPMENT', 'NEW_PROJECT', 'ANNOUNCEMENT', 'SYSTEM', 'UPDATE', 'EVENT'].includes(item.type) && '📰'}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontWeight: '700', fontSize: '1.125rem', marginBottom: '0.5rem', color: 'var(--gray-800)' }}>
                                                {item.title}
                                            </h3>
                                            <p style={{ color: 'var(--gray-600)', lineHeight: '1.6' }}>{item.content}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '0.75rem' }}>
                                                {new Date(item.createdAt).toLocaleDateString('uk-UA')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Recent Projects */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 className="card-header" style={{ marginBottom: 0 }}>🚀 Нещодавні проекти</h2>
                        <Link to="/repository" className="btn btn-primary btn-sm">
                            Всі проекти →
                        </Link>
                    </div>
                    {recentProjects.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📁</div>
                            <h3 className="empty-state-title">Немає проектів</h3>
                            <p className="empty-state-description">Створіть свій перший проект!</p>
                            <Link to="/repository/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                ✨ Створити проект
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
                            {recentProjects.map(project => (
                                <Link key={project.id} to={`/repository/${project.id}`} style={{ textDecoration: 'none' }}>
                                    <div className="card" style={{ height: '100%' }}>
                                        <div style={{
                                            width: '100%',
                                            aspectRatio: '16/9',
                                            background: 'linear-gradient(135deg, var(--gray-100), var(--gray-200))',
                                            borderRadius: '10px',
                                            marginBottom: '1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '2px solid var(--gray-200)'
                                        }}>
                                            <span style={{ fontSize: '3rem' }}>📊</span>
                                        </div>
                                        <h3 style={{ fontWeight: '700', fontSize: '1.0625rem', marginBottom: '0.5rem', color: 'var(--gray-800)' }}>
                                            {project.title}
                                        </h3>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {project.description || 'Без опису'}
                                        </p>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            <span className="badge badge-approved" style={{ fontSize: '0.75rem' }}>
                                                {project.authorUsername}
                                            </span>
                                            {project.requiredEquipment.length > 0 && (
                                                <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                                    🔧 {project.requiredEquipment.length} деталей
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
