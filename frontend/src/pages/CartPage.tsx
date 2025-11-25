import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface Preset {
    id: string;
    name: string;
    equipmentIds: number[];
}

export default function CartPage() {
    const navigate = useNavigate();
    const { items, removeFromCart, updateQuantity, clearCart, getCartCount } = useCart();

    const [acceptPartial, setAcceptPartial] = useState(false);
    const [notes, setNotes] = useState('');
    const [presetName, setPresetName] = useState('');
    const [showPresetForm, setShowPresetForm] = useState(false);

    // Mock presets - in real app, load from API
    const [presets, setPresets] = useState<Preset[]>([
        { id: '1', name: 'Стандартний набір Arduino', equipmentIds: [1, 2, 3] },
        { id: '2', name: 'Набір для IoT', equipmentIds: [4, 5, 6] }
    ]);

    const handleSavePreset = () => {
        if (!presetName.trim()) {
            alert('Введіть назву пресету');
            return;
        }

        if (items.length === 0) {
            alert('Кошик порожній');
            return;
        }

        const newPreset: Preset = {
            id: Date.now().toString(),
            name: presetName,
            equipmentIds: items.map(item => item.equipment.id)
        };

        setPresets([...presets, newPreset]);
        setPresetName('');
        setShowPresetForm(false);
        alert('Пресет збережено!');
    };

    const handleLoadPreset = (preset: Preset) => {
        // In real app, load equipment by IDs from API
        alert(`Завантаження пресету "${preset.name}" буде реалізовано після інтеграції з API`);
    };

    const handleSubmitOrder = async () => {
        if (items.length === 0) {
            alert('Кошик порожній');
            return;
        }

        // In real app, send order to API
        console.log('Submitting order:', {
            items: items.map(item => ({
                equipmentId: item.equipment.id,
                quantity: item.quantity
            })),
            acceptPartial,
            notes
        });

        alert('Замовлення відправлено! Обладнання заброньовано на 24 години.');
        clearCart();
        navigate('/orders');
    };

    const getTotalItems = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">🛒 Кошик</h1>
                        <p className="page-description">
                            {getCartCount() === 0
                                ? 'Ваш кошик порожній'
                                : `${getTotalItems()} ${getTotalItems() === 1 ? 'позиція' : 'позицій'}`}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/equipment')}
                        className="btn btn-secondary"
                    >
                        ← Назад до каталогу
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                        {/* Main Cart Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Presets Section */}
                            <div className="card">
                                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h2 style={{ margin: 0 }}>💾 Збережені пресети</h2>
                                    <button
                                        onClick={() => setShowPresetForm(!showPresetForm)}
                                        className="btn btn-sm btn-secondary"
                                    >
                                        {showPresetForm ? 'Скасувати' : '+ Зберегти кошик'}
                                    </button>
                                </div>

                                {showPresetForm && (
                                    <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--primary-50)', borderRadius: '10px' }}>
                                        <input
                                            type="text"
                                            value={presetName}
                                            onChange={(e) => setPresetName(e.target.value)}
                                            placeholder="Назва пресету"
                                            className="form-input"
                                            style={{ marginBottom: '0.75rem' }}
                                        />
                                        <button
                                            onClick={handleSavePreset}
                                            className="btn btn-primary btn-sm"
                                        >
                                            Зберегти пресет
                                        </button>
                                    </div>
                                )}

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {presets.map(preset => (
                                        <div
                                            key={preset.id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '1rem',
                                                border: '1px solid var(--gray-200)',
                                                borderRadius: '8px',
                                                transition: 'all var(--transition-fast)'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.background = 'var(--gray-50)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <span style={{ fontWeight: '600' }}>{preset.name}</span>
                                            <button
                                                onClick={() => handleLoadPreset(preset)}
                                                className="btn btn-sm btn-secondary"
                                            >
                                                Завантажити
                                            </button>
                                        </div>
                                    ))}
                                    {presets.length === 0 && (
                                        <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Немає збережених пресетів</p>
                                    )}
                                </div>
                            </div>

                            {/* Cart Items */}
                            <div className="card">
                                <h2 className="card-header">📦 Обране обладнання</h2>

                                {items.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
                                        <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>Кошик порожній</p>
                                        <button
                                            onClick={() => navigate('/equipment')}
                                            className="btn btn-primary"
                                        >
                                            Перейти до каталогу
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {items.map(item => (
                                            <div
                                                key={item.equipment.id}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '1rem',
                                                    padding: '1.25rem',
                                                    border: '1px solid var(--gray-200)',
                                                    borderRadius: '12px',
                                                    background: 'white',
                                                    boxShadow: 'var(--shadow-sm)'
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
                                                    <h3 style={{ fontWeight: '700', marginBottom: '0.25rem' }}>{item.equipment.name}</h3>
                                                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.25rem' }}>
                                                        Інв. №: {item.equipment.inventoryNumber}
                                                    </p>
                                                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                                                        Лабораторія: {item.equipment.labName}
                                                    </p>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <button
                                                            onClick={() => updateQuantity(item.equipment.id, item.quantity - 1)}
                                                            className="btn btn-sm btn-secondary"
                                                            style={{ width: '36px', height: '36px', padding: 0 }}
                                                        >
                                                            -
                                                        </button>
                                                        <span style={{ width: '48px', textAlign: 'center', fontWeight: '600', fontSize: '1.125rem' }}>
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.equipment.id, item.quantity + 1)}
                                                            className="btn btn-sm btn-secondary"
                                                            style={{ width: '36px', height: '36px', padding: 0 }}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.equipment.id)}
                                                        className="btn btn-sm btn-danger"
                                                        style={{ fontSize: '1.25rem' }}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {items.length > 0 && (
                                            <button
                                                onClick={clearCart}
                                                style={{
                                                    alignSelf: 'flex-start',
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'var(--danger-600)',
                                                    fontSize: '0.875rem',
                                                    cursor: 'pointer',
                                                    textDecoration: 'underline'
                                                }}
                                            >
                                                🗑️ Очистити кошик
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div>
                            <div className="card" style={{ position: 'sticky', top: '2rem' }}>
                                <h2 className="card-header">📋 Оформлення замовлення</h2>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {/* Accept Partial Checkbox */}
                                    <div style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        padding: '1rem',
                                        background: 'var(--gray-50)',
                                        borderRadius: '10px'
                                    }}>
                                        <input
                                            type="checkbox"
                                            id="acceptPartial"
                                            checked={acceptPartial}
                                            onChange={(e) => setAcceptPartial(e.target.checked)}
                                            style={{ marginTop: '0.25rem', width: '18px', height: '18px', cursor: 'pointer' }}
                                        />
                                        <label htmlFor="acceptPartial" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>
                                            <span style={{ fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
                                                Прийняти часткове виконання
                                            </span>
                                            <span style={{ color: 'var(--gray-600)' }}>
                                                Я погоджуюсь отримати те обладнання, яке є в наявності,
                                                навіть якщо не всі позиції будуть доступні
                                            </span>
                                        </label>
                                    </div>

                                    {/* Notes */}
                                    <div className="form-group">
                                        <label className="form-label">Примітки до замовлення</label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            rows={3}
                                            className="form-input"
                                            placeholder="Додаткові побажання або коментарі..."
                                        />
                                    </div>

                                    {/* Summary */}
                                    <div style={{ borderTop: '2px solid var(--gray-200)', paddingTop: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                            <span style={{ fontWeight: '600' }}>Всього позицій:</span>
                                            <span style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--primary-600)' }}>{getTotalItems()}</span>
                                        </div>
                                        <div style={{
                                            fontSize: '0.875rem',
                                            color: 'var(--gray-600)',
                                            padding: '0.75rem',
                                            background: 'var(--warning-50)',
                                            borderRadius: '8px',
                                            marginBottom: '1rem'
                                        }}>
                                            ⏱️ Обладнання буде заброньовано на 24 години після підтвердження
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        onClick={handleSubmitOrder}
                                        disabled={items.length === 0}
                                        className={items.length === 0 ? 'btn btn-secondary' : 'btn btn-success'}
                                        style={{ width: '100%', fontSize: '1.125rem', fontWeight: '600' }}
                                    >
                                        {items.length === 0 ? 'Кошик порожній' : '✓ Відправити заявку'}
                                    </button>

                                    {items.length > 0 && (
                                        <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textAlign: 'center' }}>
                                            Після відправки заявки лаборант розгляне ваш запит та зв'яжеться з вами
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
