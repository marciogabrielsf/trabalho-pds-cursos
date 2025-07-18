import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskCreate, TaskDeliveryCreate, TaskDeliveryGrade } from "@/types/activity";
import { taskService, deliveryService } from "@/services/taskService";

export const useTasksByCourse = (courseId: number) => {
    return useQuery({
        queryKey: ["tasks", "course", courseId],
        queryFn: () => taskService.getTasksByCourse(courseId),
        staleTime: 1000 * 60 * 5,
    });
};

export const useTaskById = (taskId: number) => {
    return useQuery({
        queryKey: ["task", taskId],
        queryFn: () => taskService.getTaskById(taskId),
        staleTime: 1000 * 60 * 2,
        enabled: !!taskId,
    });
};

export const useDeliveriesByTask = (taskId: number) => {
    return useQuery({
        queryKey: ["deliveries", "task", taskId],
        queryFn: () => deliveryService.getDeliveriesByTask(taskId),
        staleTime: 1000 * 60 * 2,
        enabled: !!taskId,
    });
};

export const useStudentDeliveryForTask = (taskId: number, studentId: number) => {
    return useQuery({
        queryKey: ["delivery", "task", taskId, "student", studentId],
        queryFn: () => deliveryService.getStudentDeliveryForTask(taskId, studentId),
        staleTime: 1000 * 60 * 2,
        enabled: !!taskId && !!studentId,
        retry: false,
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ taskData, teacherId }: { taskData: TaskCreate; teacherId: number }) =>
            taskService.createTask(taskData, teacherId),
        onSuccess: (newTask) => {
            queryClient.invalidateQueries({
                queryKey: ["tasks", "course", newTask.course_id],
            });
        },
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ taskId, taskData }: { taskId: number; taskData: TaskCreate }) =>
            taskService.updateTask(taskId, taskData),
        onSuccess: (updatedTask) => {
            queryClient.invalidateQueries({
                queryKey: ["task", updatedTask.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["tasks", "course", updatedTask.course_id],
            });
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (taskId: number) => taskService.deleteTask(taskId),
        onSuccess: (_, taskId) => {
            queryClient.invalidateQueries({
                queryKey: ["tasks"],
            });
            queryClient.removeQueries({
                queryKey: ["task", taskId],
            });
        },
    });
};

export const useCreateDelivery = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            deliveryData,
            studentId,
        }: {
            deliveryData: TaskDeliveryCreate;
            studentId: number;
        }) => deliveryService.createDelivery(deliveryData, studentId),
        onSuccess: (newDelivery) => {
            queryClient.invalidateQueries({
                queryKey: ["deliveries", "task", newDelivery.task_id],
            });
            queryClient.invalidateQueries({
                queryKey: [
                    "delivery",
                    "task",
                    newDelivery.task_id,
                    "student",
                    newDelivery.student_id,
                ],
            });
        },
    });
};

export const useUpdateDelivery = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            deliveryId,
            deliveryData,
        }: {
            deliveryId: number;
            deliveryData: TaskDeliveryCreate;
        }) => deliveryService.updateDelivery(deliveryId, deliveryData),
        onSuccess: (updatedDelivery) => {
            queryClient.invalidateQueries({
                queryKey: ["deliveries", "task", updatedDelivery.task_id],
            });
            queryClient.invalidateQueries({
                queryKey: [
                    "delivery",
                    "task",
                    updatedDelivery.task_id,
                    "student",
                    updatedDelivery.student_id,
                ],
            });
        },
    });
};

export const useGradeDelivery = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            deliveryId,
            gradeData,
        }: {
            deliveryId: number;
            gradeData: TaskDeliveryGrade;
        }) => deliveryService.gradeDelivery(deliveryId, gradeData),
        onSuccess: (gradedDelivery) => {
            queryClient.invalidateQueries({
                queryKey: ["deliveries", "task", gradedDelivery.task_id],
            });
            queryClient.invalidateQueries({
                queryKey: [
                    "delivery",
                    "task",
                    gradedDelivery.task_id,
                    "student",
                    gradedDelivery.student_id,
                ],
            });
        },
    });
};

export const useDeleteDelivery = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (deliveryId: number) => deliveryService.deleteDelivery(deliveryId),
        onSuccess: (_, deliveryId) => {
            queryClient.invalidateQueries({
                queryKey: ["deliveries"],
            });
            queryClient.removeQueries({
                queryKey: ["delivery", deliveryId],
            });
        },
    });
};
