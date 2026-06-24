import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Librivista/1.0)",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch PDF, status: ${response.status}` },
        { status: response.status }
      );
    }

    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Access-Control-Allow-Origin": "*",
        "Content-Disposition": 'inline; filename="book.pdf"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to proxy PDF", message: error.message },
      { status: 500 }
    );
  }
}
