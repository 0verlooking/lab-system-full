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

    const getRoleBadge = (roleValue: string) => {
        switch (roleValue) {
            case 'ADMIN':
                return <span className="badge badge-rejected">👑 Адміністратор</span>;
            case 'CURATOR':
                return <span className="badge badge-in-use">👨‍🏫 Куратор</span>;
            case 'LABORANT':
                return <span className="badge badge-available">🔬 Лаборант</span>;
            case 'STUDENT':
                return <span className="badge badge-approved">🎓 Студент</span>;
            default:
                return <span className="badge badge-pending">{roleValue}</span>;
        }
    };

    const getProjectStatusBadge = (status: string) => {
        switch (status) {
            case 'PUBLISHED':
                return <span className="badge badge-approved">✓ Опубліковано</span>;
            case 'DRAFT':
                return <span className="badge badge-pending">📝 Чернетка</span>;
            case 'ARCHIVED':
                return <span className="badge" style={{ background: 'var(--gray-100)', color: 'var(--gray-700)' }}>📦 Архів</span>;
            default:
                return <span className="badge badge-pending">{status}</span>;
        }
    };

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">🛡️ Панель адміністратора</h1>
                    <p className="page-description">Управління групами, користувачами та проектами</p>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid var(--gray-200)', paddingBottom: '1rem' }}>
                    <button
                        onClick={() => setActiveTab('groups')}
                        className={activeTab === 'groups' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                    >
                        👥 Групи
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={activeTab === 'users' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                    >
                        👤 Користувачі
                    </button>
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={activeTab === 'projects' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                    >
                        📁 Проекти
                    </button>
                </div>

                {/* Groups Tab */}
                {activeTab === 'groups' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Управління групами</h2>
                            <button
                                onClick={() => setShowGroupForm(!showGroupForm)}
                                className="btn btn-primary"
                            >
                                + Створити групу
                            </button>
                        </div>

                        {showGroupForm && (
                            <div className="card" style={{ marginBottom: '1.5rem' }}>
                                <h3 className="card-header">Нова група</h3>
                                <div className="form">
                                    <div className="grid grid-cols-2">
                                        <div className="form-group">
                                            <label className="form-label">Назва групи</label>
                                            <input
                                                type="text"
                                                value={groupName}
                                                onChange={(e) => setGroupName(e.target.value)}
                                                placeholder="Наприклад: ІПЗ-21"
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Рік вступу</label>
                                            <input
                                                type="number"
                                                value={enrollmentYear}
                                                onChange={(e) => setEnrollmentYear(Number(e.target.value))}
                                                className="form-input"
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                        <button
                                            onClick={handleCreateGroup}
                                            className="btn btn-success"
                                        >
                                            Створити
                                        </button>
                                        <button
                                            onClick={() => setShowGroupForm(false)}
                                            className="btn btn-secondary"
                                        >
                                            Скасувати
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Назва</th>
                                        <th>Куратор</th>
                                        <th>Рік вступу</th>
                                        <th>Студентів</th>
                                        <th>Статус</th>
                                        <th>Дії</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groups.map(group => (
                                        <tr key={group.id}>
                                            <td style={{ fontWeight: '600' }}>{group.name}</td>
                                            <td>{group.curatorName || '-'}</td>
                                            <td>{group.enrollmentYear}</td>
                                            <td>{group.studentCount}</td>
                                            <td>
                                                {group.active ? (
                                                    <span className="badge badge-approved">✓ Активна</span>
                                                ) : (
                                                    <span className="badge" style={{ background: 'var(--gray-100)', color: 'var(--gray-700)' }}>⏸ Неактивна</span>
                                                )}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                    <button
                                                        onClick={() => handleToggleGroupActive(group.id)}
                                                        className="btn btn-sm btn-secondary"
                                                    >
                                                        {group.active ? 'Деактивувати' : 'Активувати'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteGroup(group.id)}
                                                        className="btn btn-sm btn-danger"
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
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Управління користувачами</h2>
                            <button
                                onClick={() => setShowUserForm(!showUserForm)}
                                className="btn btn-primary"
                            >
                                + Запросити користувача
                            </button>
                        </div>

                        {showUserForm && (
                            <div className="card" style={{ marginBottom: '1.5rem' }}>
                                <h3 className="card-header">Запрошення користувача</h3>
                                <div className="form">
                                    <div className="grid grid-cols-2">
                                        <div className="form-group">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                value={inviteEmail}
                                                onChange={(e) => setInviteEmail(e.target.value)}
                                                placeholder="user@example.com"
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Роль</label>
                                            <select
                                                value={selectedRole}
                                                onChange={(e) => setSelectedRole(e.target.value)}
                                                className="form-input"
                                            >
                                                <option value="STUDENT">Студент</option>
                                                <option value="CURATOR">Куратор</option>
                                                <option value="LABORANT">Лаборант</option>
                                                <option value="ADMIN">Адміністратор</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                        <button
                                            onClick={handleInviteUser}
                                            className="btn btn-success"
                                        >
                                            Надіслати запрошення
                                        </button>
                                        <button
                                            onClick={() => setShowUserForm(false)}
                                            className="btn btn-secondary"
                                        >
                                            Скасувати
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Ім'я</th>
                                        <th>Email</th>
                                        <th>Роль</th>
                                        <th>Група</th>
                                        <th>Статус</th>
                                        <th>Дії</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td>
                                                <div>
                                                    <div style={{ fontWeight: '600' }}>{user.firstName} {user.lastName}</div>
                                                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>@{user.username}</div>
                                                </div>
                                            </td>
                                            <td>{user.email}</td>
                                            <td>
                                                {getRoleBadge(user.role)}
                                            </td>
                                            <td>{user.groupName || '-'}</td>
                                            <td>
                                                {user.active ? (
                                                    <span className="badge badge-approved">✓ Активний</span>
                                                ) : (
                                                    <span className="badge badge-rejected">⛔ Заблокований</span>
                                                )}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                    <button
                                                        onClick={() => handleToggleUserActive(user.id)}
                                                        className="btn btn-sm btn-secondary"
                                                    >
                                                        {user.active ? 'Заблокувати' : 'Розблокувати'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="btn btn-sm btn-danger"
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
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Управління проектами</h2>
                            <input
                                type="text"
                                value={projectSearch}
                                onChange={(e) => setProjectSearch(e.target.value)}
                                placeholder="🔍 Пошук проектів..."
                                className="form-input"
                                style={{ width: '350px' }}
                            />
                        </div>

                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Назва</th>
                                        <th>Автор</th>
                                        <th>Дата створення</th>
                                        <th>Статус</th>
                                        <th>Видимість</th>
                                        <th>Дії</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProjects.map(project => (
                                        <tr key={project.id}>
                                            <td>
                                                <button
                                                    onClick={() => navigate(`/repository/${project.id}`)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: 'var(--primary-600)',
                                                        fontWeight: '600',
                                                        cursor: 'pointer',
                                                        textDecoration: 'underline'
                                                    }}
                                                >
                                                    {project.title}
                                                </button>
                                            </td>
                                            <td>{project.authorName}</td>
                                            <td>{new Date(project.createdAt).toLocaleDateString('uk-UA')}</td>
                                            <td>
                                                {getProjectStatusBadge(project.status)}
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleToggleProjectPublic(project.id)}
                                                    className={project.isPublic ? 'badge badge-in-use' : 'badge'}
                                                    style={!project.isPublic ? {
                                                        background: 'var(--gray-100)',
                                                        color: 'var(--gray-700)',
                                                        cursor: 'pointer'
                                                    } : { cursor: 'pointer' }}
                                                >
                                                    {project.isPublic ? '🌐 Публічний' : '🔒 Приватний'}
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleArchiveProject(project.id)}
                                                    className="btn btn-sm btn-secondary"
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
        </div>
    );
}
