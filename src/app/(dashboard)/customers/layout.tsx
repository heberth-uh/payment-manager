import { CustomerProvider } from "@/contexts/customer/CustomerContext";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <CustomerProvider>{children}</CustomerProvider>;
}
