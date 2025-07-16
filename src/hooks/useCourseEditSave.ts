import { useRouter } from "next/navigation";
import { useUpdateCourse } from "@/hooks/useTeacherQuery";
import {
    useAddModuleToCourse,
    useCreateModule,
    useCreateLesson,
    useUpdateModule,
    useUpdateLesson,
} from "@/hooks/useModuleQuery";
import { LessonType } from "@/types/lesson";

interface CourseEditAPIData {
    courseData: {
        title: string;
        description: string;
        value: number;
        teacher_id: number;
        trailer_url: string;
        thumbnail_url: string;
        difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
        category: "PROGRAMMING" | "DESIGN" | "BUSINESS" | "MARKETING" | "PHOTOGRAPHY" | "MUSIC";
    };
    existingModulesData: Array<{
        module_id: number;
        order: number;
    }>;
    newModulesData: Array<{
        title: string;
        description: string;
        order: number;
        lessons: Array<{
            id: string;
            title: string;
            type: LessonType;
            description: string;
            content: Record<string, unknown>;
            order: number;
        }>;
    }>;
    courseModulesData: Array<{
        id: number;
        title: string;
        description: string;
        order: number;
        lessons: Array<{
            id: string;
            title: string;
            type: LessonType;
            description: string;
            content: Record<string, unknown>;
            order: number;
        }>;
    }>;
}

export function useCourseEditSave(courseId: number, userId: number) {
    const router = useRouter();
    const updateCourseMutation = useUpdateCourse();
    const { mutateAsync: addModuleToCourseAsync } = useAddModuleToCourse();
    const { mutateAsync: createModuleAsync } = useCreateModule();
    const { mutateAsync: createLessonAsync } = useCreateLesson();
    const { mutateAsync: updateModuleAsync } = useUpdateModule();
    const { mutateAsync: updateLessonAsync } = useUpdateLesson();

    const handleSave = async (apiData: CourseEditAPIData) => {
        try {
            // 1. Atualizar informações básicas do curso
            await updateCourseMutation.mutateAsync({
                courseId,
                courseData: apiData.courseData,
            });

            // 2. Adicionar novos módulos existentes ao curso (se houver)
            for (const moduleData of apiData.existingModulesData) {
                await addModuleToCourseAsync({
                    course_id: courseId,
                    module_id: moduleData.module_id,
                    order: moduleData.order,
                });
            }

            // 3. Atualizar módulos do curso existentes
            for (const courseModuleData of apiData.courseModulesData) {
                // Atualizar o módulo
                await updateModuleAsync({
                    moduleId: courseModuleData.id,
                    moduleData: {
                        title: courseModuleData.title,
                        description: courseModuleData.description,
                        teacher_id: userId,
                    },
                });

                // Atualizar as aulas do módulo
                for (const lessonData of courseModuleData.lessons) {
                    // Verificar se é uma lição existente (começa com "lesson-") ou nova (começa com "new-lesson-")
                    if (lessonData.id.startsWith("lesson-")) {
                        // Lição existente - atualizar
                        console.log(`Atualizando lição existente: ${lessonData.id}`);
                        const originalLessonId = parseInt(lessonData.id.replace("lesson-", ""));
                        await updateLessonAsync({
                            lessonId: originalLessonId,
                            lessonData: {
                                title: lessonData.title,
                                type: lessonData.type,
                                description: lessonData.description,
                                content: lessonData.content,
                                order: lessonData.order,
                                id_module: courseModuleData.id,
                            },
                        });
                    } else {
                        // Lição nova - criar
                        console.log(`Criando nova lição: ${lessonData.id}`);
                        await createLessonAsync({
                            title: lessonData.title,
                            type: lessonData.type,
                            description: lessonData.description,
                            content: lessonData.content,
                            order: lessonData.order,
                            id_module: courseModuleData.id,
                        });
                    }
                }
            }

            // 4. Criar novos módulos e suas aulas
            for (const newModuleData of apiData.newModulesData) {
                // Criar o módulo
                const createdModule = await createModuleAsync({
                    title: newModuleData.title,
                    description: newModuleData.description,
                    teacher_id: userId,
                });

                // Adicionar o módulo ao curso
                await addModuleToCourseAsync({
                    course_id: courseId,
                    module_id: createdModule.id,
                    order: newModuleData.order,
                });

                // Criar as aulas do módulo
                for (const lessonData of newModuleData.lessons) {
                    await createLessonAsync({
                        title: lessonData.title,
                        type: lessonData.type,
                        description: lessonData.description,
                        content: lessonData.content,
                        order: lessonData.order,
                        id_module: createdModule.id,
                    });
                }
            }

            console.log("Dados para API:", apiData);
            console.log("Curso atualizado com sucesso!");
            alert("Curso atualizado com sucesso!");
            router.push(`/dashboard/teacher/course/${courseId}`);
        } catch (error) {
            alert("Erro ao atualizar curso. Tente novamente.");
            console.error("Error updating course:", error);
        }
    };

    return {
        handleSave,
        isLoading: updateCourseMutation.isPending,
    };
}
