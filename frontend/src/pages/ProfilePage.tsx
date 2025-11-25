import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
    const { role } = useAuth();

    // Profile fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [studentId, setStudentId] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [groupName, setGroupName] = useState('');
    const [curatorName, setCuratorName] = useState('');

    // 2FA settings
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);
    const [totpCode, setTotpCode] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    // Password change
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Photo upload
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        // In real app, load from API
        // Mock data
        setFirstName('Іван');
        setLastName('Іваненко');
        setMiddleName('Петрович');
        setEmail('ivan@student.com');
        setPhoneNumber('+380501234567');
        setStudentId('ST123456');
        setGroupName('ІПЗ-21');
        setCuratorName('Петренко П.П.');
        setTwoFactorEnabled(false);
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            // In real app, call API
            console.log('Saving profile:', {
                firstName,
                lastName,
                middleName,
                email,
                phoneNumber,
                studentId,
                photoFile: photoFile?.name
            });

            alert('Профіль збережено успішно!');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Помилка при збереженні профілю');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Заповніть всі поля');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('Нові паролі не співпадають');
            return;
        }

        if (newPassword.length < 6) {
            alert('Пароль повинен містити мінімум 6 символів');
            return;
        }

        try {
            // In real app, call API
            console.log('Changing password');
            alert('Пароль успішно змінено!');
            setShowPasswordForm(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Error changing password:', error);
            alert('Помилка при зміні пароля');
        }
    };

    const handleEnable2FA = async () => {
        try {
            // In real app, call API to generate QR code
            // Mock QR code URL
            setQrCodeUrl('https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=otpauth://totp/LabSystem:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=LabSystem');
            setShowQRCode(true);
        } catch (error) {
            console.error('Error enabling 2FA:', error);
            alert('Помилка при налаштуванні 2FA');
        }
    };

    const handleVerify2FA = async () => {
        if (!totpCode || totpCode.length !== 6) {
            alert('Введіть 6-значний код');
            return;
        }

        try {
            // In real app, verify code via API
            console.log('Verifying 2FA code:', totpCode);
            setTwoFactorEnabled(true);
            setShowQRCode(false);
            setTotpCode('');
            alert('2FA успішно увімкнено!');
        } catch (error) {
            console.error('Error verifying 2FA:', error);
            alert('Невірний код або помилка перевірки');
        }
    };

    const handleDisable2FA = async () => {
        if (!confirm('Ви впевнені, що хочете вимкнути двофакторну автентифікацію?')) {
            return;
        }

        try {
            // In real app, call API
            console.log('Disabling 2FA');
            setTwoFactorEnabled(false);
            alert('2FA вимкнено');
        } catch (error) {
            console.error('Error disabling 2FA:', error);
            alert('Помилка при вимкненні 2FA');
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            // Create preview URL
            const url = URL.createObjectURL(file);
            setPhotoUrl(url);
        }
    };

    const getRoleBadge = () => {
        switch (role) {
            case 'ADMIN':
                return <span className="badge badge-rejected">👑 Адміністратор</span>;
            case 'CURATOR':
                return <span className="badge badge-in-use">👨‍🏫 Куратор</span>;
            case 'LABORANT':
                return <span className="badge badge-available">🔬 Лаборант</span>;
            case 'STUDENT':
                return <span className="badge badge-approved">🎓 Студент</span>;
            default:
                return <span className="badge badge-pending">{role}</span>;
        }
    };

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: '1200px' }}>
                <div className="page-header">
                    <h1 className="page-title">👤 Профіль користувача</h1>
                    <p className="page-description">Керування особистою інформацією та налаштуваннями</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem' }}>
                    {/* Left Column - Photo and Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Profile Photo */}
                        <div className="card">
                            <h2 className="card-header">📸 Фото профілю</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{
                                    width: '150px',
                                    height: '150px',
                                    borderRadius: '50%',
                                    background: photoUrl ? 'none' : 'linear-gradient(135deg, var(--primary-100), var(--primary-200))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.5rem',
                                    overflow: 'hidden',
                                    border: '4px solid var(--primary-500)',
                                    boxShadow: 'var(--shadow-lg)'
                                }}>
                                    {photoUrl ? (
                                        <img src={photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ fontSize: '4rem' }}>👤</span>
                                    )}
                                </div>
                                <label style={{
                                    cursor: 'pointer',
                                    padding: '0.75rem 1.5rem',
                                    background: 'var(--primary-50)',
                                    border: '2px dashed var(--primary-400)',
                                    borderRadius: '8px',
                                    color: 'var(--primary-700)',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    textAlign: 'center',
                                    transition: 'all var(--transition-fast)'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = 'var(--primary-100)';
                                    e.currentTarget.style.borderColor = 'var(--primary-600)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'var(--primary-50)';
                                    e.currentTarget.style.borderColor = 'var(--primary-400)';
                                }}
                                >
                                    📁 Виберіть файл
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                                {photoFile && (
                                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-600)', marginTop: '0.5rem' }}>
                                        {photoFile.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Role and Group Info */}
                        <div className="card">
                            <h2 className="card-header">ℹ️ Інформація</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>Роль:</div>
                                    {getRoleBadge()}
                                </div>
                                {groupName && (
                                    <div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>Група:</div>
                                        <div style={{ fontWeight: '600', color: 'var(--gray-800)' }}>{groupName}</div>
                                    </div>
                                )}
                                {curatorName && (
                                    <div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>Куратор:</div>
                                        <div style={{ fontWeight: '600', color: 'var(--gray-800)' }}>{curatorName}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Forms */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Personal Information */}
                        <div className="card">
                            <h2 className="card-header">📝 Особиста інформація</h2>
                            <div className="form">
                                <div className="grid grid-cols-2">
                                    <div className="form-group">
                                        <label className="form-label">Прізвище</label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Ім'я</label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">По батькові</label>
                                    <input
                                        type="text"
                                        value={middleName}
                                        onChange={(e) => setMiddleName(e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <div className="grid grid-cols-2">
                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Телефон</label>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                                {role === 'STUDENT' && (
                                    <div className="form-group">
                                        <label className="form-label">Студентський ID</label>
                                        <input
                                            type="text"
                                            value={studentId}
                                            onChange={(e) => setStudentId(e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                )}
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    className={saving ? 'btn btn-secondary' : 'btn btn-success'}
                                    style={{ marginTop: '1rem' }}
                                >
                                    {saving ? '⏳ Збереження...' : '✓ Зберегти профіль'}
                                </button>
                            </div>
                        </div>

                        {/* Password Change */}
                        <div className="card">
                            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ margin: 0 }}>🔒 Зміна пароля</h2>
                                <button
                                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                                    className="btn btn-sm btn-secondary"
                                >
                                    {showPasswordForm ? 'Скасувати' : 'Змінити пароль'}
                                </button>
                            </div>

                            {showPasswordForm && (
                                <div className="form">
                                    <div className="form-group">
                                        <label className="form-label">Поточний пароль</label>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="form-input"
                                            placeholder="Введіть поточний пароль"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Новий пароль</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="form-input"
                                            placeholder="Мінімум 6 символів"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Підтвердіть новий пароль</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="form-input"
                                            placeholder="Повторіть новий пароль"
                                        />
                                    </div>
                                    <button
                                        onClick={handleChangePassword}
                                        className="btn btn-success"
                                    >
                                        ✓ Змінити пароль
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Two-Factor Authentication */}
                        <div className="card">
                            <h2 className="card-header">🔐 Двофакторна автентифікація (2FA)</h2>

                            {!twoFactorEnabled ? (
                                <div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                                        Додатковий рівень безпеки для вашого облікового запису.
                                        Використовуйте застосунок Google Authenticator або подібний.
                                    </p>

                                    {!showQRCode ? (
                                        <button
                                            onClick={handleEnable2FA}
                                            className="btn btn-success"
                                        >
                                            ✓ Увімкнути 2FA
                                        </button>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            <div>
                                                <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--gray-800)' }}>
                                                    1. Відскануйте QR-код у вашому застосунку автентифікатора:
                                                </p>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    padding: '1.5rem',
                                                    background: 'var(--gray-50)',
                                                    borderRadius: '12px',
                                                    border: '2px dashed var(--gray-300)'
                                                }}>
                                                    {qrCodeUrl ? (
                                                        <img src={qrCodeUrl} alt="QR Code" style={{ width: '200px', height: '200px' }} />
                                                    ) : (
                                                        <div style={{
                                                            width: '200px',
                                                            height: '200px',
                                                            background: 'var(--gray-200)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            borderRadius: '8px'
                                                        }}>
                                                            QR Code
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--gray-800)' }}>
                                                    2. Введіть 6-значний код з застосунку:
                                                </p>
                                                <input
                                                    type="text"
                                                    value={totpCode}
                                                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                    placeholder="123456"
                                                    className="form-input"
                                                    style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem', fontWeight: '700' }}
                                                    maxLength={6}
                                                />
                                            </div>
                                            <button
                                                onClick={handleVerify2FA}
                                                className="btn btn-success"
                                            >
                                                ✓ Підтвердити та увімкнути
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '1rem',
                                        background: 'var(--success-50)',
                                        borderRadius: '10px',
                                        marginBottom: '1.5rem',
                                        border: '1px solid var(--success-200)'
                                    }}>
                                        <span style={{ fontSize: '2rem' }}>✓</span>
                                        <div>
                                            <div style={{ fontWeight: '700', color: 'var(--success-800)', marginBottom: '0.25rem' }}>
                                                2FA увімкнено
                                            </div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--success-700)' }}>
                                                Ваш обліковий запис захищено двофакторною автентифікацією
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleDisable2FA}
                                        className="btn btn-danger"
                                    >
                                        ⛔ Вимкнути 2FA
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
