import { ProtectedPage } from "@/components/protected-page";
import { GeneratorClient } from "@/components/generator-client";

export default function Page() {
  return (
    <ProtectedPage>
      <GeneratorClient />
    </ProtectedPage>
  );
}
