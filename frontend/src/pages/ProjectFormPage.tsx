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
                <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div>
                        <h1 className="page-title">
                            {isEditMode ? '✏️ Редагувати проект' : '✨ Створити проект'}
                        </h1>
                        <p className="page-description">
                            {isEditMode ? 'Внесіть зміни до існуючого проекту' : 'Заповніть форму для створення нового проекту'}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-secondary btn-sm"
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        ← Назад
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Basic Info Card */}
                    <div className="card">
                        <h2 className="card-header">📝 Основна інформація</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label className="form-label">
                                    Назва проекту <span style={{ color: 'var(--danger-500)' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="form-input"
                                    placeholder="Наприклад: Arduino метеостанція"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Опис та алгоритм роботи
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={10}
                                    className="form-textarea"
                                    placeholder="Детальний опис проекту, принцип роботи, використані технології, алгоритм виконання..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Photos Card */}
                    <div className="card">
                        <h2 className="card-header">📸 Фотографії проекту</h2>
                        <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                            {[
                                { key: 'schema', label: '📐 Схема проекту', icon: '🔷' },
                                { key: 'result', label: '✅ Результат роботи', icon: '🎯' },
                                { key: 'algorithm', label: '🔄 Блок-схема', icon: '📊' },
                                { key: 'process', label: '⚙️ Процес виконання', icon: '🔧' }
                            ].map(({ key, label, icon }) => (
                                <div key={key} style={{
                                    padding: '1.5rem',
                                    border: '2px dashed var(--gray-300)',
                                    borderRadius: '12px',
                                    background: 'var(--gray-50)',
                                    transition: 'all var(--transition-base)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--primary-400)';
                                    e.currentTarget.style.background = 'var(--primary-50)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--gray-300)';
                                    e.currentTarget.style.background = 'var(--gray-50)';
                                }}>
                                    <p style={{ fontWeight: '600', marginBottom: '1rem', color: 'var(--gray-700)' }}>{label}</p>
                                    <div style={{
                                        background: 'white',
                                        borderRadius: '8px',
                                        height: '120px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '1rem',
                                        border: '1px solid var(--gray-200)'
                                    }}>
                                        {photos[key as keyof typeof photos] ? (
                                            <span style={{ color: 'var(--success-600)', fontWeight: '600' }}>
                                                ✓ {photos[key as keyof typeof photos]?.name}
                                            </span>
                                        ) : (
                                            <span style={{ fontSize: '3rem' }}>{icon}</span>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handlePhotoChange(
                                            key as keyof typeof photos,
                                            e.target.files?.[0] || null
                                        )}
                                        style={{ fontSize: '0.875rem' }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="alert alert-info" style={{ marginTop: '1rem' }}>
                            💡 Завантаження фотографій буде повністю реалізовано в наступній версії
                        </div>
                    </div>

                    {/* Selected Equipment Card */}
                    {selectedEquipment.length > 0 && (
                        <div className="card">
                            <h2 className="card-header">✅ Обране обладнання ({selectedEquipment.length})</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {selectedEquipment.map(eq => (
                                    <div
                                        key={eq.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '1rem 1.25rem',
                                            background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--success-50) 100%)',
                                            borderRadius: '10px',
                                            border: '2px solid var(--primary-100)',
                                            transition: 'all var(--transition-base)'
                                        }}
                                    >
                                        <div>
                                            <span style={{ fontWeight: '600', color: 'var(--gray-800)' }}>{eq.name}</span>
                                            <span style={{ marginLeft: '0.75rem', color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                                                (Інв. №: {eq.inventoryNumber})
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleEquipmentToggle(eq.id)}
                                            className="btn btn-danger btn-sm"
                                        >
                                            🗑️ Видалити
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Equipment Selector Card */}
                    <div className="card">
                        <h2 className="card-header">🔧 Додати обладнання</h2>
                        <input
                            type="text"
                            value={equipmentSearch}
                            onChange={(e) => setEquipmentSearch(e.target.value)}
                            placeholder="🔍 Пошук обладнання за назвою або інвентарним номером..."
                            className="form-input"
                            style={{ marginBottom: '1.25rem' }}
                        />
                        <div style={{
                            border: '2px solid var(--gray-200)',
                            borderRadius: '10px',
                            maxHeight: '400px',
                            overflowY: 'auto',
                            background: 'white'
                        }}>
                            {filteredEquipment.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon">🔍</div>
                                    <h3 className="empty-state-title">Обладнання не знайдено</h3>
                                    <p className="empty-state-description">Спробуйте змінити критерії пошуку</p>
                                </div>
                            ) : (
                                filteredEquipment.map(eq => (
                                    <div
                                        key={eq.id}
                                        onClick={() => handleEquipmentToggle(eq.id)}
                                        style={{
                                            padding: '1rem 1.25rem',
                                            borderBottom: '1px solid var(--gray-100)',
                                            cursor: 'pointer',
                                            transition: 'all var(--transition-fast)',
                                            background: selectedEquipmentIds.includes(eq.id) ? 'var(--primary-50)' : 'transparent'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!selectedEquipmentIds.includes(eq.id)) {
                                                e.currentTarget.style.background = 'var(--gray-50)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!selectedEquipmentIds.includes(eq.id)) {
                                                e.currentTarget.style.background = 'transparent';
                                            }
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div>
                                                <span style={{ fontWeight: '600', color: 'var(--gray-800)' }}>{eq.name}</span>
                                                <span style={{ marginLeft: '0.75rem', color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                                                    Інв. №: {eq.inventoryNumber}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <span className={
                                                    eq.status === 'AVAILABLE' ? 'badge badge-available' : 'badge badge-in-use'
                                                }>
                                                    {eq.status === 'AVAILABLE' ? '✓ Доступно' : '⚠ Недоступно'}
                                                </span>
                                                {selectedEquipmentIds.includes(eq.id) && (
                                                    <span style={{ color: 'var(--primary-600)', fontWeight: 'bold', fontSize: '1.25rem' }}>✓</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Settings Card */}
                    <div className="card">
                        <h2 className="card-header">⚙️ Налаштування</h2>
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '1rem',
                            padding: '1.25rem',
                            background: 'var(--primary-50)',
                            borderRadius: '10px',
                            border: '2px solid var(--primary-100)'
                        }}>
                            <input
                                type="checkbox"
                                id="isPublic"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                                style={{ marginTop: '0.25rem', width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label htmlFor="isPublic" style={{ cursor: 'pointer', flex: 1 }}>
                                <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: 'var(--gray-800)' }}>
                                    🌐 Зробити проект публічним
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                                    Інші студенти зможуть переглядати цей проект і використовувати його як основу для своїх робіт
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        paddingTop: '1rem',
                        borderTop: '2px solid var(--gray-200)',
                        position: 'sticky',
                        bottom: '0',
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow-xl)'
                    }}>
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn btn-success"
                            style={{ flex: 1 }}
                        >
                            {saving ? '⏳ Збереження...' : isEditMode ? '✓ Зберегти зміни' : '✨ Створити проект'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="btn btn-secondary"
                        >
                            ✕ Скасувати
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
