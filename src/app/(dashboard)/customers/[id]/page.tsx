import CustomerDetails from "@/components/customers/CustomerDetails";
import { PageContainer } from "@/components/layout/PageContainer";

async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PageContainer>
      <CustomerDetails id={id} />
    </PageContainer>
  );
}

export default CustomerPage;
