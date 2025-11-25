import { useEffect, useState } from 'react';
import { newsApi } from '../api/newsApi';
import type { News } from '../types/News';

export default function NewsPage() {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        try {
            const data = await newsApi.getActive();
            setNews(data);
        } catch (error) {
            console.error('Error loading news:', error);
        } finally {
            setLoading(false);
        }
    };

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
            <div className="container" style={{ maxWidth: '900px' }}>
                <div className="page-header">
                    <h1 className="page-title">📰 Новини та оголошення</h1>
                    <p className="page-description">Всі актуальні новини системи</p>
                </div>

                {news.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📰</div>
                        <h3 className="empty-state-title">Немає новин</h3>
                        <p className="empty-state-description">Наразі немає опублікованих новин</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {news.map(item => (
                            <div key={item.id} className="card">
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2.5rem',
                                        flexShrink: 0,
                                        boxShadow: 'var(--shadow-md)'
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
                                        <div style={{ marginBottom: '1rem' }}>
                                            <h2 style={{ fontWeight: '700', fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--gray-800)' }}>
                                                {item.title}
                                            </h2>
                                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                                                <span>📅 {new Date(item.createdAt).toLocaleDateString('uk-UA')}</span>
                                                <span className="badge badge-approved" style={{ fontSize: '0.75rem' }}>
                                                    {item.type.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                        <p style={{ color: 'var(--gray-700)', lineHeight: '1.7', fontSize: '1.0625rem' }}>
                                            {item.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
