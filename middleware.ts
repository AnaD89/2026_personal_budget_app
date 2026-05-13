export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // ✅ Protejăm DOAR pagini UI
    "/dashboard/:path*",
    "/expenses/:path*",
    "/reports/:path*",
    "/accounts/:path*",
  ],
};
