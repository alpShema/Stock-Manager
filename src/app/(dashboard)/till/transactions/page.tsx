"use client"

import { useState, useEffect } from "react"
import { useAuthStore } from "@/store/authStore"
import { ArrowLeft, RotateCcw, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface ViewTillTransactionDto {
  id: string
  type: string
  amount: number
  currency: string
  description: string
  recordedBy: string
  transactionDate: string
}

function formatAmount(amount: number, currency: string) {
  if (currency === "USD") {
    return amount < 0 ? `-$${Math.abs(amount).toFixed(2)}` : `$${amount.toFixed(2)}`
  }
  const abs = Math.abs(amount)
  const formatted = abs.toLocaleString() + " Francs"
  return amount < 0 ? `-${formatted}` : formatted
}

function formatDateTime(iso: string) {
  if (!iso) return ""
  const d = new Date(iso)
  return d.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })
}

export default function TillTransactionsPage() {
  const token = useAuthStore(state => state.token)
  const role = useAuthStore(state => state.role)
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN"

  const [transactions, setTransactions] = useState<ViewTillTransactionDto[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(false)

  const [reverseTarget, setReverseTarget] = useState<ViewTillTransactionDto | null>(null)
  const [reverseError, setReverseError] = useState("")
  const [reversing, setReversing] = useState(false)

  const size = 10

  async function fetchTransactions(p = 0) {
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/till/transactions?page=${p}&size=${size}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const json = await res.json()
      const pageData = json.data ?? {}
      setTransactions(pageData.content ?? [])
      setTotalPages(pageData.totalPages ?? 1)
      setTotalElements(pageData.totalElements ?? 0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTransactions(page) }, [token, page])

  async function handleReverse() {
    if (!reverseTarget) return
    setReversing(true)
    setReverseError("")
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/till/delete/transaction/${reverseTarget.id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      )
      if (!res.ok) {
        const j = await res.json()
        setReverseError(j.message ?? "Reverse failed")
        return
      }
      setReverseTarget(null)
      fetchTransactions(page)
    } catch {
      setReverseError("Network error")
    } finally {
      setReversing(false)
    }
  }

  const from = totalElements === 0 ? 0 : page * size + 1
  const to = Math.min((page + 1) * size, totalElements)

  return (
    <div>
      {/* Back link */}
      <Link href="/till" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Till Management
      </Link>

      {/* Header */}
      <h1 className="text-2xl font-bold">Till Transaction History</h1>
      <p className="text-sm text-gray-500 mt-1">Complete record of <span className="text-blue-600">all till transactions</span></p>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b">
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Date &amp; Time</th>
              <th className="px-6 py-3">Recorded By</th>
              <th className="px-6 py-3">Currency</th>
              <th className="px-6 py-3 text-right">Amount</th>
              {isAdmin && <th className="px-6 py-3 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr key="loading"><td colSpan={isAdmin ? 6 : 5} className="px-6 py-8 text-center text-gray-400 text-sm">Loading…</td></tr>
            ) : transactions.length === 0 ? (
              <tr key="empty"><td colSpan={isAdmin ? 6 : 5} className="px-6 py-8 text-center text-gray-400 text-sm">No transactions found.</td></tr>
            ) : transactions.map(tx => (
              <tr key={tx.id} className="text-sm text-gray-700 border-b hover:bg-gray-50">
                <td className="px-6 py-4">{tx.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatDateTime(tx.transactionDate)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{tx.recordedBy}</td>
                <td className="px-6 py-4 whitespace-nowrap">{tx.currency === "USD" ? "USD" : "Francs"}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-right font-medium ${tx.amount < 0 ? "text-red-500" : "text-gray-800"}`}>
                  {formatAmount(tx.amount, tx.currency)}
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => { setReverseTarget(tx); setReverseError("") }}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"
                      title="Reverse transaction"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <p className="text-sm text-gray-500">
            Showing {from} to {to} of {totalElements} items
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded border text-gray-500 hover:bg-gray-50 disabled:opacity-40"
            >
              &lt;
            </button>
            <span className="text-sm text-gray-600 px-2">Page {page + 1} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded border text-gray-500 hover:bg-gray-50 disabled:opacity-40"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Reverse Transaction Modal */}
      {reverseTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              </div>
              <h2 className="font-semibold text-gray-800">Reverse Transaction</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to reverse the transaction <strong>&quot;{reverseTarget.description}&quot;</strong>?
            </p>
            {reverseError && <p className="text-red-500 text-sm mb-3">{reverseError}</p>}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setReverseTarget(null)}
                className="px-4 py-2 text-sm rounded-lg border text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReverse}
                disabled={reversing}
                className="px-4 py-2 text-sm rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
              >
                {reversing ? "Reversing…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
