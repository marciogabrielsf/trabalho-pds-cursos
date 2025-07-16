import { redirect } from "next/navigation";

export default async function TeacherCoursePage() {
    return redirect(`/dashboard/teacher/`);
}
