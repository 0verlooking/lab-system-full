import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { labWorksApi } from '../api/labWorksApi';
import { newsApi } from '../api/newsApi';
import type { LabWork } from '../types/LabWork';
import type { News } from '../types/News';

export default function HomePage() {
    const [recentProjects, setRecentProjects] = useState<LabWork[]>([]);
    const [news, setNews] = useState<News[]>([]);
    const [myProjects, setMyProjects] = useState<LabWork[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [newsData, myProjectsData, allProjects] = await Promise.all([
                newsApi.getActive(),
                labWorksApi.getMy(),
                labWorksApi.getAll()
            ]);
            setNews(newsData.slice(0, 5));
            setMyProjects(myProjectsData);
            setRecentProjects(allProjects.slice(0, 6));
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8">Завантаження...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Головна</h1>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Мої проекти</h3>
                    <p className="text-3xl font-bold">{myProjects.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">В роботі</h3>
                    <p className="text-3xl font-bold">
                        {myProjects.filter(p => p.status === 'DRAFT').length}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Завершені</h3>
                    <p className="text-3xl font-bold">
                        {myProjects.filter(p => p.status === 'PUBLISHED').length}
                    </p>
                </div>
            </div>

            {/* News Section */}
            <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Новини та оголошення</h2>
                    <Link to="/news" className="text-blue-600 hover:underline">
                        Всі новини →
                    </Link>
                </div>
                <div className="space-y-4">
                    {news.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-lg shadow">
                            <div className="flex items-start gap-4">
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">{item.title}</h3>
                                    <p className="text-gray-600 mt-2">{item.content}</p>
                                    <p className="text-sm text-gray-400 mt-2">
                                        {new Date(item.createdAt).toLocaleDateString('uk-UA')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recent Projects */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Нещодавні проекти</h2>
                    <Link to="/repository" className="text-blue-600 hover:underline">
                        Всі проекти →
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentProjects.map(project => (
                        <Link
                            key={project.id}
                            to={`/repository/${project.id}`}
                            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
                        >
                            <div className="aspect-video bg-gray-200 rounded mb-3 flex items-center justify-center">
                                <span className="text-gray-400">Фото проекту</span>
                            </div>
                            <h3 className="font-bold">{project.title}</h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {project.description}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-xs text-gray-500">
                                    {project.authorUsername}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded ${
                                    project.status === 'PUBLISHED'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {project.status}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
