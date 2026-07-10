"use client";

import { LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export function Topbar() {
  const router = useRouter();
  const clearAuth = useAuthStore(state => state.clearAuth)

  const handleLogout = () => {
    clearAuth();
    router.replace("/login");
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <span className="text-sm text-gray-500">Welcome back</span>
      <button 
      className="flex items-center gap-2 text-sm text-gray-600  hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </header>
  );
}
