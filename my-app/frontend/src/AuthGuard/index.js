export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token"); 
}

export const withoutAuthRoutes = [
  "/",
  "/about-us",
  "/contact-us",
  "/books",
  "/blog",
  "/new-release",
  "/faqs",
  "/privacy-policy",
  "/terms-condition",
  "/auth/login",
  "/auth/signup",
  "/auth/otp",
];
