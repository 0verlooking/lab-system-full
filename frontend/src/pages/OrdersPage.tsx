import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Order {
    id: number;
    status: string;
    createdAt: string;
    itemsCount: number;
    reservedUntil?: string;
}

export default function OrdersPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            // In real app, call API
            // Mock data
            setOrders([
                {
                    id: 1,
                    status: 'RESERVED',
                    createdAt: new Date().toISOString(),
                    itemsCount: 3,
                    reservedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                }
            ]);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'DRAFT':
                return <span className="badge badge-pending">⏳ Чернетка</span>;
            case 'RESERVED':
                return <span className="badge badge-in-use">📌 Заброньовано</span>;
            case 'APPROVED':
                return <span className="badge badge-approved">✓ Підтверджено</span>;
            case 'ISSUED':
                return <span className="badge badge-approved">📦 Видано</span>;
            case 'RETURNED':
                return <span className="badge">✅ Повернено</span>;
            default:
                return <span className="badge">{status}</span>;
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
            <div className="container">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 className="page-title">📦 Мої замовлення</h1>
                        <p className="page-description">Історія та статус замовлень обладнання</p>
                    </div>
                    <button
                        onClick={() => navigate('/cart')}
                        className="btn btn-primary"
                    >
                        🛒 Новe замовлення
                    </button>
                </div>

                {orders.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📦</div>
                        <h3 className="empty-state-title">Немає замовлень</h3>
                        <p className="empty-state-description">Ви ще не створили жодного замовлення</p>
                        <button
                            onClick={() => navigate('/equipment')}
                            className="btn btn-primary"
                            style={{ marginTop: '1rem' }}
                        >
                            🔧 Перейти до каталогу
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {orders.map(order => (
                            <div key={order.id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                            Замовлення #{order.id}
                                        </h3>
                                        <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                                            Створено: {new Date(order.createdAt).toLocaleString('uk-UA')}
                                        </p>
                                    </div>
                                    {getStatusBadge(order.status)}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.25rem', background: 'var(--gray-50)', borderRadius: '10px', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--gray-600)' }}>Кількість позицій:</span>
                                        <span style={{ fontWeight: '600' }}>{order.itemsCount}</span>
                                    </div>
                                    {order.reservedUntil && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--gray-600)' }}>Заброньовано до:</span>
                                            <span style={{ fontWeight: '600', color: 'var(--warning-600)' }}>
                                                {new Date(order.reservedUntil).toLocaleString('uk-UA')}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="btn-group">
                                    <button className="btn btn-primary btn-sm">
                                        👁️ Переглянути
                                    </button>
                                    {order.status === 'DRAFT' && (
                                        <button className="btn btn-secondary btn-sm">
                                            ✏️ Редагувати
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
