import { getServerSession } from "@/lib/get-session";
import Unauthorized from "./unauthorized";

export default async function Home() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) return <Unauthorized />; // Or use redirect('/login')

  return (
    <div className="container mx-auto">
      <h1>Payment Manager App</h1>

      <div>
        <p>Welcome, {user.name || user.email}!</p>
      </div>
    </div>
  );
}
