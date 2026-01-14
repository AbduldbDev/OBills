import PageHeader from "../components/Common/PageHeader";
import Layout from "../components/Layout/Layout";
import ApartmentMenuCard from "../components/Menu/AparmentMenuCard";

const ReadingHistory = () => {
    const BaseUrl = `reading-history`;
    return (
        <Layout>
            <div className="pt-2">
                {/* Page Header */}
                <PageHeader
                    title="Reading History"
                    description="Check historical meter readings for each apartment by year."
                />

                <ApartmentMenuCard BaseUrl={BaseUrl} />
            </div>
        </Layout>
    );
};

export default ReadingHistory;
