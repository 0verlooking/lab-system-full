import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { equipmentApi } from '../api/equipmentApi';
import { labsApi } from '../api/labsApi';
import { useCart } from '../context/CartContext';
import type { Equipment } from '../types/Equipment';
import type { Lab } from '../types/Lab';
import { EquipmentStatus } from '../types/Equipment';

export default function EquipmentCatalogPage() {
    const navigate = useNavigate();
    const { addToCart, getCartCount } = useCart();

    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [labs, setLabs] = useState<Lab[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters and search
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLab, setSelectedLab] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'name' | 'status'>('name');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [equipmentData, labsData] = await Promise.all([
                equipmentApi.getAll(),
                labsApi.getAll()
            ]);
            setEquipment(equipmentData);
            setLabs(labsData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (item: Equipment) => {
        addToCart(item, 1);
        const feedback = document.createElement('div');
        feedback.textContent = '✓ Додано до кошика';
        feedback.style.cssText = 'position: fixed; top: 1rem; right: 1rem; background: linear-gradient(135deg, var(--success-500), var(--success-600)); color: white; padding: 1rem 1.5rem; border-radius: 10px; box-shadow: var(--shadow-xl); z-index: 9999; animation: slideIn 0.3s ease-out; font-weight: 600;';
        document.body.appendChild(feedback);
        setTimeout(() => {
            feedback.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => feedback.remove(), 300);
        }, 2000);
    };

    const filteredEquipment = equipment
        .filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.inventoryNumber.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLab = selectedLab === 'all' || item.labId.toString() === selectedLab;
            const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
            return matchesSearch && matchesLab && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
            } else {
                return a.status.localeCompare(b.status);
            }
        });

    const getStatusLabel = (status: EquipmentStatus) => {
        switch (status) {
            case EquipmentStatus.AVAILABLE:
                return 'В наявності';
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
                        <h1 className="page-title">🔧 Каталог обладнання</h1>
                        <p className="page-description">Огляд та замовлення обладнання для лабораторних робіт</p>
                    </div>
                    <button
                        onClick={() => navigate('/cart')}
                        className="btn btn-primary"
                        style={{ position: 'relative', whiteSpace: 'nowrap' }}
                    >
                        🛒 Кошик
                        {getCartCount() > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: 'linear-gradient(135deg, var(--danger-500), var(--danger-600))',
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                borderRadius: '999px',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: 'var(--shadow-lg)',
                                animation: 'pulse 2s infinite'
                            }}>
                                {getCartCount()}
                            </span>
                        )}
                    </button>
                </div>

                {/* Filters Card */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 className="card-header">🔍 Фільтри та пошук</h2>
                    <div className="grid grid-cols-1" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
                        <div className="form-group">
                            <label className="form-label">Пошук</label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Назва або інвентарний номер..."
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Лабораторія</label>
                            <select
                                value={selectedLab}
                                onChange={(e) => setSelectedLab(e.target.value)}
                                className="form-select"
                            >
                                <option value="all">🏫 Всі лабораторії</option>
                                {labs.map(lab => (
                                    <option key={lab.id} value={lab.id.toString()}>
                                        {lab.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Статус</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="form-select"
                            >
                                <option value="all">Всі статуси</option>
                                <option value={EquipmentStatus.AVAILABLE}>✓ В наявності</option>
                                <option value={EquipmentStatus.IN_USE}>⏳ Використовується</option>
                                <option value={EquipmentStatus.MAINTENANCE}>🔧 На обслуговуванні</option>
                                <option value={EquipmentStatus.BROKEN}>⚠️ Зламане</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid var(--gray-100)' }}>
                        <span style={{ fontWeight: '600', color: 'var(--gray-700)' }}>Сортувати:</span>
                        <div className="btn-group">
                            <button
                                type="button"
                                onClick={() => setSortBy('name')}
                                className={sortBy === 'name' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                            >
                                📝 За назвою
                            </button>
                            <button
                                type="button"
                                onClick={() => setSortBy('status')}
                                className={sortBy === 'status' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                            >
                                📊 За статусом
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
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
                        Знайдено: {filteredEquipment.length}
                    </span>
                    <span style={{ color: 'var(--gray-500)' }}>з {equipment.length} одиниць</span>
                </div>

                {/* Equipment Grid */}
                {filteredEquipment.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🔍</div>
                        <h3 className="empty-state-title">Нічого не знайдено</h3>
                        <p className="empty-state-description">
                            Спробуйте змінити параметри пошуку або фільтрів
                        </p>
                    </div>
                ) : (
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                        {filteredEquipment.map(item => (
                            <div key={item.id} className="card" style={{ padding: '1.5rem' }}>
                                {/* Equipment Image */}
                                <div style={{
                                    width: '100%',
                                    height: '180px',
                                    background: 'linear-gradient(135deg, var(--gray-100) 0%, var(--gray-200) 100%)',
                                    borderRadius: '10px',
                                    marginBottom: '1.25rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px solid var(--gray-200)'
                                }}>
                                    <span style={{ fontSize: '4rem' }}>🔧</span>
                                </div>

                                {/* Equipment Info */}
                                <h3 style={{ fontWeight: '700', fontSize: '1.125rem', marginBottom: '0.75rem', color: 'var(--gray-800)' }}>
                                    {item.name}
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                                        <span style={{ fontWeight: '600' }}>Інв. №:</span> {item.inventoryNumber}
                                    </p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                                        <span style={{ fontWeight: '600' }}>Лабораторія:</span> {item.labName}
                                    </p>
                                </div>

                                {/* Status Badge */}
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <span className={
                                        item.status === EquipmentStatus.AVAILABLE ? 'badge badge-available' :
                                        item.status === EquipmentStatus.IN_USE ? 'badge badge-in-use' :
                                        item.status === EquipmentStatus.MAINTENANCE ? 'badge badge-in-use' :
                                        'badge badge-maintenance'
                                    }>
                                        {item.status === EquipmentStatus.AVAILABLE && '✓ '}
                                        {item.status === EquipmentStatus.IN_USE && '⏳ '}
                                        {item.status === EquipmentStatus.MAINTENANCE && '🔧 '}
                                        {item.status === EquipmentStatus.BROKEN && '⚠️ '}
                                        {getStatusLabel(item.status)}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {item.status === EquipmentStatus.AVAILABLE ? (
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="btn btn-success"
                                            style={{ width: '100%' }}
                                        >
                                            ➕ Додати до кошика
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                disabled
                                                className="btn"
                                                style={{
                                                    width: '100%',
                                                    background: 'var(--gray-300)',
                                                    color: 'var(--gray-600)',
                                                    cursor: 'not-allowed'
                                                }}
                                            >
                                                ❌ Недоступно
                                            </button>
                                            {item.documentationLink && (
                                                <a
                                                    href={item.documentationLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-primary"
                                                    style={{ width: '100%', textDecoration: 'none' }}
                                                >
                                                    📦 Замовити онлайн
                                                </a>
                                            )}
                                        </>
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
