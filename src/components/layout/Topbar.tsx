"use client";

import { useState } from "react";
import { LogOut, KeyRound, X, Eye, EyeOff, Menu } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export function Topbar({ onMenuClick }: Readonly<{ onMenuClick?: () => void }>) {
  const router = useRouter();
  const clearAuth = useAuthStore(state => state.clearAuth);
  const token = useAuthStore(state => state.token);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogout = () => {
    clearAuth();
    router.replace("/login");
  };

  function openModal() {
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setError(""); setSuccess("");
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.currentPassword) { setError("Please enter your current password."); return; }
    if (!form.newPassword) { setError("Please enter a new password."); return; }
    if (form.newPassword.length < 6) { setError("New password must be at least 6 characters."); return; }
    if (!form.confirmPassword) { setError("Please confirm your new password."); return; }
    if (form.newPassword !== form.confirmPassword) { setError("New passwords do not match. Please try again."); return; }
    if (form.newPassword === form.currentPassword) { setError("New password must be different from your current password."); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/password/change`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword, confirmPassword: form.confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message ?? "Incorrect current password or request failed. Please try again."); return; }
      setSuccess("Your password has been changed successfully. Use your new password next time you log in.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch { setError("Unable to connect to the server. Please check your connection and try again."); }
    finally { setLoading(false); }
  }

  return (
    <>
      <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <button onClick={onMenuClick} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg" aria-label="Toggle menu">
            <Menu className="w-5 h-5" />
          </button>
          <span className="hidden sm:block text-sm text-gray-500">Welcome back</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openModal}
            className="flex items-center gap-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
          >
            <KeyRound className="w-4 h-4" />
            <span className="hidden sm:inline">Change Password</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Change Password</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            {success ? (
              <div className="text-center py-4">
                <p className="text-green-600 font-medium mb-4">{success}</p>
                <button onClick={() => setShowModal(false)} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Done</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={form.currentPassword}
                      onChange={e => setForm({ ...form, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={form.newPassword}
                      onChange={e => setForm({ ...form, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                    {loading ? "Changing…" : "Change Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
