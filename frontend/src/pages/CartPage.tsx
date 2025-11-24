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
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Кошик</h1>
                    <p className="text-gray-600 mt-1">
                        {getCartCount() === 0
                            ? 'Ваш кошик порожній'
                            : `${getTotalItems()} ${getTotalItems() === 1 ? 'позиція' : 'позицій'}`}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/equipment')}
                    className="text-blue-600 hover:underline"
                >
                    ← Назад до каталогу
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Cart Section */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Presets Section */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Збережені пресети</h2>
                            <button
                                onClick={() => setShowPresetForm(!showPresetForm)}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                {showPresetForm ? 'Скасувати' : '+ Зберегти поточний кошик'}
                            </button>
                        </div>

                        {showPresetForm && (
                            <div className="mb-4 p-4 bg-blue-50 rounded">
                                <input
                                    type="text"
                                    value={presetName}
                                    onChange={(e) => setPresetName(e.target.value)}
                                    placeholder="Назва пресету"
                                    className="w-full px-4 py-2 border rounded mb-2"
                                />
                                <button
                                    onClick={handleSavePreset}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Зберегти пресет
                                </button>
                            </div>
                        )}

                        <div className="space-y-2">
                            {presets.map(preset => (
                                <div
                                    key={preset.id}
                                    className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
                                >
                                    <span className="font-medium">{preset.name}</span>
                                    <button
                                        onClick={() => handleLoadPreset(preset)}
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        Завантажити
                                    </button>
                                </div>
                            ))}
                            {presets.length === 0 && (
                                <p className="text-gray-500 text-sm">Немає збережених пресетів</p>
                            )}
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">Обране обладнання</h2>

                        {items.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🛒</div>
                                <p className="text-gray-500">Кошик порожній</p>
                                <button
                                    onClick={() => navigate('/equipment')}
                                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                                >
                                    Перейти до каталогу
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {items.map(item => (
                                    <div
                                        key={item.equipment.id}
                                        className="flex items-center gap-4 p-4 border rounded"
                                    >
                                        <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                                            <span className="text-2xl">🔧</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold">{item.equipment.name}</h3>
                                            <p className="text-sm text-gray-600">
                                                Інв. №: {item.equipment.inventoryNumber}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Лабораторія: {item.equipment.labName}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.equipment.id, item.quantity - 1)}
                                                    className="w-8 h-8 border rounded hover:bg-gray-100"
                                                >
                                                    -
                                                </button>
                                                <span className="w-12 text-center font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.equipment.id, item.quantity + 1)}
                                                    className="w-8 h-8 border rounded hover:bg-gray-100"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.equipment.id)}
                                                className="text-red-600 hover:text-red-800 ml-2"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={clearCart}
                                    className="text-sm text-red-600 hover:underline"
                                >
                                    Очистити кошик
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                        <h2 className="text-xl font-bold mb-4">Оформлення замовлення</h2>

                        <div className="space-y-4">
                            {/* Accept Partial Checkbox */}
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded">
                                <input
                                    type="checkbox"
                                    id="acceptPartial"
                                    checked={acceptPartial}
                                    onChange={(e) => setAcceptPartial(e.target.checked)}
                                    className="mt-1 w-4 h-4"
                                />
                                <label htmlFor="acceptPartial" className="text-sm cursor-pointer">
                                    <span className="font-medium block mb-1">
                                        Прийняти часткове виконання
                                    </span>
                                    <span className="text-gray-600">
                                        Я погоджуюсь отримати те обладнання, яке є в наявності,
                                        навіть якщо не всі позиції будуть доступні
                                    </span>
                                </label>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Примітки до замовлення
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border rounded"
                                    placeholder="Додаткові побажання або коментарі..."
                                />
                            </div>

                            {/* Summary */}
                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium">Всього позицій:</span>
                                    <span className="font-bold">{getTotalItems()}</span>
                                </div>
                                <div className="text-sm text-gray-600 mb-4">
                                    ⏱️ Обладнання буде заброньовано на 24 години після підтвердження
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmitOrder}
                                disabled={items.length === 0}
                                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                            >
                                {items.length === 0 ? 'Кошик порожній' : 'Відправити заявку'}
                            </button>

                            {items.length > 0 && (
                                <p className="text-xs text-gray-500 text-center">
                                    Після відправки заявки лаборант розгляне ваш запит та зв'яжеться з вами
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
