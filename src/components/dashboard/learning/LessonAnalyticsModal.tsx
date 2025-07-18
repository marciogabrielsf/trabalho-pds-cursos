import React from "react";
import { motion } from "framer-motion";
import { X, Users, Eye, CheckCircle, Clock, BarChart3 } from "lucide-react";
import { formatDateTimeBR } from "@/lib/dateUtils";

interface LessonAnalyticsModalProps {
    isOpen: boolean;
    onClose: () => void;
    lessonTitle: string;
    lessonId: string;
    moduleId: string;
}

interface StudentProgress {
    id: string;
    name: string;
    email: string;
    progress: number;
    completedAt?: string;
    timeSpent: number; // em minutos
    attempts: number;
    lastAccess: string;
}

const LessonAnalyticsModal: React.FC<LessonAnalyticsModalProps> = ({
    isOpen,
    onClose,
    lessonTitle,
}) => {
    // Mock data - em produção viria de uma API
    const mockStudentProgress: StudentProgress[] = [
        {
            id: "1",
            name: "João Silva",
            email: "joao@email.com",
            progress: 100,
            completedAt: "2024-01-15T10:30:00Z",
            timeSpent: 45,
            attempts: 1,
            lastAccess: "2024-01-15T10:30:00Z",
        },
        {
            id: "2",
            name: "Maria Santos",
            email: "maria@email.com",
            progress: 75,
            timeSpent: 32,
            attempts: 2,
            lastAccess: "2024-01-14T14:20:00Z",
        },
        {
            id: "3",
            name: "Pedro Costa",
            email: "pedro@email.com",
            progress: 50,
            timeSpent: 18,
            attempts: 1,
            lastAccess: "2024-01-13T09:15:00Z",
        },
        {
            id: "4",
            name: "Ana Oliveira",
            email: "ana@email.com",
            progress: 100,
            completedAt: "2024-01-12T16:45:00Z",
            timeSpent: 38,
            attempts: 3,
            lastAccess: "2024-01-12T16:45:00Z",
        },
    ];

    const completedStudents = mockStudentProgress.filter((s) => s.progress === 100).length;
    const totalStudents = mockStudentProgress.length;
    const averageProgress =
        mockStudentProgress.reduce((acc, student) => acc + student.progress, 0) / totalStudents;
    const averageTimeSpent =
        mockStudentProgress.reduce((acc, student) => acc + student.timeSpent, 0) / totalStudents;

    if (!isOpen) return null;

    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Analytics da Aula</h2>
                        <p className="text-gray-600">{lessonTitle}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="text-blue-600" size={20} />
                            <span className="text-sm font-medium text-blue-600">
                                Total de Alunos
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-blue-800">{totalStudents}</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="text-green-600" size={20} />
                            <span className="text-sm font-medium text-green-600">Completaram</span>
                        </div>
                        <p className="text-2xl font-bold text-green-800">{completedStudents}</p>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="text-orange-600" size={20} />
                            <span className="text-sm font-medium text-orange-600">
                                Progresso Médio
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-orange-800">
                            {averageProgress.toFixed(1)}%
                        </p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="text-purple-600" size={20} />
                            <span className="text-sm font-medium text-purple-600">Tempo Médio</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-800">
                            {averageTimeSpent.toFixed(0)}min
                        </p>
                    </div>
                </div>

                {/* Students Progress Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Progresso dos Alunos
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aluno
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Progresso
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tempo Gasto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tentativas
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Último Acesso
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {mockStudentProgress.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {student.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {student.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${student.progress}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {student.progress}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {student.timeSpent}min
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {student.attempts}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDateTimeBR(student.lastAccess)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {student.progress === 100 ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircle size={14} className="mr-1" />
                                                    Concluído
                                                </span>
                                            ) : student.progress > 0 ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    <Eye size={14} className="mr-1" />
                                                    Em Progresso
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    <Clock size={14} className="mr-1" />
                                                    Não Iniciado
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default LessonAnalyticsModal;
