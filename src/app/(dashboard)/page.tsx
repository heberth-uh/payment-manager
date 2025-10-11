import { getServerSession } from "@/lib/get-session";
import { PageContainer } from "@/components/PageContainer";

export default async function Home() {
  const session = await getServerSession();
  const user = session?.user;

  return (
    <PageContainer>
      <h1>Payment Manager App</h1>
      <div>
        <p>Welcome, {user?.name || user?.email}!</p>
      </div>
    </PageContainer>
  );
}
