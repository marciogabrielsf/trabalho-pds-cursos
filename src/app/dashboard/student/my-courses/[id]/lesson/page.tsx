"use client";

import { redirect, useParams } from "next/navigation";

export default function CourseLearningRoute() {
    const { id: courseId } = useParams();

    redirect(`/dashboard/student/my-courses/${courseId}/lesson/1`);
}
