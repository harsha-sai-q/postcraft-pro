import { Suspense } from "react";
import { SignupClient } from "@/components/signup-client";

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupClient />
    </Suspense>
  );
}
