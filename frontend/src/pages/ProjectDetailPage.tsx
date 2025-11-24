import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { labWorksApi } from '../api/labWorksApi';
import type { LabWork } from '../types/LabWork';

export default function ProjectDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<LabWork | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthor, setIsAuthor] = useState(false);

    useEffect(() => {
        loadProject();
    }, [id]);

    const loadProject = async () => {
        try {
            if (!id) return;
            const data = await labWorksApi.getById(Number(id));
            setProject(data);

            // Check if current user is author (simplified)
            const username = localStorage.getItem('auth_username');
            setIsAuthor(data.authorUsername === username);
        } catch (error) {
            console.error('Error loading project:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8">Завантаження...</div>;
    }

    if (!project) {
        return <div className="p-8">Проект не знайдено</div>;
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-600 hover:underline"
            >
                ← Назад
            </button>

            <div className="bg-white rounded-lg shadow p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                        <p className="text-gray-600">Автор: {project.authorUsername}</p>
                    </div>
                    {isAuthor && (
                        <button
                            onClick={() => navigate(`/repository/${id}/edit`)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Редагувати
                        </button>
                    )}
                </div>

                {/* Photos Section */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Фотографії проекту</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="aspect-square bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-400">Схема</span>
                        </div>
                        <div className="aspect-square bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-400">Результат</span>
                        </div>
                        <div className="aspect-square bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-400">Алгоритм</span>
                        </div>
                        <div className="aspect-square bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-400">Процес</span>
                        </div>
                    </div>
                </section>

                {/* Description */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Опис та алгоритм роботи</h2>
                    <div className="prose max-w-none">
                        <p className="whitespace-pre-wrap">{project.description}</p>
                    </div>
                </section>

                {/* Required Equipment */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Необхідне обладнання</h2>
                    <div className="space-y-3">
                        {project.requiredEquipment.map(equipment => (
                            <div key={equipment.id} className="flex items-center gap-4 p-4 border rounded">
                                <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                                    <span className="text-xs text-gray-400">фото</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold">{equipment.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        Інв. №: {equipment.inventoryNumber}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded text-sm ${
                                        equipment.status === 'AVAILABLE'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {equipment.status === 'AVAILABLE' ? 'В наявності' : 'Недоступно'}
                                    </span>
                                    {equipment.status !== 'AVAILABLE' && equipment.documentationLink && (
                                        <a
                                            href={equipment.documentationLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block text-sm text-blue-600 hover:underline mt-1"
                                        >
                                            Купити онлайн
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Comments Section */}
                <section>
                    <h2 className="text-xl font-bold mb-4">Коментарі</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded">
                            <textarea
                                className="w-full border rounded p-2"
                                rows={3}
                                placeholder="Додати коментар..."
                            />
                            <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Відправити
                            </button>
                        </div>
                        {/* Comments will be loaded here */}
                        <p className="text-gray-500">Коментарів поки немає</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
