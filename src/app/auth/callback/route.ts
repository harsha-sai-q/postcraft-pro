import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

const OAUTH_ERROR_MESSAGE = "Google sign-in failed. Please try again.";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const errorDescription = requestUrl.searchParams.get("error_description");

  if (errorDescription) {
    const loginUrl = new URL("/login", requestUrl.origin);
    loginUrl.searchParams.set("error", OAUTH_ERROR_MESSAGE);
    return NextResponse.redirect(loginUrl);
  }

  if (!code) {
    const loginUrl = new URL("/login", requestUrl.origin);
    loginUrl.searchParams.set("error", OAUTH_ERROR_MESSAGE);
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const loginUrl = new URL("/login", requestUrl.origin);
    loginUrl.searchParams.set("error", OAUTH_ERROR_MESSAGE);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
}
