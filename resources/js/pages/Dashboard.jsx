import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Layout/Header";
import StatsCards from "../components/Dashboard/StatsCards";
import MonthSelector from "../components/Dashboard/MonthSelector";
import BillCard from "../components/Dashboard/BillCard";
import Sidebar from "../components/Layout/Sidebar";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout/Layout";

const Dashboard = () => {
    const { toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const bills = [
        {
            id: 1,
            submeter: "Submeter #6",
            tenant: "John Doe",
            status: "Pending",
            previousReading: 2792.9,
            currentReading: 2851.6,
            rate: 8,
        },
        {
            id: 2,
            submeter: "Submeter #7",
            tenant: "Jane Smith",
            status: "Paid",
            previousReading: 1500.5,
            currentReading: 1580.2,
            rate: 8,
        },
        {
            id: 3,
            submeter: "Submeter #8",
            tenant: "Bob Johnson",
            status: "Pending",
            previousReading: 3200.1,
            currentReading: 3285.4,
            rate: 8,
        },
    ];

    return (
        <Layout>
            <StatsCards />
            {/* <MonthSelector /> */}

            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-md lg:text-xl font-bold text-gray-900 dark:text-white">
                        January 2026 Bills
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {bills.map((bill) => (
                        <BillCard key={bill.id} bill={bill} />
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
