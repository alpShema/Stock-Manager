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

export function Sidebar() {
  const pathname = usePathname();
  const name = useAuthStore(state => state.name);
  const role = useAuthStore(state => state.role);

  return (
    <aside className="w-60 bg-white border-r flex flex-col">
      {/* Brand + user info */}
      <div className="h-16 flex flex-col justify-center px-6 border-b">
        <p className="font-bold text-blue-600 text-sm leading-tight">DALYDA Stock Manager</p>
        {name && (
          <p className="text-xs text-gray-500 mt-0.5">
            {name} <span className="text-gray-400">({roleLabel(role)})</span>
          </p>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {nav.filter(item => !item.superAdminOnly || role === "SUPER_ADMIN").map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname.startsWith(href)
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
