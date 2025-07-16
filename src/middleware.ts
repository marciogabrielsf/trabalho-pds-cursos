import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const userEmail = request.cookies.get("user-email")?.value;
    const userData = request.cookies.get("user-data")?.value;
    const userRole = request.cookies.get("user-role")?.value;

    const isAuthenticated = userEmail && userData && userRole;
    const isStudentLoginPage = request.nextUrl.pathname === "/";
    const isTeacherLoginPage = request.nextUrl.pathname === "/teacher/login";
    const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

    // Se está autenticado e tentando acessar página de login, redirecionar para dashboard correto
    if (isAuthenticated && (isStudentLoginPage || isTeacherLoginPage)) {
        const dashboardPath = userRole === "teacher" ? "/dashboard/teacher" : "/dashboard/student";
        return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    // Se não está autenticado e tentando acessar dashboard, redirecionar para login correto
    if (!isAuthenticated && isDashboardPage) {
        const loginPath = request.nextUrl.pathname.startsWith("/dashboard/teacher")
            ? "/teacher/login"
            : "/";
        return NextResponse.redirect(new URL(loginPath, request.url));
    }

    // Se está autenticado mas tentando acessar dashboard errado, redirecionar para dashboard correto
    if (isAuthenticated && isDashboardPage) {
        const isTeacherRoute = request.nextUrl.pathname.startsWith("/dashboard/teacher");
        const isStudentRoute = request.nextUrl.pathname.startsWith("/dashboard/student");

        if (userRole === "teacher" && isStudentRoute) {
            return NextResponse.redirect(new URL("/dashboard/teacher", request.url));
        }

        if (userRole === "student" && isTeacherRoute) {
            return NextResponse.redirect(new URL("/dashboard/student", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
