import { PageContainer } from "@/components/layout/PageContainer";
import { ProductDraftProvider } from "@/contexts/product/ProductDraftContext";
import SaleDetails from "@/components/sales/SaleDetails";

function SalePage({ params }: { params: { id: string } }) {
  // TODO: Pass id prop to SaleDetails instead of relying on useParams() in child component.
  // Update SaleDetails signature to accept id prop and remove useParams() hook.
  //    function SalePage({ params }: { params: { id: string } } {...}
  //    function SaleDetails({ id }: { id: string }) {...const saleId = id;...}
  return (
    <ProductDraftProvider>
      <PageContainer>
        <SaleDetails />
      </PageContainer>
    </ProductDraftProvider>
  );
}

export default SalePage;
