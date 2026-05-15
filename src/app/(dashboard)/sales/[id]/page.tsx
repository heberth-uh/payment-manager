import { PageContainer } from "@/components/layout/PageContainer";
import { ProductDraftProvider } from "@/contexts/product/ProductDraftContext";
import SaleDetails from "@/components/sales/SaleDetails";

async function SalePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <ProductDraftProvider>
      <PageContainer>
        <SaleDetails id={id} />
      </PageContainer>
    </ProductDraftProvider>
  );
}

export default SalePage;
