"use client"

import { useState, useEffect } from "react"
import { useAuthStore } from "@/store/authStore"
import { Package, DollarSign, ShoppingCart } from "lucide-react"
import Link from "next/link"


// ─── Stat Card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  iconBg: string
}

function StatCard({ title, value, icon, iconBg }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 flex items-center justify-between shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${iconBg}`}>
        {icon}
      </div>
    </div>
  )
}

const gridCols: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const token = useAuthStore(state => state.token)
  const role = useAuthStore(state => state.role)
  const name = useAuthStore(state => state.name)

  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN"

  const [stats, setStats] = useState({
    stockTotal: 0,
    stockValue: 0,
    salesTotal: 0,
    salesValue: 0,
  })

  const [recentSales, setRecentSales] = useState<any[]>([])

  useEffect(() => {
    async function fetchStats() {
      const headers = { Authorization: `Bearer ${token}` }

      if (isAdmin) {
        const [stockTotal, stockValue, salesTotal, salesValue, recent] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/stock/total`, { headers }).then(r => r.json()),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/stock/value`, { headers }).then(r => r.json()),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/sales/total`, { headers }).then(r => r.json()),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/sales/value`, { headers }).then(r => r.json()),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/sales/recent`, { headers }).then(r => r.json()),
        ])
        setStats({
          stockTotal: stockTotal.data,
          stockValue: stockValue.data,
          salesTotal: salesTotal.data,
          salesValue: salesValue.data,
        })
        setRecentSales(recent.data)
      } else {
        const [stockTotal, salesTotal, recent] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/stock/total`, { headers }).then(r => r.json()),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/sales/total`, { headers }).then(r => r.json()),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/sales/recent`, { headers }).then(r => r.json()),
        ])
        setStats(prev => ({
          ...prev,
          stockTotal: stockTotal.data,
          salesTotal: salesTotal.data,
        }))
        setRecentSales(recent.data)
      }
    }

    if (token) fetchStats()
  }, [token, isAdmin])

  const statCards = [
    {
      title: "Total Stock Items",
      value: stats.stockTotal,
      icon: <Package className="w-6 h-6 text-blue-600" />,
      iconBg: "bg-blue-50",
      adminOnly: false,
    },
    {
      title: "Stock Value",
      value: `$${(stats.stockValue ?? 0).toFixed(2)}`,
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      iconBg: "bg-green-50",
      adminOnly: true,
    },
    {
      title: "Weekly Sales Count",
      value: stats.salesTotal,
      icon: <ShoppingCart className="w-6 h-6 text-purple-600" />,
      iconBg: "bg-purple-50",
      adminOnly: false,
    },
    {
      title: "Weekly Sales Value",
      value: `$${(stats.salesValue ?? 0).toFixed(2)}`,
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      iconBg: "bg-green-50",
      adminOnly: true,
    },
  ].filter(card => !card.adminOnly || isAdmin)

  const quickActions = [
    {
      href: "/stock",
      icon: <Package className="w-8 h-8 text-blue-600 mb-3" />,
      label: "View Stock",
      description: "Browse available inventory",
      adminOnly: false,
    },
    {
      href: "/sales/add",
      icon: <ShoppingCart className="w-8 h-8 text-green-600 mb-3" />,
      label: "Record Sale",
      description: "Add new sales transaction",
      adminOnly: false,
    },
    {
      href: "/stock/add",
      icon: <Package className="w-8 h-8 text-purple-600 mb-3" />,
      label: "Bulk Upload",
      description: "Upload Excel file",
      adminOnly: true,
    },
  ].filter(action => !action.adminOnly || isAdmin)

  return (
    <div>

      {/* Header */}
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-500 text-sm mt-1">Welcome back{name ? `, ${name}` : ""}! Here's the business overview.</p>

      {/* Stat Cards */}
      <div className={`grid ${gridCols[statCards.length]} gap-4 mt-6`}>
        {statCards.map(card => (
          <StatCard key={card.title} title={card.title} value={card.value} icon={card.icon} iconBg={card.iconBg} />
        ))}
      </div>

      {/* Recent Sales Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">Recent Sales</h2>
          <Link href="/sales" className="text-sm text-blue-600 hover:underline">View All</Link>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b">
              {isAdmin && <th className="px-6 py-3 whitespace-nowrap">Item Code</th>}
              <th className="px-6 py-3 whitespace-nowrap">Item Name</th>
              <th className="px-6 py-3 whitespace-nowrap">Date</th>
              <th className="px-6 py-3 whitespace-nowrap">Container</th>
              {isAdmin && <th className="px-6 py-3 whitespace-nowrap">Recorded By</th>}
              <th className="px-6 py-3 whitespace-nowrap">Quantity</th>
              <th className="px-6 py-3 whitespace-nowrap text-right">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {recentSales.map((sale, index) => (
              <tr key={`${sale.code}-${sale.date}-${index}`} className="text-sm text-gray-600 border-b hover:bg-gray-50">
                {isAdmin && <td className="px-6 py-4 whitespace-nowrap">{sale.code}</td>}
                <td className="px-6 py-4 whitespace-nowrap">{sale.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.containerName}</td>
                {isAdmin && <td className="px-6 py-4 whitespace-nowrap">{sale.recordedBy}</td>}
                <td className="px-6 py-4 whitespace-nowrap">{sale.quantity} units</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">${sale.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="mt-6">
        <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className={`grid ${gridCols[quickActions.length]} gap-4`}>
          {quickActions.map(action => (
            <Link key={action.href} href={action.href} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              {action.icon}
              <p className="font-medium text-gray-800">{action.label}</p>
              <p className="text-sm text-gray-500 mt-1">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
