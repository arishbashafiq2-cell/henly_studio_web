"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";


import emailjs from "@emailjs/browser";

const INSTA_URL = "https://instagram.com/henly_studio.pk";

const CONES = [
  { id: 1, name: "Organic Cones (Pack of 5)", desc: "0.35mm precision tip, 100% chemical-free paste for a rich maroon stain.", price: 1800, tag: "Starter Pack", image: "/cones5.jpeg" },
  { id: 2, name: "Organic Cones (Pack of 10)", desc: "Freshly rolled batch ideal for family events, dholaks & henna lovers.", price: 2800, tag: "Best Seller", image: "/cones10.jpeg" },
  { id: 3, name: "Organic Cones (Pack of 20)", desc: "Value event box for weddings, Eid celebrations & group bookings.", price: 3950, tag: "Event Box", image: "/cones20.jpeg" },
  { id: 4, name: "Organic Cones (Pack of 30)", desc: "Bulk bridal & professional artist box made fresh to order.", price: 5200, tag: "Bulk Saver", image: "/cones30.jpeg" },
];

const EVENTS = [
  { title: "Signature Bridal Henna", tag: "Bridal", desc: "Intricate full-arm & feet bridal designs customized to your story." },
  { title: "Nikah & Engagement", tag: "Minimalist", desc: "Delicate fine-line floral patterns & modern mandalas." },
  { title: "Mehndi & Dholak Nights", tag: "Weddings", desc: "Group bookings for brides, sisters, and wedding guests." },
  { title: "Birthday Parties", tag: "Celebrations", desc: "Trendy henna art stalls for birthdays and private gatherings." },
  { title: "Eid Chaand Raat", tag: "Festive", desc: "Special festive mehndi designs for Eid celebrations." },
  { title: "Bridal / Baby Showers", tag: "All Events", desc: "Custom henna sessions for showers and special occasions." },
];

const sendCustomerEmail = async (params: {
  to_email: string;
  to_name: string;
  subject: string;
  message: string;
  tracking_id: string;
  status: string;
}) => {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn("EmailJS keys missing in .env.local");
    return;
  }

  try {
    await emailjs.send(serviceId, templateId, params, publicKey);
  } catch (err) {
    console.error("EmailJS send failed:", err);
  }
};

