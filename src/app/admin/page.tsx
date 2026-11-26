"use client";

import { useState } from "react";
import Link from "next/link";

const ADMIN_PASSWORD = "henlyadmin123";

interface Booking {
  id: number;
  booking_id: string;
  name: string;
  email: string;
  contact: string;
  event: string;
  date_time: string;
  service_type: string;
  notes: string;
  status: string;
  created_at: string;
}

interface Order {
  id: number;
  order_id: string;
  name: string;
  contact: string;
  city: string;
  address: string;
  payment: string;
  items: { id: number; name: string; price: number; qty: number }[];
  total: number;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<"bookings" | "orders">("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings?all=true");
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings || []);
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setAuthError("");
      fetchAllData();
    } else {
      setAuthError("Incorrect admin password.");
    }
  };

  const handleStatusUpdate = async (type: "booking" | "order", recordId: string, newStatus: string) => {
    setUpdatingId(recordId);
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id: recordId, status: newStatus }),
      });
      if (res.ok) {
        await fetchAllData();
      } else {
        alert("Failed to update status.");
      }
    } catch {
      alert("Error updating status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#3E3C32] flex items-center justify-center p-6 text-[#F5F3EE]">
        <div className="bg-[#26251E] border border-[#C8A458]/40 rounded-3xl p-8 max-w-sm w-full shadow-xl space-y-5">
          <div className="text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-[#C8A458]/15 text-[#C8A458] text-[10px] font-bold uppercase tracking-wider mb-2">
              Private Access
            </span>
            <h1 className="font-serif text-2xl font-bold">
              Henly Studio<span className="text-[#C8A458]">.pk</span> Admin
            </h1>
            <p className="text-xs text-[#A8A294] mt-1">Enter admin password to manage bookings &amp; orders.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              required
              placeholder="Enter Admin Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#3E3C32] border border-[#C8A458]/30 text-sm text-white focus:outline-none focus:border-[#C8A458]"
            />
            {authError && <p className="text-xs text-red-400">{authError}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#C8A458] text-[#26251E] font-bold text-xs uppercase tracking-wider cursor-pointer hover:opacity-95"
            >
              Unlock Dashboard →
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/studio" className="text-[11px] text-[#A8A294] underline hover:text-[#C8A458]">
              ← Back to Studio Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#26251E]">
      <header className="bg-[#3E3C32] text-[#F5F3EE] border-b border-[#C8A458]/30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-xl font-bold">
              Henly Studio<span className="text-[#C8A458]">.pk</span> — Admin Panel
            </h1>
            <p className="text-[11px] text-[#D6D1C4]">Manage Event Bookings &amp; Organic Cones Orders</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchAllData}
              className="px-4 py-2 rounded-full border border-[#C8A458]/60 text-xs text-[#C8A458] hover:bg-[#C8A458]/10 cursor-pointer"
            >
              {loading ? "Refreshing..." : "↻ Refresh"}
            </button>
            <Link
              href="/studio"
              className="px-4 py-2 rounded-full bg-[#C8A458] text-[#26251E] text-xs font-bold"
            >
              View Studio ↗
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-3 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
              activeTab === "bookings"
                ? "bg-[#3E3C32] text-[#C8A458]"
                : "bg-white border border-[#E5DFD3] text-[#5E594E]"
            }`}
          >
            Event Bookings ({bookings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
              activeTab === "orders"
                ? "bg-[#3E3C32] text-[#C8A458]"
                : "bg-white border border-[#E5DFD3] text-[#5E594E]"
            }`}
          >
            Cones Orders ({orders.length})
          </button>
        </div>

        {activeTab === "bookings" && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-[#E5DFD3] text-xs text-[#7A7467]">
                No event bookings found yet.
              </div>
            ) : (
              bookings.map((b) => (
                <div
                  key={b.booking_id}
                  className="bg-white rounded-3xl p-6 border border-[#E5DFD3] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono font-bold text-xs bg-[#3E3C32] text-[#C8A458] px-3 py-1 rounded-full">
                        {b.booking_id}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          b.status === "Approved"
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}
                      >
                        {b.status}
                      </span>
                      <span className="text-xs font-bold text-[#3E3C32]">{b.event}</span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1 text-xs text-[#5E594E] pt-1">
                      <p><strong>Client:</strong> {b.name}</p>
                      <p><strong>Contact:</strong> {b.contact}</p>
                      <p><strong>Email:</strong> {b.email}</p>
                      <p><strong>Date &amp; Time:</strong> {b.date_time ? new Date(b.date_time).toLocaleString() : "N/A"}</p>
                      <p className="sm:col-span-2"><strong>Location:</strong> {b.service_type}</p>
                      {b.notes && (
                        <p className="sm:col-span-2 bg-[#F7F5F0] p-2.5 rounded-xl mt-1 text-[#3E3C32]">
                          <strong>Notes:</strong> {b.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {b.status !== "Approved" ? (
                      <button
                        type="button"
                        disabled={updatingId === b.booking_id}
                        onClick={() => handleStatusUpdate("booking", b.booking_id, "Approved")}
                        className="px-5 py-2.5 rounded-full bg-green-700 text-white text-xs font-bold cursor-pointer hover:bg-green-800 disabled:opacity-50"
                      >
                        {updatingId === b.booking_id ? "Updating..." : "✓ Approve Booking"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={updatingId === b.booking_id}
                        onClick={() => handleStatusUpdate("booking", b.booking_id, "Pending Approval")}
                        className="px-4 py-2 rounded-full border border-[#E5DFD3] text-xs text-[#5E594E] cursor-pointer hover:bg-[#F7F5F0]"
                      >
                        Mark Pending
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-[#E5DFD3] text-xs text-[#7A7467]">
                No cones orders found yet.
              </div>
            ) : (
              orders.map((o) => (
                <div
                  key={o.order_id}
                  className="bg-white rounded-3xl p-6 border border-[#E5DFD3] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono font-bold text-xs bg-[#3E3C32] text-[#C8A458] px-3 py-1 rounded-full">
                        {o.order_id}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          o.status === "Completed" || o.status === "Approved"
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}
                      >
                        {o.status}
                      </span>
                      <span className="text-sm font-bold text-[#3E3C32]">
                        Rs. {Number(o.total || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1 text-xs text-[#5E594E] pt-1">
                      <p><strong>Customer:</strong> {o.name}</p>
                      <p><strong>Contact:</strong> {o.contact}</p>
                      <p><strong>City:</strong> {o.city}</p>
                      <p><strong>Payment:</strong> {o.payment}</p>
                      <p className="sm:col-span-2"><strong>Address:</strong> {o.address}</p>
                    </div>

                    {Array.isArray(o.items) && o.items.length > 0 && (
                      <div className="bg-[#F7F5F0] p-3 rounded-xl text-xs space-y-1 mt-2">
                        <p className="font-bold text-[#3E3C32]">Ordered Packs:</p>
                        {o.items.map((item, idx) => (
                          <p key={idx} className="text-[#5E594E]">
                            • {item.name} × {item.qty} — Rs. {(item.price * item.qty).toLocaleString()}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {o.status !== "Completed" ? (
                      <button
                        type="button"
                        disabled={updatingId === o.order_id}
                        onClick={() => handleStatusUpdate("order", o.order_id, "Completed")}
                        className="px-5 py-2.5 rounded-full bg-green-700 text-white text-xs font-bold cursor-pointer hover:bg-green-800 disabled:opacity-50"
                      >
                        {updatingId === o.order_id ? "Updating..." : "✓ Mark Dispatched / Done"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={updatingId === o.order_id}
                        onClick={() => handleStatusUpdate("order", o.order_id, "Pending")}
                        className="px-4 py-2 rounded-full border border-[#E5DFD3] text-xs text-[#5E594E] cursor-pointer hover:bg-[#F7F5F0]"
                      >
                        Mark Pending
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
