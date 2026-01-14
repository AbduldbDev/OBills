import { useParams } from "react-router-dom";
import PageHeader from "../components/Common/PageHeader";
import Layout from "../components/Layout/Layout";
import CalendarMonths from "../components/Menu/CalendarMonths";

const ApartmentHistory = () => {
    const { id } = useParams();
    const BaseUrl = `apartments-history/${id}`;

    return (
        <Layout>
            <div className="pt-2">
                <PageHeader
                    title="Apartments History"
                    description="Monitor past apartment billing activities, payments, and computation records."
                />
                <CalendarMonths BaseUrl={BaseUrl} />
            </div>
        </Layout>
    );
};

export default ApartmentHistory;
