import { Module } from "@/types/module";
import { api } from "./api";

interface CreateModuleData {
    title: string;
    description: string;
    teacher_id: number;
}

interface ModuleResponse {
    id: number;
    title: string;
    description: string;
    teacher_id: number;
    created_at: string;
}

interface AddModuleToCourseData {
    course_id: number;
    module_id: number;
    order: number;
}

class ModuleService {
    async createModule(moduleData: CreateModuleData): Promise<ModuleResponse> {
        const response = await api.post("/modules", moduleData);
        return response.data;
    }

    async getTeacherModules(teacherId: number): Promise<Module[]> {
        const response = await api.get(`/teacher/${teacherId}/modules`);
        return response.data;
    }

    async addModuleToCourse(data: AddModuleToCourseData): Promise<void> {
        await api.post(`/courses/${data.course_id}/modules/${data.module_id}?order=${data.order}`);
    }

    async updateModule(
        moduleId: number,
        moduleData: Partial<CreateModuleData>
    ): Promise<ModuleResponse> {
        const response = await api.put(`/modules/${moduleId}`, moduleData);
        return response.data;
    }

    async deleteModule(moduleId: number): Promise<void> {
        await api.delete(`/modules/${moduleId}`);
    }
}

export const moduleService = new ModuleService();
