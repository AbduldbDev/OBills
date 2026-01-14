import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Layout from "../components/Layout/Layout";
import PageHeader from "../components/Common/PageHeader";
import CalendarMonths from "../components/Menu/CalendarMonths";

const MonthCardsMenu = () => {
    const BaseUrl = "calendar";
    return (
        <Layout>
            <div className="pt-2">
                <PageHeader
                    title="Calendar"
                    description={`Select a month view all records for that month.`}
                />
                <CalendarMonths BaseUrl={BaseUrl} />
            </div>
        </Layout>
    );
};

export default MonthCardsMenu;
