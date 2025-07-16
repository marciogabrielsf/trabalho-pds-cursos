import React from "react";
import { motion } from "framer-motion";
import {
    Users,
    PlayCircle,
    CheckCircle,
    MessageSquare,
    TrendingUp,
    Star,
    Award,
    Eye,
} from "lucide-react";

interface TeacherCourseOverviewProps {
    courseData?: unknown; // Tipo do curso - pode ser tipado mais especificamente quando necessário
}

const TeacherCourseOverview: React.FC<TeacherCourseOverviewProps> = () => {
    // Mock data para estatísticas do curso
    const courseStats = {
        totalStudents: 45,
        activeStudents: 38,
        completionRate: 72,
        averageProgress: 68,
        totalLessons: 24,
        averageRating: 4.8,
        totalReviews: 23,
        recentActivity: 12,
        messagesCount: 8,
        assignmentsToReview: 5,
    };

    const recentStudents = [
        { name: "João Silva", progress: 95, lastActivity: "2h atrás" },
        { name: "Maria Santos", progress: 78, lastActivity: "4h atrás" },
        { name: "Pedro Costa", progress: 45, lastActivity: "1d atrás" },
        { name: "Ana Oliveira", progress: 100, lastActivity: "2d atrás" },
    ];

    const itemVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
        >
            {/* Header Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                    variants={itemVariants}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {courseStats.totalStudents}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-sm text-green-600 mt-2">
                        <span className="font-medium">{courseStats.activeStudents}</span> ativos
                    </p>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Taxa de Conclusão</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {courseStats.completionRate}%
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        {Math.round(courseStats.totalStudents * (courseStats.completionRate / 100))}{" "}
                        alunos concluídos
                    </p>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Progresso Médio</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {courseStats.averageProgress}%
                            </p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-full">
                            <TrendingUp className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${courseStats.averageProgress}%` }}
                            ></div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Avaliação</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {courseStats.averageRating}
                            </p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <Star className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        {courseStats.totalReviews} avaliações
                    </p>
                </motion.div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Atividade Recente</h3>
                        <span className="text-sm text-gray-500">
                            {courseStats.recentActivity} atividades hoje
                        </span>
                    </div>

                    <div className="space-y-4">
                        {recentStudents.map((student, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Users className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {student.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Última atividade: {student.lastActivity}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${student.progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-900 font-medium">
                                        {student.progress}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Ações Rápidas</h3>

                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                            <div className="flex items-center space-x-3">
                                <MessageSquare className="h-5 w-5" />
                                <span className="text-sm font-medium">Mensagens</span>
                            </div>
                            <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {courseStats.messagesCount}
                            </span>
                        </button>

                        <button className="w-full flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                            <div className="flex items-center space-x-3">
                                <Award className="h-5 w-5" />
                                <span className="text-sm font-medium">Trabalhos</span>
                            </div>
                            <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">
                                {courseStats.assignmentsToReview}
                            </span>
                        </button>

                        <button className="w-full flex items-center justify-between p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                            <div className="flex items-center space-x-3">
                                <Eye className="h-5 w-5" />
                                <span className="text-sm font-medium">Analytics</span>
                            </div>
                        </button>

                        <button className="w-full flex items-center justify-between p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
                            <div className="flex items-center space-x-3">
                                <PlayCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">Prévia do Curso</span>
                            </div>
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Course Progress Chart */}
            <motion.div
                variants={itemVariants}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Progresso do Curso</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 24 24">
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                    className="text-gray-200"
                                />
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeDasharray={`${courseStats.completionRate * 0.628} 62.8`}
                                    className="text-green-500"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl font-bold text-gray-900">
                                    {courseStats.completionRate}%
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">Taxa de Conclusão</p>
                    </div>

                    <div className="text-center">
                        <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 24 24">
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                    className="text-gray-200"
                                />
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeDasharray={`${courseStats.averageProgress * 0.628} 62.8`}
                                    className="text-blue-500"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl font-bold text-gray-900">
                                    {courseStats.averageProgress}%
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">Progresso Médio</p>
                    </div>

                    <div className="text-center">
                        <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 24 24">
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                    className="text-gray-200"
                                />
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeDasharray={`${
                                        (courseStats.activeStudents / courseStats.totalStudents) *
                                        62.8
                                    } 62.8`}
                                    className="text-orange-500"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl font-bold text-gray-900">
                                    {Math.round(
                                        (courseStats.activeStudents / courseStats.totalStudents) *
                                            100
                                    )}
                                    %
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">Alunos Ativos</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TeacherCourseOverview;
