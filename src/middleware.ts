import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const userEmail = request.cookies.get("user-email")?.value;
    const userData = request.cookies.get("user-data")?.value;

    const isAuthenticated = userEmail && userData;
    const isAuthPage = request.nextUrl.pathname === "/";
    const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

    // Se está autenticado e tentando acessar a página de login, redirecionar para dashboard
    if (isAuthenticated && isAuthPage) {
        try {
            const user = JSON.parse(userData);
            const dashboardPath =
                user.role === "teacher" ? "/dashboard/teacher" : "/dashboard/student";
            return NextResponse.redirect(new URL(dashboardPath, request.url));
        } catch {
            // Se não conseguir fazer parse dos dados, limpar cookies e continuar
            const response = NextResponse.next();
            response.cookies.delete("user-email");
            response.cookies.delete("user-data");
            return response;
        }
    }

    // Se não está autenticado e tentando acessar dashboard, redirecionar para login
    if (!isAuthenticated && isDashboardPage) {
        return NextResponse.redirect(new URL("/", request.url));
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
