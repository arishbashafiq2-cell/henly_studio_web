import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
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
      console.error("Supabase Orders Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orderId }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to submit order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
