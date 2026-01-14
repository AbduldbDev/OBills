import PageHeader from "../components/Common/PageHeader";
import Layout from "../components/Layout/Layout";
import ApartmentMenuCard from "../components/Menu/AparmentMenuCard";

const PaymentHistory = () => {
    const BaseUrl = `payment-history`;
    return (
        <Layout>
            <div className="pt-2">
                {/* Page Header */}
                <PageHeader
                    title="Payment History"
                    description="Review apartment payment status, billing summaries, and transaction records."
                />
                <ApartmentMenuCard BaseUrl={BaseUrl} />
            </div>
        </Layout>
    );
};

export default PaymentHistory;
