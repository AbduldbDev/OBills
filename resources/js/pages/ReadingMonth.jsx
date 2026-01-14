import Layout from "../components/Layout/Layout";
import YearMenu from "../components/Menu/YearMenu";
import { useParams } from "react-router-dom";
import PageHeader from "../components/Common/PageHeader";
const ReadingMonths = () => {
    const { id } = useParams();
    const BaseUrl = `reading-history/${id}`;

    return (
        <Layout>
            <div className="pt-2">
                {/* Page Header */}
                <PageHeader
                    title="Reading History"
                    description="Check historical meter readings for each apartment by year."
                    showBackButton={true}
                    backButtonText="Go Back"
                />

                <YearMenu BaseUrl={BaseUrl} />
            </div>
        </Layout>
    );
};

export default ReadingMonths;
