import { api } from "./api";
import {
    Task,
    TaskCreate,
    TaskUpdate,
    TaskDelivery,
    TaskDeliveryCreate,
    TaskDeliveryUpdate,
    TaskDeliveryGrade,
} from "@/types/activity";

class TaskService {
    async getAllTasks(): Promise<Task[]> {
        const response = await api.get("/task/");
        return response.data;
    }

    async getTaskById(taskId: number): Promise<Task> {
        const response = await api.get(`/task/${taskId}`);
        return response.data;
    }

    async getTasksByCourse(courseId: number): Promise<Task[]> {
        const response = await api.get(`/course/${courseId}/tasks`);
        return response.data;
    }

    async createTask(taskData: TaskCreate, teacherId: number): Promise<Task> {
        const response = await api.post("/task/", taskData, {
            params: {
                teacher_id: teacherId,
            },
        });
        return response.data;
    }

    async updateTask(taskId: number, taskData: TaskUpdate): Promise<Task> {
        const response = await api.put(`/task/${taskId}`, taskData);
        return response.data;
    }

    async deleteTask(taskId: number): Promise<void> {
        await api.delete(`/task/${taskId}`);
    }
}

class DeliveryService {
    async getAllDeliveries(): Promise<TaskDelivery[]> {
        const response = await api.get("/task-delivery/");
        return response.data;
    }

    async getDeliveryById(deliveryId: number): Promise<TaskDelivery> {
        const response = await api.get(`/task-delivery/${deliveryId}`);
        return response.data;
    }

    async getDeliveriesByTask(taskId: number): Promise<TaskDelivery[]> {
        const response = await api.get(`/task/${taskId}/deliveries`);
        return response.data;
    }

    async getStudentDeliveryForTask(taskId: number, studentId: number): Promise<TaskDelivery> {
        const response = await api.get(`/task/${taskId}/student/${studentId}/delivery`);
        return response.data;
    }

    async createDelivery(
        deliveryData: TaskDeliveryCreate,
        studentId: number
    ): Promise<TaskDelivery> {
        const response = await api.post("/task-delivery/", deliveryData, {
            params: {
                student_id: studentId,
            },
        });
        return response.data;
    }

    async updateDelivery(
        deliveryId: number,
        deliveryData: TaskDeliveryUpdate
    ): Promise<TaskDelivery> {
        const response = await api.put(`/task-delivery/${deliveryId}`, deliveryData);
        return response.data;
    }

    async deleteDelivery(deliveryId: number): Promise<void> {
        await api.delete(`/task-delivery/${deliveryId}`);
    }

    async gradeDelivery(deliveryId: number, gradeData: TaskDeliveryGrade): Promise<TaskDelivery> {
        const response = await api.put(`/task-delivery/${deliveryId}/grade`, gradeData);
        return response.data;
    }
}

export const taskService = new TaskService();
export const deliveryService = new DeliveryService();
