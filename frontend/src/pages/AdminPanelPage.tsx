import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Tab = 'groups' | 'users' | 'projects';

interface Group {
    id: number;
    name: string;
    curatorName?: string;
    enrollmentYear?: number;
    studentCount: number;
    active: boolean;
}

interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    groupName?: string;
    active: boolean;
}

interface Project {
    id: number;
    title: string;
    authorName: string;
    status: string;
    isPublic: boolean;
    createdAt: string;
}

export default function AdminPanelPage() {
    const navigate = useNavigate();
    const { role } = useAuth();

    const [activeTab, setActiveTab] = useState<Tab>('groups');

    // Groups
    const [groups, setGroups] = useState<Group[]>([]);
    const [showGroupForm, setShowGroupForm] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [enrollmentYear, setEnrollmentYear] = useState(new Date().getFullYear());

    // Users
    const [users, setUsers] = useState<User[]>([]);
    const [showUserForm, setShowUserForm] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState('STUDENT');

    // Projects
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectSearch, setProjectSearch] = useState('');

    useEffect(() => {
        // Check if user is admin
        if (role !== 'ADMIN') {
            alert('Доступ заборонено. Тільки адміністратори можуть переглядати цю сторінку.');
            navigate('/');
            return;
        }

        loadData();
    }, [role, navigate]);

    const loadData = async () => {
        // In real app, load from API
        // Mock data for demonstration
        setGroups([
            { id: 1, name: 'ІПЗ-21', curatorName: 'Іваненко І.І.', enrollmentYear: 2021, studentCount: 25, active: true },
            { id: 2, name: 'КН-21', curatorName: 'Петренко П.П.', enrollmentYear: 2021, studentCount: 30, active: true },
            { id: 3, name: 'ІПЗ-20', curatorName: 'Сидоренко С.С.', enrollmentYear: 2020, studentCount: 22, active: false }
        ]);

        setUsers([
            { id: 1, username: 'admin', firstName: 'Адміністратор', lastName: 'Системи', email: 'admin@lab.system', role: 'ADMIN', active: true },
            { id: 2, username: 'student1', firstName: 'Іван', lastName: 'Іваненко', email: 'ivan@student.com', role: 'STUDENT', groupName: 'ІПЗ-21', active: true },
            { id: 3, username: 'curator1', firstName: 'Петро', lastName: 'Петренко', email: 'petro@teacher.com', role: 'CURATOR', active: true }
        ]);

        setProjects([
            { id: 1, title: 'Arduino метеостанція', authorName: 'Іван Іваненко', status: 'PUBLISHED', isPublic: true, createdAt: '2024-01-15' },
            { id: 2, title: 'IoT розумний дім', authorName: 'Петро Петренко', status: 'DRAFT', isPublic: false, createdAt: '2024-01-20' },
            { id: 3, title: 'Робототехніка', authorName: 'Сидор Сидоренко', status: 'ARCHIVED', isPublic: false, createdAt: '2023-12-01' }
        ]);
    };

    // Group Management
    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            alert('Введіть назву групи');
            return;
        }

        // In real app, call API
        console.log('Creating group:', { groupName, enrollmentYear });
        alert('Групу створено!');
        setShowGroupForm(false);
        setGroupName('');
        loadData();
    };

    const handleDeleteGroup = async (id: number) => {
        if (!confirm('Ви впевнені, що хочете видалити цю групу?')) {
            return;
        }

        // In real app, call API
        console.log('Deleting group:', id);
        alert('Групу видалено!');
        loadData();
    };

    const handleToggleGroupActive = async (id: number) => {
        // In real app, call API
        console.log('Toggling group active:', id);
        loadData();
    };

    // User Management
    const handleInviteUser = async () => {
        if (!inviteEmail.trim()) {
            alert('Введіть email користувача');
            return;
        }

        // In real app, call API to send invitation
        console.log('Inviting user:', { inviteEmail, selectedRole });
        alert(`Запрошення надіслано на ${inviteEmail}`);
        setShowUserForm(false);
        setInviteEmail('');
    };

    const handleChangeUserRole = async (userId: number, newRole: string) => {
        if (!confirm(`Змінити роль користувача на ${newRole}?`)) {
            return;
        }

        // In real app, call API
        console.log('Changing user role:', { userId, newRole });
        alert('Роль користувача змінено!');
        loadData();
    };

    const handleToggleUserActive = async (userId: number) => {
        // In real app, call API
        console.log('Toggling user active:', userId);
        loadData();
    };

    const handleDeleteUser = async (userId: number) => {
        if (!confirm('Ви впевнені, що хочете видалити цього користувача?')) {
            return;
        }

        // In real app, call API
        console.log('Deleting user:', userId);
        alert('Користувача видалено!');
        loadData();
    };

    // Project Management
    const handleToggleProjectPublic = async (projectId: number) => {
        // In real app, call API
        console.log('Toggling project public:', projectId);
        loadData();
    };

    const handleArchiveProject = async (projectId: number) => {
        if (!confirm('Архівувати цей проект?')) {
            return;
        }

        // In real app, call API
        console.log('Archiving project:', projectId);
        alert('Проект архівовано!');
        loadData();
    };

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.authorName.toLowerCase().includes(projectSearch.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Панель адміністратора</h1>
                <p className="text-gray-600">Управління групами, користувачами та проектами</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b">
                <button
                    onClick={() => setActiveTab('groups')}
                    className={`px-6 py-3 font-medium ${
                        activeTab === 'groups'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    👥 Групи
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-6 py-3 font-medium ${
                        activeTab === 'users'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    👤 Користувачі
                </button>
                <button
                    onClick={() => setActiveTab('projects')}
                    className={`px-6 py-3 font-medium ${
                        activeTab === 'projects'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    📁 Проекти
                </button>
            </div>

            {/* Groups Tab */}
            {activeTab === 'groups' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Управління групами</h2>
                        <button
                            onClick={() => setShowGroupForm(!showGroupForm)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            + Створити групу
                        </button>
                    </div>

                    {showGroupForm && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="font-bold mb-4">Нова група</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Назва групи</label>
                                    <input
                                        type="text"
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        placeholder="Наприклад: ІПЗ-21"
                                        className="w-full px-4 py-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Рік вступу</label>
                                    <input
                                        type="number"
                                        value={enrollmentYear}
                                        onChange={(e) => setEnrollmentYear(Number(e.target.value))}
                                        className="w-full px-4 py-2 border rounded"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={handleCreateGroup}
                                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                                >
                                    Створити
                                </button>
                                <button
                                    onClick={() => setShowGroupForm(false)}
                                    className="border px-6 py-2 rounded hover:bg-gray-50"
                                >
                                    Скасувати
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Назва</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Куратор</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Рік вступу</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Студентів</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Статус</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Дії</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {groups.map(group => (
                                    <tr key={group.id}>
                                        <td className="px-6 py-4 font-medium">{group.name}</td>
                                        <td className="px-6 py-4">{group.curatorName || '-'}</td>
                                        <td className="px-6 py-4">{group.enrollmentYear}</td>
                                        <td className="px-6 py-4">{group.studentCount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                group.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {group.active ? 'Активна' : 'Неактивна'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleToggleGroupActive(group.id)}
                                                    className="text-sm text-blue-600 hover:underline"
                                                >
                                                    {group.active ? 'Деактивувати' : 'Активувати'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteGroup(group.id)}
                                                    className="text-sm text-red-600 hover:underline"
                                                >
                                                    Видалити
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Управління користувачами</h2>
                        <button
                            onClick={() => setShowUserForm(!showUserForm)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            + Запросити користувача
                        </button>
                    </div>

                    {showUserForm && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="font-bold mb-4">Запрошення користувача</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        placeholder="user@example.com"
                                        className="w-full px-4 py-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Роль</label>
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-full px-4 py-2 border rounded"
                                    >
                                        <option value="STUDENT">Студент</option>
                                        <option value="CURATOR">Куратор</option>
                                        <option value="LABORANT">Лаборант</option>
                                        <option value="ADMIN">Адміністратор</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={handleInviteUser}
                                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                                >
                                    Надіслати запрошення
                                </button>
                                <button
                                    onClick={() => setShowUserForm(false)}
                                    className="border px-6 py-2 rounded hover:bg-gray-50"
                                >
                                    Скасувати
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Ім'я</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Роль</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Група</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Статус</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Дії</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium">{user.firstName} {user.lastName}</div>
                                                <div className="text-sm text-gray-500">@{user.username}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleChangeUserRole(user.id, e.target.value)}
                                                className="px-2 py-1 border rounded text-sm"
                                            >
                                                <option value="STUDENT">Студент</option>
                                                <option value="CURATOR">Куратор</option>
                                                <option value="LABORANT">Лаборант</option>
                                                <option value="ADMIN">Адміністратор</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">{user.groupName || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                user.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {user.active ? 'Активний' : 'Заблокований'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleToggleUserActive(user.id)}
                                                    className="text-sm text-blue-600 hover:underline"
                                                >
                                                    {user.active ? 'Заблокувати' : 'Розблокувати'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="text-sm text-red-600 hover:underline"
                                                >
                                                    Видалити
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Управління проектами</h2>
                        <input
                            type="text"
                            value={projectSearch}
                            onChange={(e) => setProjectSearch(e.target.value)}
                            placeholder="Пошук проектів..."
                            className="px-4 py-2 border rounded w-64"
                        />
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Назва</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Автор</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Дата створення</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Статус</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Видимість</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Дії</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredProjects.map(project => (
                                    <tr key={project.id}>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => navigate(`/repository/${project.id}`)}
                                                className="font-medium text-blue-600 hover:underline"
                                            >
                                                {project.title}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">{project.authorName}</td>
                                        <td className="px-6 py-4">
                                            {new Date(project.createdAt).toLocaleDateString('uk-UA')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                project.status === 'PUBLISHED'
                                                    ? 'bg-green-100 text-green-800'
                                                    : project.status === 'DRAFT'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleProjectPublic(project.id)}
                                                className={`px-2 py-1 rounded text-xs ${
                                                    project.isPublic
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {project.isPublic ? '🌐 Публічний' : '🔒 Приватний'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleArchiveProject(project.id)}
                                                className="text-sm text-orange-600 hover:underline"
                                            >
                                                Архівувати
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
