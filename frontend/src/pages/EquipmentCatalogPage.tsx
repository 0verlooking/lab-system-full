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
        // Show feedback
        const feedback = document.createElement('div');
        feedback.textContent = '✓ Додано до кошика';
        feedback.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50';
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 2000);
    };

    // Filter and sort equipment
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
        return <div className="p-8">Завантаження...</div>;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Каталог обладнання</h1>
                    <p className="text-gray-600 mt-1">Огляд та замовлення обладнання</p>
                </div>
                <button
                    onClick={() => navigate('/cart')}
                    className="relative bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    🛒 Кошик
                    {getCartCount() > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                            {getCartCount()}
                        </span>
                    )}
                </button>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Пошук</label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Назва або інвентарний номер..."
                            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Lab Filter */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Лабораторія</label>
                        <select
                            value={selectedLab}
                            onChange={(e) => setSelectedLab(e.target.value)}
                            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Всі лабораторії</option>
                            {labs.map(lab => (
                                <option key={lab.id} value={lab.id.toString()}>
                                    {lab.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Статус</label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Всі статуси</option>
                            <option value={EquipmentStatus.AVAILABLE}>В наявності</option>
                            <option value={EquipmentStatus.IN_USE}>Використовується</option>
                            <option value={EquipmentStatus.MAINTENANCE}>На обслуговуванні</option>
                            <option value={EquipmentStatus.BROKEN}>Зламане</option>
                        </select>
                    </div>
                </div>

                {/* Sort */}
                <div className="mt-4 flex items-center gap-3">
                    <span className="text-sm font-medium">Сортувати за:</span>
                    <button
                        onClick={() => setSortBy('name')}
                        className={`px-3 py-1 rounded text-sm ${
                            sortBy === 'name'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Назвою
                    </button>
                    <button
                        onClick={() => setSortBy('status')}
                        className={`px-3 py-1 rounded text-sm ${
                            sortBy === 'status'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Статусом
                    </button>
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 text-gray-600">
                Знайдено: {filteredEquipment.length} з {equipment.length}
            </div>

            {/* Equipment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEquipment.map(item => (
                    <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-xl transition">
                        <div className="p-6">
                            {/* Equipment Image Placeholder */}
                            <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
                                <span className="text-4xl">🔧</span>
                            </div>

                            {/* Equipment Info */}
                            <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Інв. №: {item.inventoryNumber}
                            </p>
                            <p className="text-sm text-gray-600 mb-3">
                                Лабораторія: {item.labName}
                            </p>

                            {/* Status Badge */}
                            <div className="mb-4">
                                <span className={`inline-block px-3 py-1 rounded text-sm ${
                                    item.status === EquipmentStatus.AVAILABLE
                                        ? 'bg-green-100 text-green-800'
                                        : item.status === EquipmentStatus.IN_USE
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : item.status === EquipmentStatus.MAINTENANCE
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {getStatusLabel(item.status)}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="space-y-2">
                                {item.status === EquipmentStatus.AVAILABLE ? (
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        + Додати до кошика
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            disabled
                                            className="w-full bg-gray-300 text-gray-600 px-4 py-2 rounded cursor-not-allowed"
                                        >
                                            Недоступно
                                        </button>
                                        {item.documentationLink && (
                                            <a
                                                href={item.documentationLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full text-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                            >
                                                📦 Замовити онлайн
                                            </a>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredEquipment.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold mb-2">Нічого не знайдено</h3>
                    <p>Спробуйте змінити параметри пошуку</p>
                </div>
            )}
        </div>
    );
}
