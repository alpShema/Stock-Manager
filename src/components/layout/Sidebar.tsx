"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package, 
  ShoppingCart,
  Wallet,
  Receipt,
  CreditCard, 
  TrendingUp, 
  Users, 
  ClipboardList,
} from "lucide-react";
import { clsx } from "clsx";

const nav = [
  { label: "Dashboard",  href: "/dashboard",  icon: LayoutDashboard },
  { label: "Stock",      href: "/stock",       icon: Package },
  { label: "Sales",      href: "/sales",       icon: ShoppingCart },
  { label: "Till",       href: "/till",        icon: Wallet },
  { label: "Expenses",   href: "/expenses",    icon: Receipt },
  { label: "Debt",       href: "/debt",        icon: CreditCard },
  { label: "Advance",    href: "/advance",     icon: TrendingUp },
  { label: "Users",      href: "/users",       icon: Users },
  { label: "Audit Trail",href: "/audit",       icon: ClipboardList },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 bg-white border-r flex flex-col">
      <div className="h-16 flex items-center px-6 font-bold text-lg border-b">
        Dalyda
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname.startsWith(href)
                ? "bg-primary-50 text-primary-700"
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
