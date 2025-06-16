// /app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: data.message || "Login failed" },
      { status: res.status }
    );
  }

  const token = data.token;

  const response = NextResponse.json({
    user: data.user,
    message: "Login successful",
  });

  // ✅ Cookie is now set from your Next.js frontend domain
  if (token) {
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax", // or "None" with `secure: true` if cross-domain still
      path: "/",
      maxAge: 15 * 24 * 60 * 60,
    });
  }

  return response;
}
