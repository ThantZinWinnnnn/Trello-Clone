export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/boards/:path*", "/profile/:path*", "/create-first-team"],
};
