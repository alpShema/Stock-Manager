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

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const token = useAuthStore(state => state.token)

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
    }

    if (token) fetchStats()
  }, [token])

  return (
    <div>

      {/* Header */}
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-500 text-sm mt-1">Welcome back! Here's the business overview.</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <StatCard
          title="Total Stock Items"
          value={stats.stockTotal}
          icon={<Package className="w-6 h-6 text-blue-600" />}
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Stock Value"
          value={`$${stats.stockValue.toFixed(2)}`}
          icon={<DollarSign className="w-6 h-6 text-green-600" />}
          iconBg="bg-green-50"
        />
        <StatCard
          title="Weekly Sales"
          value={stats.salesTotal}
          icon={<ShoppingCart className="w-6 h-6 text-purple-600" />}
          iconBg="bg-purple-50"
        />
        <StatCard
          title="Weekly Sales Value"
          value={`$${stats.salesValue.toFixed(2)}`}
          icon={<DollarSign className="w-6 h-6 text-green-600" />}
          iconBg="bg-green-50"
        />
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
              <th className="px-6 py-3 whitespace-nowrap">Item Code</th>
              <th className="px-6 py-3 whitespace-nowrap">Item Name</th>
              <th className="px-6 py-3 whitespace-nowrap">Date</th>
              <th className="px-6 py-3 whitespace-nowrap">Container</th>
              <th className="px-6 py-3 whitespace-nowrap">Recorded By</th>
              <th className="px-6 py-3 whitespace-nowrap">Quantity</th>
              <th className="px-6 py-3 whitespace-nowrap text-right">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {recentSales.map((sale, index) => (
              <tr key={`${sale.code}-${sale.date}-${index}`} className="text-sm text-gray-600 border-b hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{sale.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.containerName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.recordedBy}</td>
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
        <div className="grid grid-cols-3 gap-4">
          <a href="/stock/add" className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <Package className="w-8 h-8 text-blue-600 mb-3" />
            <p className="font-medium text-gray-800">Add Stock</p>
            <p className="text-sm text-gray-500 mt-1">Add new inventory item</p>
          </a>
          <a href="/sales/add" className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <ShoppingCart className="w-8 h-8 text-green-600 mb-3" />
            <p className="font-medium text-gray-800">Record Sale</p>
            <p className="text-sm text-gray-500 mt-1">Add new sales transaction</p>
          </a>
          <a href="/stock/add" className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <Package className="w-8 h-8 text-purple-600 mb-3" />
            <p className="font-medium text-gray-800">Bulk Upload</p>
            <p className="text-sm text-gray-500 mt-1">Upload Excel file</p>
          </a>
        </div>
      </div>

    </div>
  )
}
