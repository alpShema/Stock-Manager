"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
  Users,
  ClipboardList,
  X,
} from "lucide-react";
import { clsx } from "clsx";
import { useAuthStore } from "@/store/authStore";

const nav = [
  { label: "Dashboard",   href: "/dashboard",  icon: LayoutDashboard, superAdminOnly: false },
  { label: "Stock",       href: "/stock",       icon: Package,         superAdminOnly: false },
  { label: "Sales",       href: "/sales",       icon: ShoppingCart,    superAdminOnly: false },
  { label: "Till",        href: "/till",        icon: Wallet,          superAdminOnly: false },
  { label: "Users",       href: "/users",       icon: Users,           superAdminOnly: true  },
  { label: "Audit Trail", href: "/audit",       icon: ClipboardList,   superAdminOnly: true  },
];

function roleLabel(role: string | null) {
  if (role === "SUPER_ADMIN") return "super admin"
  if (role === "ADMIN") return "admin"
  return "user"
}

export function Sidebar({ onClose }: Readonly<{ onClose?: () => void }>) {
  const pathname = usePathname();
  const name = useAuthStore(state => state.name);
  const role = useAuthStore(state => state.role);

  return (
    <aside className="w-60 h-full bg-white border-r flex flex-col">
      {/* Brand + user info */}
      <div className="h-16 flex items-center justify-between px-6 border-b flex-shrink-0">
        <div>
          <p className="font-bold text-blue-600 text-sm leading-tight">DALYDA Stock Manager</p>
          {name && (
            <p className="text-xs text-gray-500 mt-0.5">
              {name} <span className="text-gray-400">({roleLabel(role)})</span>
            </p>
          )}
        </div>
        {/* Close button — mobile only */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {nav.filter(item => !item.superAdminOnly || role === "SUPER_ADMIN").map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={clsx(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname.startsWith(href)
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
