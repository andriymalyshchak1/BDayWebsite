// Server Component — just delegates to the client-only experience
import ClientLoader from "@/components/ClientLoader";

export default function Home() {
  return <ClientLoader />;
}
