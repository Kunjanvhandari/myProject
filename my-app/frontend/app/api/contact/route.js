import { NextResponse } from "next/server";
import Contact from "@/lib/models/Contact.js";
import { connectDB } from "@/lib/db.js";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { firstName, email, message } = body;

    if (!firstName || !email || !message) {
      return NextResponse.json(
        { success: false, message: "First name, email, and message are required" },
        { status: 400 }
      );
    }

    const contact = new Contact(body);
    await contact.save();

    return NextResponse.json({ success: true, message: "Message sent successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to send message", error: error.message },
      { status: 500 }
    );
  }
}
