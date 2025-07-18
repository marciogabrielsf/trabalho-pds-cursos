export interface Task {
    id: number;
    title: string;
    description: string;
    points: number;
    max_delivery_time: string;
    course_id: number;
    course_title?: string;
    creator_name?: string;
    deliveries_count?: number;
    created_at?: string;
    updated_at?: string;
}

export interface TaskCreate {
    title: string;
    description: string;
    points: number;
    max_delivery_time: string;
    course_id: number;
}

export interface TaskUpdate {
    title?: string;
    description?: string;
    points?: number;
    max_delivery_time?: string;
}

export interface TaskDelivery {
    id: number;
    content: string;
    file_url?: string;
    grade?: number;
    feedback?: string;
    task_id: number;
    student_id: number;
    student_name?: string;
    task_title?: string;
    created_at?: string;
    updated_at?: string;
}

export interface TaskDeliveryCreate {
    content: string;
    file_url?: string;
    task_id: number;
}

export interface TaskDeliveryUpdate {
    content?: string;
    file_url?: string;
}

export interface TaskDeliveryGrade {
    grade: number;
    feedback?: string;
}

export interface TaskWithDeliveries extends Task {
    deliveries: TaskDelivery[];
    delivery_count: number;
}
