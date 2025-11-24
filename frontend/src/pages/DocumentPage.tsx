import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DocumentType = {
    RENTAL_AGREEMENT: 'RENTAL_AGREEMENT',
    HANDOVER_ACT: 'HANDOVER_ACT',
    RETURN_ACT: 'RETURN_ACT',
    PURCHASE_REQUEST: 'PURCHASE_REQUEST'
} as const;

type DocumentType = typeof DocumentType[keyof typeof DocumentType];

const SignatureType = {
    DRAWN: 'DRAWN',
    EDS: 'EDS',
    DIIA: 'DIIA',
    SMS: 'SMS'
} as const;

type SignatureType = typeof SignatureType[keyof typeof SignatureType];

export default function DocumentPage() {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [documentType, setDocumentType] = useState<DocumentType>(DocumentType.RENTAL_AGREEMENT);
    const [signatureType, setSignatureType] = useState<SignatureType>(SignatureType.DRAWN);
    const [passportData, setPassportData] = useState('');
    const [studentName, setStudentName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [issuePhoto, setIssuePhoto] = useState<File | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [documentNumber, setDocumentNumber] = useState('');

    useEffect(() => {
        // Generate document number
        const projectPart = projectId ? projectId.padStart(7, '0') : '0000000';
        const typePart = getDocumentTypeCode(documentType);
        const sequence = String(Date.now() % 1000).padStart(3, '0');
        setDocumentNumber(`${projectPart}-${typePart}-${sequence}`);

        // Load user data from context/localStorage
        const username = localStorage.getItem('auth_username') || '';
        setStudentName(username);
    }, [projectId, documentType]);

    const getDocumentTypeCode = (type: DocumentType): string => {
        switch (type) {
            case DocumentType.RENTAL_AGREEMENT:
                return 'RA';
            case DocumentType.HANDOVER_ACT:
                return 'HA';
            case DocumentType.RETURN_ACT:
                return 'RET';
            case DocumentType.PURCHASE_REQUEST:
                return 'PR';
            default:
                return 'DOC';
        }
    };

    const getDocumentTypeLabel = (type: DocumentType): string => {
        switch (type) {
            case DocumentType.RENTAL_AGREEMENT:
                return 'Договір оренди обладнання';
            case DocumentType.HANDOVER_ACT:
                return 'Акт прийому-передачі';
            case DocumentType.RETURN_ACT:
                return 'Акт повернення обладнання';
            case DocumentType.PURCHASE_REQUEST:
                return 'Заявка на закупівлю';
            default:
                return 'Документ';
        }
    };

    // Canvas drawing
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        setIsDrawing(true);
        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIssuePhoto(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!passportData.trim()) {
            alert('Введіть паспортні дані');
            return;
        }

        if (signatureType === SignatureType.DRAWN) {
            const canvas = canvasRef.current;
            if (!canvas) {
                alert('Помилка отримання підпису');
                return;
            }

            // Check if canvas is empty
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const isEmpty = !imageData.data.some(channel => channel !== 0);

            if (isEmpty) {
                alert('Будь ласка, поставте підпис');
                return;
            }
        }

        // Get signature data
        let signatureData = '';
        if (signatureType === SignatureType.DRAWN) {
            signatureData = canvasRef.current?.toDataURL() || '';
        }

        // In real app, send to API
        console.log('Submitting document:', {
            documentNumber,
            documentType,
            signatureType,
            passportData,
            studentName,
            studentId,
            phoneNumber,
            signatureData,
            issuePhoto: issuePhoto?.name
        });

        alert(`Документ №${documentNumber} успішно створено!`);
        navigate(-1);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-600 hover:underline"
            >
                ← Назад
            </button>

            <div className="bg-white rounded-lg shadow p-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Оформлення документа</h1>
                    <p className="text-gray-600">
                        Документ №: <span className="font-mono font-bold">{documentNumber}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Document Type */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Тип документа <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={DocumentType.RENTAL_AGREEMENT}>Договір оренди обладнання</option>
                            <option value={DocumentType.HANDOVER_ACT}>Акт прийому-передачі</option>
                            <option value={DocumentType.RETURN_ACT}>Акт повернення обладнання</option>
                            <option value={DocumentType.PURCHASE_REQUEST}>Заявка на закупівлю</option>
                        </select>
                    </div>

                    {/* Document Template */}
                    <div className="border rounded p-6 bg-gray-50">
                        <h2 className="text-xl font-bold mb-4 text-center">
                            {getDocumentTypeLabel(documentType)}
                        </h2>
                        <div className="space-y-3 text-sm">
                            <p>Документ №: <strong>{documentNumber}</strong></p>
                            <p>Дата складання: <strong>{new Date().toLocaleDateString('uk-UA')}</strong></p>
                            {projectId && <p>Проект №: <strong>{projectId}</strong></p>}
                            <div className="border-t pt-3 mt-3">
                                <p className="text-gray-600">
                                    Цей документ підтверджує передачу/повернення обладнання згідно з проектом.
                                    Студент несе повну відповідальність за збереження та правильне використання
                                    обладнання протягом терміну використання.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Student Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                ПІБ студента <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Студентський ID
                            </label>
                            <input
                                type="text"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                                placeholder="Наприклад: ST123456"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Номер телефону <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                                placeholder="+380501234567"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Паспортні дані <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={passportData}
                                onChange={(e) => setPassportData(e.target.value)}
                                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                                placeholder="Серія та номер паспорта"
                                required
                            />
                        </div>
                    </div>

                    {/* Photo Upload */}
                    {(documentType === DocumentType.HANDOVER_ACT || documentType === DocumentType.RETURN_ACT) && (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Фото обладнання при {documentType === DocumentType.HANDOVER_ACT ? 'видачі' : 'поверненні'}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="w-full px-4 py-2 border rounded"
                            />
                            {issuePhoto && (
                                <p className="text-sm text-green-600 mt-2">✓ Фото завантажено: {issuePhoto.name}</p>
                            )}
                        </div>
                    )}

                    {/* Signature Section */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Спосіб підпису <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-3 mb-4">
                            <button
                                type="button"
                                onClick={() => setSignatureType(SignatureType.DRAWN)}
                                className={`px-4 py-2 rounded ${
                                    signatureType === SignatureType.DRAWN
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                            >
                                ✍️ Намалювати
                            </button>
                            <button
                                type="button"
                                onClick={() => setSignatureType(SignatureType.EDS)}
                                className={`px-4 py-2 rounded ${
                                    signatureType === SignatureType.EDS
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                            >
                                🔐 ЕЦП (EDS)
                            </button>
                            <button
                                type="button"
                                onClick={() => setSignatureType(SignatureType.DIIA)}
                                className={`px-4 py-2 rounded ${
                                    signatureType === SignatureType.DIIA
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                            >
                                📱 Дія
                            </button>
                            <button
                                type="button"
                                onClick={() => setSignatureType(SignatureType.SMS)}
                                className={`px-4 py-2 rounded ${
                                    signatureType === SignatureType.SMS
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                            >
                                💬 SMS
                            </button>
                        </div>

                        {/* Canvas Signature */}
                        {signatureType === SignatureType.DRAWN && (
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Підпис студента <span className="text-red-500">*</span>
                                </label>
                                <div className="border rounded p-2 bg-white">
                                    <canvas
                                        ref={canvasRef}
                                        width={600}
                                        height={200}
                                        onMouseDown={startDrawing}
                                        onMouseMove={draw}
                                        onMouseUp={stopDrawing}
                                        onMouseLeave={stopDrawing}
                                        className="border bg-gray-50 cursor-crosshair w-full"
                                        style={{ touchAction: 'none' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={clearSignature}
                                        className="mt-2 text-sm text-red-600 hover:underline"
                                    >
                                        Очистити підпис
                                    </button>
                                </div>
                            </div>
                        )}

                        {signatureType === SignatureType.EDS && (
                            <div className="p-4 bg-blue-50 rounded">
                                <p className="text-sm text-gray-700">
                                    Підпис через ЕЦП буде реалізовано в наступній версії.
                                    Буде використовуватись бібліотека для роботи з українськими ЕЦП.
                                </p>
                            </div>
                        )}

                        {signatureType === SignatureType.DIIA && (
                            <div className="p-4 bg-blue-50 rounded">
                                <p className="text-sm text-gray-700">
                                    Підпис через застосунок Дія буде реалізовано в наступній версії.
                                    Буде використовуватись Diia API для підпису документів.
                                </p>
                            </div>
                        )}

                        {signatureType === SignatureType.SMS && (
                            <div className="p-4 bg-blue-50 rounded">
                                <p className="text-sm text-gray-700">
                                    SMS-підтвердження буде реалізовано в наступній версії.
                                    Код підтвердження буде надіслано на вказаний номер телефону.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4 border-t">
                        <button
                            type="submit"
                            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
                        >
                            ✓ Підписати та зберегти документ
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 border rounded-lg hover:bg-gray-50"
                        >
                            Скасувати
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
