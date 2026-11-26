import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Handle Cones Order
    if (body.type === "order") {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const orderId = `ORD-${randomNum}`;

      const { error } = await supabase.from("Orders").insert([
        {
          order_id: orderId,
          name: body.name,
          contact: body.contact,
          city: body.city,
          address: body.address,
          payment: body.payment,
          items: body.items,
          total: body.total,
          status: "Pending",
        },
      ]);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ orderId }, { status: 201 });
    }

    // Handle Event Booking
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `HS-${randomNum}`;

    const { error } = await supabase.from("Bookings").insert([
      {
        booking_id: bookingId,
        name: body.name,
        email: body.email,
        contact: body.contact,
        event: body.event,
        date_time: body.dateTime,
        service_type: body.serviceType,
        notes: body.notes,
        status: "Pending Approval",
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ bookingId }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save record";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const all = searchParams.get("all");

  // Fetch all records for Admin Dashboard
  if (all === "true") {
    const [bookingsRes, ordersRes] = await Promise.all([
      supabase.from("Bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("Orders").select("*").order("created_at", { ascending: false }),
    ]);

    return NextResponse.json({
      bookings: bookingsRes.data || [],
      orders: ordersRes.data || [],
    });
  }

  // Track single booking by ID
  if (!id) {
    return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("Bookings")
    .select("status, name, event, date_time")
    .eq("booking_id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Booking ID not found" }, { status: 404 });
  }

  return NextResponse.json({
    status: data.status,
    name: data.name,
    event: data.event,
    dateTime: data.date_time,
  });
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { type, id, status } = body;

    if (type === "order") {
      const { error } = await supabase
        .from("Orders")
        .update({ status })
        .eq("order_id", id);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    const { error } = await supabase
      .from("Bookings")
      .update({ status })
      .eq("booking_id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
