import PageHeader from "../components/Common/PageHeader";
import Layout from "../components/Layout/Layout";
import ApartmentMenuCard from "../components/Menu/AparmentMenuCard";

const ApartmentHistory = () => {
    const BaseUrl = `apartments-history`;
    return (
        <Layout>
            <div className="pt-2">
                {/* Page Header */}
                <PageHeader
                    title="Apartments History"
                    description="Monitor past apartment billing activities, payments, and computation records."
                />

                <ApartmentMenuCard BaseUrl={BaseUrl} />
            </div>
        </Layout>
    );
};

export default ApartmentHistory;
