export interface Enrollment {
    id: number;
    student_id: number;
    course_id: number;
    payment_id: number;
    created_at: string;
}

export interface CreateEnrollmentRequest {
    student_id: number;
    course_id: number;
}

export interface CreateEnrollmentResponse {
    id: number;
    student_id: number;
    course_id: number;
    payment_id: number;
    created_at: string;
}
