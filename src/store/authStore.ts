import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  role: "USER" | "ADMIN" | "SUPER_ADMIN" | null;
  email: string | null;
  setAuth: (token: string, role: AuthState["role"], email: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      email: null,
      setAuth: (token, role, email) => set({ token, role, email }),
      clearAuth: () => set({ token: null, role: null, email: null }),
    }),
    { name: "dalyda-auth",skipHydration: true }
  )
);