export default function StudioPage() {
  // Cart States
  const [cart, setCart] = useState<{ id: number; name: string; price: number; qty: number }[]>([]);
  const [orderInfo, setOrderInfo] = useState({
    name: "",
    email: "",
    contact: "",
    city: "",
    address: "",
    payment: "Cash on Delivery (COD)",
  });
  const [orderDone, setOrderDone] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);

  // Booking States
  const [booking, setBooking] = useState({
    name: "",
    email: "",
    contact: "",
    event: "Signature Bridal Henna",
    dateTime: "",
    serviceType: "Home Service (Rawalpindi / Islamabad)",
    notes: "",
  });
  const [agreedPolicy, setAgreedPolicy] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Track Status States
  const [trackId, setTrackId] = useState("");
  const [trackResult, setTrackResult] = useState<{
    status: string;
    name: string;
    event: string;
    dateTime: string;
  } | null>(null);
  const [trackError, setTrackError] = useState("");

  const addToCart = (p: { id: number; name: string; price: number }) => {
    setOrderDone(false);
    setOrderId("");
    setCart((prev) => {
      const found = prev.find((i) => i.id === p.id);
      return found ? prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i)) : [...prev, { ...p, qty: 1 }];
    });
  };

  const updateQty = (id: number, d: number) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + d } : i)).filter((i) => i.qty > 0));
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "order",
          ...orderInfo,
          items: cart,
          total,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");

      setOrderId(data.orderId);
      setOrderDone(true);

      await sendCustomerEmail({
        to_email: orderInfo.email,
        to_name: orderInfo.name,
        subject: `Cones Order Received (${data.orderId}) - Henly Studio.pk`,
        message: `We have received your organic henna cones order worth Rs. ${total.toLocaleString()}. Our team will verify and dispatch your parcel soon.`,
        tracking_id: data.orderId,
        status: "Pending Confirmation",
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setOrderLoading(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError("");

    if (!agreedPolicy) {
      setBookingError("Please check the box to agree to the booking policy.");
      return;
    }

    const selectedTime = new Date(booking.dateTime).getTime();
    if (selectedTime < Date.now()) {
      setBookingError("Please select a valid future date and time.");
      return;
    }

    setBookingLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "booking",
          ...booking,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setBookingId(data.bookingId);

      await sendCustomerEmail({
        to_email: booking.email,
        to_name: booking.name,
        subject: `Booking Request Received (${data.bookingId}) - Henly Studio.pk`,
        message: `We have received your booking request for ${booking.event}. Please DM us on Instagram (@henly_studio.pk) with your Tracking ID to discuss your design and send the 50% advance to lock your slot.`,
        tracking_id: data.bookingId,
        status: "Pending Approval",
      });
    } catch (err: unknown) {
      setBookingError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleTrackStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError("");
    setTrackResult(null);
    if (!trackId.trim()) return;

    try {
      const res = await fetch(`/api/bookings?id=${encodeURIComponent(trackId.trim().toUpperCase())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking ID not found");
      setTrackResult(data);
    } catch (err: unknown) {
      setTrackError(err instanceof Error ? err.message : "Booking ID not found");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#26251E]">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-[#3E3C32] text-[#F5F3EE] border-b border-[#C8A458]/30">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">


            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#C8A458]/60">
              <Image src="/logo.png.jpeg" alt="Henly Studio" fill sizes="40px" className="object-cover" />
            </div>
            <span className="text-xl font-serif font-bold">
              Henly Studio<span className="text-[#C8A458]">.pk</span>
            </span>
          </Link>

          <nav className="hidden md:flex gap-7 text-xs uppercase tracking-widest text-[#c7b788]">
            <a href="#events" className="hover:text-[#C8A458]">Events</a>
            <a href="#shop" className="hover:text-[#C8A458]">Shop Cones</a>
            <a href="#bookings" className="hover:text-[#C8A458]">Book Date</a>
            <a href="#gallery" className="hover:text-[#C8A458]">Gallery</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={INSTA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-block border border-[#C8A458]/60 px-4 py-2 rounded-full text-xs hover:bg-[#C8A458]/15"
            >
              Instagram ↗
            </a>
            <a href="#shop" className="bg-[#C8A458] text-[#26251E] px-4 py-2 rounded-full text-xs font-bold">
              Cart ({cart.reduce((s, i) => s + i.qty, 0)})
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#3E3C32] text-[#F5F3EE] py-16 px-6 text-center border-b border-[#C8A458]/20">
        <span className="inline-block px-4 py-1 rounded-full bg-[#C8A458]/15 border border-[#C8A458]/40 text-[#C8A458] text-xs mb-4">
          100% Chemical-Free • Fresh Organic Cones
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold max-w-4xl mx-auto mb-4">
          Henna Art for Every Celebration &amp; <span className="text-[#C8A458] italic">Fresh Organic Cones</span>
        </h1>
        <p className="text-sm text-[#D6D1C4] max-w-xl mx-auto mb-8">
          Book our studio artists for Bridal, Dholak, Birthdays &amp; Eid—or order freshly rolled organic henna cones delivered nationwide.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#bookings" className="px-7 py-3 rounded-full bg-[#C8A458] text-[#26251E] font-bold text-xs uppercase tracking-wider">
            Book an Event
          </a>
          <a href="#shop" className="px-7 py-3 rounded-full border border-[#C8A458]/60 text-xs uppercase tracking-wider hover:bg-[#C8A458]/10">
            Order Cones
          </a>
          <a href={INSTA_URL} target="_blank" rel="noopener noreferrer" className="px-7 py-3 rounded-full border border-[#F5F3EE]/30 text-xs uppercase tracking-wider hover:border-[#C8A458]">
            Instagram DM ↗
          </a>
        </div>
      </section>

      {/* All Events */}
      <section id="events" className="max-w-6xl mx-auto px-6 pt-16 pb-8">
        <h2 className="text-3xl font-serif font-bold text-[#3E3C32] text-center mb-10">
          All-Events Henna Services
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {EVENTS.map((ev, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-[#E5DFD3] flex flex-col justify-between">
              <div>
                <span className="inline-block text-[10px] font-bold uppercase bg-[#3E3C32] text-[#C8A458] px-3 py-1 rounded-full mb-3">
                  {ev.tag}
                </span>
                <h3 className="font-serif font-bold text-lg text-[#3E3C32] mb-2">{ev.title}</h3>
                <p className="text-xs text-[#5E594E] mb-4">{ev.desc}</p>
              </div>
              <a
                href="#bookings"
                onClick={() => {
                  setBooking((prev) => ({ ...prev, event: ev.title }));
                  setBookingId("");
                }}
                className="text-xs font-bold text-[#3E3C32] underline hover:text-[#C8A458]"
              >
                Book This Event →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Cones Store + Cart */}
      <section id="shop" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-serif font-bold text-[#3E3C32] mb-2">Order Organic Henna Cones</h2>
        <p className="text-xs text-[#6B6659] mb-8">*Made fresh to order. Keep frozen until use.</p>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Products Grid */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {CONES.map((p) => (
              <div key={p.id} className="bg-white rounded-3xl p-6 border border-[#E5DFD3] flex flex-col justify-between shadow-sm">
                <div>
                  <div className="h-64 bg-[#F2EFE8] rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden border border-[#E5DFD3]/60">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 350px"
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-3xl">🌿</span>
                    )}
                    <span className="absolute top-3 left-3 z-10 bg-[#3E3C32]/90 text-[#C8A458] text-[10px] font-semibold uppercase px-3 py-1 rounded-full shadow">
                      {p.tag}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#3E3C32] mb-1">{p.name}</h3>
                  <p className="text-xs text-[#5E584D] mb-4">{p.desc}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#EFECE4]">
                  <span className="font-bold text-base text-[#3E3C32]">Rs. {p.price.toLocaleString()}</span>
                  <button
                    type="button"
                    onClick={() => addToCart(p)}
                    className="bg-[#3E3C32] text-[#F5F3EE] px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#C8A458] hover:text-[#26251E] transition-colors cursor-pointer"
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Box */}
          <div className="bg-white rounded-3xl p-6 border-2 border-[#C8A458]/40 shadow-sm sticky top-24">
            <h3 className="font-serif font-bold text-xl text-[#3E3C32] mb-4 pb-3 border-b border-[#EFECE4]">
              Your Cones Order 🛍️
            </h3>

            {orderDone ? (
              <div className="py-6 text-center space-y-3">
                <p className="text-2xl">✓</p>
                <h4 className="font-serif font-bold text-lg">Order Submitted!</h4>
                {orderId && (
                  <p className="text-xs font-mono font-bold bg-[#F7F5F0] py-1.5 px-3 rounded-xl border border-[#C8A458] inline-block">
                    Order ID: {orderId}
                  </p>
                )}
                <p className="text-xs text-[#5E594E]">
                  Thank you {orderInfo.name}! Confirmation sent to <strong>{orderInfo.email}</strong>. Total: Rs. {total.toLocaleString()}.
                </p>
                <a
                  href={INSTA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 rounded-full bg-[#C8A458] text-[#26251E] font-bold text-xs"
                >
                  Message @henly_studio.pk ↗
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setCart([]);
                    setOrderDone(false);
                    setOrderId("");
                  }}
                  className="text-xs underline text-[#7A7467] cursor-pointer"
                >
                  New Order
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <p className="text-xs text-[#7A7467]">Your cart is empty. Select cones to order.</p>
                <a
                  href={INSTA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold underline text-[#3E3C32]"
                >
                  Or order via Instagram DM ↗
                </a>
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit} className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs bg-[#F7F5F0] p-2.5 rounded-xl">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-[#7A7467]">Rs. {(item.price * item.qty).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, -1)}
                        className="w-6 h-6 rounded-full bg-white border font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span>{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, 1)}
                        className="w-6 h-6 rounded-full bg-white border font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between font-bold text-sm pt-2 border-t">
                  <span>Total:</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>

                <input
                  required
                  placeholder="Full Name"
                  value={orderInfo.name}
                  onChange={(e) => setOrderInfo({ ...orderInfo, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F5F0] border text-xs"
                />
                <input
                  required
                  type="email"
                  placeholder="Email Address (For Confirmation)"
                  value={orderInfo.email}
                  onChange={(e) => setOrderInfo({ ...orderInfo, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F5F0] border text-xs"
                />
                <input
                  required
                  placeholder="Phone or Instagram Handle"
                  value={orderInfo.contact}
                  onChange={(e) => setOrderInfo({ ...orderInfo, contact: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F5F0] border text-xs"
                />
                <input
                  required
                  placeholder="City"
                  value={orderInfo.city}
                  onChange={(e) => setOrderInfo({ ...orderInfo, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F5F0] border text-xs"
                />
                <input
                  required
                  placeholder="Complete Address"
                  value={orderInfo.address}
                  onChange={(e) => setOrderInfo({ ...orderInfo, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F5F0] border text-xs"
                />
                <select
                  value={orderInfo.payment}
                  onChange={(e) => setOrderInfo({ ...orderInfo, payment: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F5F0] border text-xs"
                >
                  <option>Cash on Delivery (COD)</option>
                  <option>Raast / SadaPay / Bank Transfer</option>
                </select>

                <button
                  type="submit"
                  disabled={orderLoading}
                  className="w-full py-3 rounded-full bg-[#3E3C32] text-[#C8A458] font-bold text-xs uppercase cursor-pointer hover:bg-[#26251E] transition-colors disabled:opacity-50"
                >
                  {orderLoading ? "Submitting Order..." : "Submit Cones Order ✓"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Bookings + Guidelines + Status Tracker */}
      <section id="bookings" className="max-w-6xl mx-auto px-6 py-16 border-t border-[#E5DFD3]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-[#3E3C32] text-[#C8A458] text-[10px] font-bold uppercase tracking-wider mb-3">
            Reserve Your Slot
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#3E3C32] mb-2">Book an Event Appointment</h2>
          <p className="text-xs text-[#6B6659]">
            Submit your details to get a Tracking ID, then discuss your design on Instagram to lock your date.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Left Side: Policies + Live Status Tracker (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Guidelines Card */}
            <div className="bg-[#3E3C32] text-[#F5F3EE] rounded-3xl p-6 border border-[#C8A458]/40 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-[#C8A458] mb-4">
                Booking Guidelines &amp; Policy
              </h3>
              <ul className="space-y-3 text-xs text-[#E5DEC9]">
                <li className="flex gap-2.5">
                  <span className="text-[#C8A458] font-bold">01.</span>
                  <span>
                    <strong>Advance Notice:</strong> Book at least <strong>1 day prior</strong> (minimum{" "}
                    <strong>5 hours before</strong> the event).
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-[#C8A458] font-bold">02.</span>
                  <span>
                    <strong>Custom Pricing:</strong> Charges depend on design intricacy and coverage length.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-[#C8A458] font-bold">03.</span>
                  <span>
                    <strong>Design Discussion:</strong> Share reference pictures on Instagram DM before final confirmation.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-[#C8A458] font-bold">04.</span>
                  <span>
                    <strong>Home Service:</strong> Available across Rawalpindi &amp; Islamabad (travel charges may apply).
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-[#C8A458] font-bold">05.</span>
                  <span>
                    <strong>50% Advance:</strong> Half payment is required in advance to confirm and lock your slot.
                  </span>
                </li>
              </ul>
            </div>

            {/* Check Booking Status Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#E5DFD3] shadow-sm">
              <h3 className="font-serif font-bold text-lg text-[#3E3C32] mb-1">Track Your Booking</h3>
              <p className="text-[11px] text-[#6B6659] mb-4">Enter your Booking ID (e.g. HS-4829) to check status.</p>

              <form onSubmit={handleTrackStatus} className="flex gap-2">
                <input
                  placeholder="Enter ID (e.g. HS-4829)"
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-[#F7F5F0] border border-[#E5DFD3] text-xs uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3E3C32] text-[#C8A458] font-bold text-xs cursor-pointer hover:bg-[#26251E]"
                >
                  Check
                </button>
              </form>

              {trackError && <p className="text-xs text-red-600 mt-3">{trackError}</p>}

              {trackResult && (
                <div className="mt-4 p-3.5 rounded-2xl bg-[#F7F5F0] border border-[#E5DFD3] text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#3E3C32]">{trackResult.name}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        trackResult.status === "Approved"
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {trackResult.status}
                    </span>
                  </div>
                  <p className="text-[#5E594E]">{trackResult.event}</p>
                  <p className="text-[11px] text-[#7A7467]">
                    {trackResult.status === "Approved"
                      ? "✓ Advance received & slot locked. See you at the event!"
                      : "⏳ Pending design discussion & 50% advance on Instagram."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Booking Form (3 Columns) */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-8 border-2 border-[#C8A458]/40 shadow-sm">
            {bookingId ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#3E3C32] text-[#C8A458] flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h3 className="font-serif font-bold text-2xl text-[#3E3C32]">Request Received!</h3>
                <div className="inline-block px-5 py-2 rounded-2xl bg-[#F7F5F0] border border-[#C8A458]">
                  <p className="text-[11px] text-[#6B6659] uppercase">Your Booking Tracking ID</p>
                  <p className="text-xl font-mono font-bold text-[#3E3C32]">{bookingId}</p>
                </div>
                <p className="text-xs text-[#5E594E] max-w-md mx-auto">
                  Status: <strong className="text-amber-700">Pending Approval</strong>. We have sent a confirmation email to{" "}
                  <strong>{booking.email}</strong>. Please DM us on Instagram with your Tracking ID to discuss your design and send the 50% advance.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={INSTA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full bg-[#C8A458] text-[#26251E] font-bold text-xs uppercase"
                  >
                    Discuss Design on Instagram ↗
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setBookingId("");
                      setAgreedPolicy(false);
                      setBooking({ ...booking, notes: "" });
                    }}
                    className="px-6 py-3 rounded-full border border-[#E5DFD3] text-xs font-semibold text-[#5E594E] cursor-pointer"
                  >
                    Book Another Date
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <h3 className="font-serif font-bold text-xl text-[#3E3C32] pb-2 border-b border-[#EFECE4]">
                  Event Booking Form
                </h3>

                {bookingError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                    {bookingError}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#3E3C32] mb-1">Full Name *</label>
                    <input
                      required
                      placeholder="e.g. Ayesha Khan"
                      value={booking.name}
                      onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5F0] border border-[#E5DFD3] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#3E3C32] mb-1">
                      Email Address (For Confirmation) *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="you@example.com"
                      value={booking.email}
                      onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5F0] border border-[#E5DFD3] text-xs"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#3E3C32] mb-1">
                      Instagram Handle or Phone *
                    </label>
                    <input
                      required
                      placeholder="@username or 0300-1234567"
                      value={booking.contact}
                      onChange={(e) => setBooking({ ...booking, contact: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5F0] border border-[#E5DFD3] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#3E3C32] mb-1">Select Event *</label>
                    <select
                      value={booking.event}
                      onChange={(e) => setBooking({ ...booking, event: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5F0] border border-[#E5DFD3] text-xs"
                    >
                      {EVENTS.map((ev, idx) => (
                        <option key={idx} value={ev.title}>
                          {ev.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#3E3C32] mb-1">
                      Event Date &amp; Time *
                    </label>
                    <input
                      required
                      type="datetime-local"
                      value={booking.dateTime}
                      onChange={(e) => setBooking({ ...booking, dateTime: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5F0] border border-[#E5DFD3] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#3E3C32] mb-1">Service Location *</label>
                    <select
                      value={booking.serviceType}
                      onChange={(e) => setBooking({ ...booking, serviceType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5F0] border border-[#E5DFD3] text-xs"
                    >
                      <option>Home Service (Rawalpindi / Islamabad)</option>
                      <option>Studio Appointment</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#3E3C32] mb-1">
                    Design Style / Area / Guests Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mention your sector/area (for home service), number of hands/guests, or design preference..."
                    value={booking.notes}
                    onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5F0] border border-[#E5DFD3] text-xs"
                  />
                </div>

                <label className="flex items-start gap-2 text-[11px] text-[#5E594E] cursor-pointer">
                  <input
                    required
                    type="checkbox"
                    checked={agreedPolicy}
                    onChange={(e) => setAgreedPolicy(e.target.checked)}
                    className="mt-0.5 accent-[#3E3C32]"
                  />
                  <span>
                    I agree to the booking policy (design discussion before confirmation &amp; 50% advance payment to lock the slot).
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={bookingLoading || !agreedPolicy}
                  className="w-full py-3.5 rounded-full bg-[#3E3C32] text-[#C8A458] font-bold text-xs uppercase tracking-wider cursor-pointer hover:bg-[#26251E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {bookingLoading ? "Generating Booking ID..." : "Request Booking & Get Tracking ID ✓"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Gallery + Instagram Showcase */}
      <section id="gallery" className="bg-[#3E3C32] text-[#F5F3EE] py-16 px-6 border-t border-[#C8A458]/20">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-[#C8A458]/15 border border-[#C8A458]/40 text-[#C8A458] text-[10px] font-bold uppercase tracking-wider mb-3">
            Portfolio &amp; Designs
          </span>
          <h2 className="text-3xl font-serif font-bold mb-3">Explore Our Latest Henna Work</h2>
          <p className="text-xs text-[#D6D1C4] max-w-lg mx-auto mb-8">
            Visit our Instagram page to browse bridal, minimalist, and festive designs before discussing your custom booking.
          </p>
          <a
            href={INSTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3.5 rounded-full bg-[#C8A458] text-[#26251E] font-bold text-xs uppercase tracking-wider hover:opacity-95"
          >
            View Full Gallery on Instagram (@henly_studio.pk) ↗
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#26251E] text-[#A8A294] py-8 px-6 text-center text-xs border-t border-[#C8A458]/20">
        <p className="font-serif text-[#F5F3EE] font-bold text-sm mb-1">Henly Studio.pk</p>
        <p>Organic Henna Cones Nationwide • Bridal &amp; Event Henna in Rawalpindi / Islamabad</p>
      </footer>
    </div>
  );
}
