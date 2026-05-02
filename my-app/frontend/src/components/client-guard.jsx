"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthenticated, withoutAuthRoutes } from "@/src/AuthGuard";
import { CircularProgress, Box } from "@mui/material";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Ensure component is mounted on client before any auth check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Run auth check ONLY after component is mounted
  useEffect(() => {
    if (!mounted) return;

    const needsAuth = !withoutAuthRoutes.includes(pathname);

    if (needsAuth && !isAuthenticated()) {
      router.push("/");
    }

    setCheckingAuth(false);
  }, [mounted, pathname, router]);

  // Prevent SSR mismatch → render nothing until mounted
  // if (!mounted || checkingAuth) {
  //   return (
  //     <>
  //     {/* <Box
  //       sx={{
  //         height: "100vh",
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //       }}
  //     > */}
  //       <CircularProgress />
  //     {/* </Box> */}
  //     </>
      
  //   );
  // }

  return <>{children}</>;
}
