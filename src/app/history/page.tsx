import { HistoryClient } from "@/components/history-client";
import { ProtectedPage } from "@/components/protected-page";

export default function Page() {
  return <ProtectedPage><HistoryClient /></ProtectedPage>;
}
