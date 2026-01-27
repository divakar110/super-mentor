
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if (isOnDashboard) {
                // Routes that REQUIRE authentication
                const protectedRoutes = ['/dashboard/reports', '/dashboard/settings', '/dashboard/profile'];
                const isProtected = protectedRoutes.some(route => nextUrl.pathname.startsWith(route));

                if (isProtected && !isLoggedIn) {
                    return false; // Redirect to login
                }

                // Special handling for root dashboard: Redirect guests to Syllabus
                if (nextUrl.pathname === '/dashboard' && !isLoggedIn) {
                    return Response.redirect(new URL('/dashboard/syllabus', nextUrl));
                }

                // Allow access to other dashboard routes (Study, Chat, Syllabus)
                return true;
            } else if (isLoggedIn) {
                // Redirect logged-in users away from login/register pages
                if (nextUrl.pathname === '/login' || nextUrl.pathname === '/register') {
                    return Response.redirect(new URL('/dashboard', nextUrl));
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
