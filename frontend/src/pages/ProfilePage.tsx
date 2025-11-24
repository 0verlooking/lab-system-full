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

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Профіль користувача</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Photo and Role */}
                <div className="space-y-6">
                    {/* Profile Photo */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="font-bold mb-4">Фото профілю</h2>
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
                                {photoUrl ? (
                                    <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl">👤</span>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="text-sm mb-2"
                            />
                        </div>
                    </div>

                    {/* Role and Group Info */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="font-bold mb-4">Інформація</h2>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="text-gray-600">Роль:</span>
                                <div className="font-medium mt-1">
                                    {role === 'ADMIN'
                                        ? '👑 Адміністратор'
                                        : role === 'CURATOR'
                                        ? '👨‍🏫 Куратор'
                                        : role === 'LABORANT'
                                        ? '🔧 Лаборант'
                                        : '👨‍🎓 Студент'}
                                </div>
                            </div>
                            {groupName && (
                                <div>
                                    <span className="text-gray-600">Група:</span>
                                    <div className="font-medium mt-1">{groupName}</div>
                                </div>
                            )}
                            {curatorName && (
                                <div>
                                    <span className="text-gray-600">Куратор:</span>
                                    <div className="font-medium mt-1">{curatorName}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Profile Form and Settings */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="font-bold mb-4">Особиста інформація</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Прізвище</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Ім'я</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">По батькові</label>
                                <input
                                    type="text"
                                    value={middleName}
                                    onChange={(e) => setMiddleName(e.target.value)}
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Телефон</label>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>
                            {role === 'STUDENT' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Студентський ID</label>
                                    <input
                                        type="text"
                                        value={studentId}
                                        onChange={(e) => setStudentId(e.target.value)}
                                        className="w-full px-4 py-2 border rounded"
                                    />
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {saving ? 'Збереження...' : 'Зберегти профіль'}
                        </button>
                    </div>

                    {/* Password Change */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold">Зміна пароля</h2>
                            <button
                                onClick={() => setShowPasswordForm(!showPasswordForm)}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                {showPasswordForm ? 'Скасувати' : 'Змінити пароль'}
                            </button>
                        </div>

                        {showPasswordForm && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Поточний пароль</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full px-4 py-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Новий пароль</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Підтвердіть новий пароль</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-2 border rounded"
                                    />
                                </div>
                                <button
                                    onClick={handleChangePassword}
                                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                                >
                                    Змінити пароль
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="font-bold mb-4">Двофакторна автентифікація (2FA)</h2>

                        {!twoFactorEnabled ? (
                            <div>
                                <p className="text-sm text-gray-600 mb-4">
                                    Додатковий рівень безпеки для вашого облікового запису.
                                    Використовуйте застосунок Google Authenticator або подібний.
                                </p>

                                {!showQRCode ? (
                                    <button
                                        onClick={handleEnable2FA}
                                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                                    >
                                        Увімкнути 2FA
                                    </button>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium mb-2">
                                                1. Відскануйте QR-код у вашому застосунку автентифікатора:
                                            </p>
                                            <div className="flex justify-center p-4 bg-gray-50 rounded">
                                                {qrCodeUrl ? (
                                                    <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                                                ) : (
                                                    <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                                                        QR Code
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium mb-2">
                                                2. Введіть 6-значний код з застосунку:
                                            </p>
                                            <input
                                                type="text"
                                                value={totpCode}
                                                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                placeholder="123456"
                                                className="w-full px-4 py-2 border rounded text-center text-2xl tracking-widest"
                                                maxLength={6}
                                            />
                                        </div>
                                        <button
                                            onClick={handleVerify2FA}
                                            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                                        >
                                            Підтвердити та увімкнути
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center gap-3 p-4 bg-green-50 rounded mb-4">
                                    <span className="text-2xl">✓</span>
                                    <div>
                                        <div className="font-medium text-green-800">2FA увімкнено</div>
                                        <div className="text-sm text-green-600">
                                            Ваш обліковий запис захищено двофакторною автентифікацією
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleDisable2FA}
                                    className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                                >
                                    Вимкнути 2FA
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
