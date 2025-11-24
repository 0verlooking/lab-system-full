import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { labWorksApi } from '../api/labWorksApi';
import { equipmentApi } from '../api/equipmentApi';
import type { Equipment } from '../types/Equipment';
import type { LabWorkCreateRequest, LabWorkUpdateRequest } from '../types/LabWork';

export default function ProjectFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);

    // Form fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<number[]>([]);
    const [isPublic, setIsPublic] = useState(false);

    // Available equipment for selection
    const [allEquipment, setAllEquipment] = useState<Equipment[]>([]);
    const [equipmentSearch, setEquipmentSearch] = useState('');

    // Photo placeholders
    const [photos, setPhotos] = useState({
        schema: null as File | null,
        result: null as File | null,
        algorithm: null as File | null,
        process: null as File | null
    });

    useEffect(() => {
        loadEquipment();
        if (isEditMode) {
            loadProject();
        }
    }, [id]);

    const loadEquipment = async () => {
        try {
            const equipment = await equipmentApi.getAll();
            setAllEquipment(equipment);
        } catch (error) {
            console.error('Error loading equipment:', error);
        }
    };

    const loadProject = async () => {
        if (!id) return;

        try {
            const project = await labWorksApi.getById(Number(id));
            setTitle(project.title);
            setDescription(project.description || '');
            setSelectedEquipmentIds(project.requiredEquipment.map(e => e.id));
            // isPublic will be added to LabWork type
        } catch (error) {
            console.error('Error loading project:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEquipmentToggle = (equipmentId: number) => {
        setSelectedEquipmentIds(prev =>
            prev.includes(equipmentId)
                ? prev.filter(id => id !== equipmentId)
                : [...prev, equipmentId]
        );
    };

    const handlePhotoChange = (type: keyof typeof photos, file: File | null) => {
        setPhotos(prev => ({ ...prev, [type]: file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('Введіть назву проекту');
            return;
        }

        setSaving(true);
        try {
            if (isEditMode) {
                const updateData: LabWorkUpdateRequest = {
                    title,
                    description,
                    equipmentIds: selectedEquipmentIds
                };
                await labWorksApi.update(Number(id), updateData);
                alert('Проект оновлено успішно!');
                navigate(`/repository/${id}`);
            } else {
                const createData: LabWorkCreateRequest = {
                    title,
                    description,
                    equipmentIds: selectedEquipmentIds
                };
                const created = await labWorksApi.create(createData);
                alert('Проект створено успішно!');
                navigate(`/repository/${created.id}`);
            }
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Помилка при збереженні проекту');
        } finally {
            setSaving(false);
        }
    };

    const filteredEquipment = allEquipment.filter(eq =>
        eq.name.toLowerCase().includes(equipmentSearch.toLowerCase()) ||
        eq.inventoryNumber.toLowerCase().includes(equipmentSearch.toLowerCase())
    );

    const selectedEquipment = allEquipment.filter(eq => selectedEquipmentIds.includes(eq.id));

    if (loading) {
        return <div className="p-8">Завантаження...</div>;
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">
                    {isEditMode ? 'Редагувати проект' : 'Створити проект'}
                </h1>
                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-600 hover:text-gray-900"
                >
                    ← Назад
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Назва проекту <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Введіть назву проекту"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Опис та алгоритм роботи
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={10}
                        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Детальний опис проекту, алгоритм роботи, блок-схеми тощо..."
                    />
                </div>

                {/* Photos Section */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Фотографії проекту
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { key: 'schema', label: 'Схема проекту' },
                            { key: 'result', label: 'Результат роботи' },
                            { key: 'algorithm', label: 'Блок-схема алгоритму' },
                            { key: 'process', label: 'Процес виконання' }
                        ].map(({ key, label }) => (
                            <div key={key} className="border rounded p-4">
                                <p className="text-sm font-medium mb-2">{label}</p>
                                <div className="bg-gray-100 rounded h-32 flex items-center justify-center mb-2">
                                    {photos[key as keyof typeof photos] ? (
                                        <span className="text-sm text-green-600">
                                            ✓ {photos[key as keyof typeof photos]?.name}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">Без фото</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handlePhotoChange(
                                        key as keyof typeof photos,
                                        e.target.files?.[0] || null
                                    )}
                                    className="text-sm"
                                />
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Примітка: Завантаження фото буде реалізовано в наступній версії
                    </p>
                </div>

                {/* Selected Equipment Display */}
                {selectedEquipment.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Обране обладнання ({selectedEquipment.length})
                        </label>
                        <div className="space-y-2">
                            {selectedEquipment.map(eq => (
                                <div
                                    key={eq.id}
                                    className="flex items-center justify-between p-3 bg-blue-50 rounded"
                                >
                                    <div>
                                        <span className="font-medium">{eq.name}</span>
                                        <span className="text-sm text-gray-600 ml-2">
                                            (Інв. №: {eq.inventoryNumber})
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleEquipmentToggle(eq.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Видалити
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Equipment Selector */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Додати обладнання
                    </label>
                    <input
                        type="text"
                        value={equipmentSearch}
                        onChange={(e) => setEquipmentSearch(e.target.value)}
                        placeholder="Пошук обладнання..."
                        className="w-full px-4 py-2 border rounded mb-3"
                    />
                    <div className="border rounded max-h-64 overflow-y-auto">
                        {filteredEquipment.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                Обладнання не знайдено
                            </div>
                        ) : (
                            filteredEquipment.map(eq => (
                                <div
                                    key={eq.id}
                                    className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                                        selectedEquipmentIds.includes(eq.id) ? 'bg-blue-50' : ''
                                    }`}
                                    onClick={() => handleEquipmentToggle(eq.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-medium">{eq.name}</span>
                                            <span className="text-sm text-gray-600 ml-2">
                                                Інв. №: {eq.inventoryNumber}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-1 rounded ${
                                                eq.status === 'AVAILABLE'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {eq.status === 'AVAILABLE' ? 'Доступно' : 'Недоступно'}
                                            </span>
                                            {selectedEquipmentIds.includes(eq.id) && (
                                                <span className="text-blue-600">✓</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Public/Private Toggle */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="isPublic"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="w-4 h-4"
                    />
                    <label htmlFor="isPublic" className="text-sm font-medium cursor-pointer">
                        Зробити проект публічним (інші студенти зможуть його бачити)
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {saving ? 'Збереження...' : isEditMode ? 'Зберегти зміни' : 'Створити проект'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 border rounded hover:bg-gray-50"
                    >
                        Скасувати
                    </button>
                </div>
            </form>
        </div>
    );
}
