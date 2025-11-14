import { SaleProvider } from "@/contexts/sale/SaleContext";

export default function SaleLayout({ children }: { children: React.ReactNode }) {
    return <SaleProvider>{children}</SaleProvider>
}
