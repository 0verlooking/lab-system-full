import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { labWorksApi } from '../api/labWorksApi';
import type { LabWork } from '../types/LabWork';

export default function RepositoryPage() {
    const [projects, setProjects] = useState<LabWork[]>([]);
    const [myProjects, setMyProjects] = useState<LabWork[]>([]);
    const [showMy, setShowMy] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const [allProjects, myProjectsData] = await Promise.all([
                labWorksApi.getPublished(),
                labWorksApi.getMy()
            ]);
            setProjects(allProjects);
            setMyProjects(myProjectsData);
        } catch (error) {
            console.error('Error loading projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const displayedProjects = showMy ? myProjects : projects;
    const filteredProjects = displayedProjects.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div className="p-8">Завантаження...</div>;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Репозиторій проектів</h1>
                <Link
                    to="/repository/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Створити проект
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b">
                <button
                    className={`pb-2 px-4 ${!showMy ? 'border-b-2 border-blue-600 font-bold' : 'text-gray-600'}`}
                    onClick={() => setShowMy(false)}
                >
                    Публічні проекти ({projects.length})
                </button>
                <button
                    className={`pb-2 px-4 ${showMy ? 'border-b-2 border-blue-600 font-bold' : 'text-gray-600'}`}
                    onClick={() => setShowMy(true)}
                >
                    Мої проекти ({myProjects.length})
                </button>
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Пошук проектів..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-96 px-4 py-2 border rounded"
                />
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                    <Link
                        key={project.id}
                        to={`/repository/${project.id}`}
                        className="bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden"
                    >
                        <div className="aspect-video bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">Прев'ю проекту</span>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                                {project.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                    {project.authorUsername}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {new Date(project.createdAt).toLocaleDateString('uk-UA')}
                                </span>
                            </div>
                            <div className="mt-3 flex gap-2">
                                <span className={`text-xs px-2 py-1 rounded ${
                                    project.status === 'PUBLISHED'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {project.status}
                                </span>
                                {project.requiredEquipment.length > 0 && (
                                    <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                                        {project.requiredEquipment.length} деталей
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    Проекти не знайдено
                </div>
            )}
        </div>
    );
}
