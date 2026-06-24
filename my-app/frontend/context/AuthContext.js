"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/src/lib/api";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await apiFetch("/auth/session");
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        return { success: true };
      }

      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: "Login failed" };
    }
  };

  const register = async (userData) => {
    try {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        return { success: true };
      }

      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: "Registration failed" };
    }
  };

  const logout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", router);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await apiFetch("/user/profile", {
        method: "PUT",
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        return { success: true };
      }

      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: "Failed to update profile" };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await apiFetch("/auth/change-password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      return data;
    } catch (error) {
      return { success: false, message: "Failed to change password" };
    }
  };

  const refreshUser = async () => {
    try {
      const res = await apiFetch("/auth/session");
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
        changePassword,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
