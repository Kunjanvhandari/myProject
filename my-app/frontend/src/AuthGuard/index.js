export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token"); 
}

export const withoutAuthRoutes = [
  "/",
  "/about-us",
  "/contact-us",
  "/blog",
  "/faqs",
  "/privacy-policy",
  "/terms-condition",
  "/library",
  "/library/books",
  "/library/new-release",
  "/library/auth/login",
  "/library/auth/signup",
  "/library/auth/otp",
  "/library/favorite-pets",
];
