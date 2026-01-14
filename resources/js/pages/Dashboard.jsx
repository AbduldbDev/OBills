// src/pages/Dashboard/index.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout/Layout";
import { DashboardApi } from "../api/dashboardApi";
import DashboardStats from "../components/Dashboard/DashboardStats";
import DashboardCharts from "../components/Dashboard/DashboardCharts";
import DashboardSummary from "../components/Dashboard/DashboardSummary";
import LoadingState from "../components/Common/LoadingState";

const Dashboard = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState({
        stats: null,
        monthlyBillsData: [],
        kwhRateData: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await DashboardApi.getDashboard();
            const apiData = response.data;

            // Prepare stats data
            const statsData = [
                {
                    title: "Pending",
                    value: apiData.pending || 0,
                    color: "amber",
                    icon: "fa-clock",
                    description: `Pending Amount: ${
                        apiData.unpaidTotalAmount || 0
                    }`,
                },
                {
                    title: "Sent",
                    value: apiData.sent || 0,
                    color: "blue",
                    icon: "fa-paper-plane",
                    description: "Bills sent",
                },
                {
                    title: "Skipped",
                    value: apiData.skipped || 0,
                    color: "red",
                    icon: "fa-ban",
                    description: "Bills skipped",
                },
                {
                    title: "Active Units",
                    value: apiData.activetenants || 0,
                    color: "emerald",
                    icon: "fa-users",
                    description: `Total Units: ${apiData.totaltenants}`,
                },
                {
                    title: "Recent Calculation",
                    value: formatMonth(apiData.lastCalculated || "N/A"),
                    color: "purple",
                    icon: "fa-calendar-alt",
                    description: `Submeters: ${
                        apiData.submeters?.join(", ") || "None"
                    }`,
                },
            ];

            setDashboardData({
                stats: statsData,
                monthlyBillsData: apiData.monthlyBillsData || [],
                kwhRateData: apiData.kwhRateData || [],
            });
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError("Failed to load dashboard data");
            setDashboardData(getDefaultData());
        } finally {
            setLoading(false);
        }
    };

    const formatMonth = (monthString) => {
        if (!monthString || monthString === "N/A") return "N/A";
        try {
            const [year, month] = monthString.split("-");
            const date = new Date(year, month - 1);
            return date
                .toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                })
                .replace(" ", " '");
        } catch (error) {
            return monthString;
        }
    };

    const getDefaultData = () => ({
        stats: getDefaultStats(),
        monthlyBillsData: getDefaultBillsData(),
        kwhRateData: getDefaultRateData(),
    });

    const getDefaultStats = () => [
        {
            title: "Pending",
            value: "0",
            color: "amber",
            icon: "fa-clock",
            description: "Awaiting payment",
        },
        {
            title: "Sent",
            value: "0",
            color: "blue",
            icon: "fa-paper-plane",
            description: "Bills sent",
        },
        {
            title: "Skipped",
            value: "0",
            color: "red",
            icon: "fa-ban",
            description: "Bills skipped",
        },
        {
            title: "Active Tenants",
            value: "0",
            color: "emerald",
            icon: "fa-users",
            description: "No submeters",
        },
        {
            title: "Recent Calculation",
            value: "N/A",
            color: "purple",
            icon: "fa-calendar-alt",
            description: "No calculations",
        },
    ];

    const getDefaultBillsData = () => [
        { month: "Sep '25", total_bill: 18560 },
        { month: "Oct '25", total_bill: 28560 },
        { month: "Nov '25", total_bill: 32015 },
        { month: "Dec '25", total_bill: 29540 },
        { month: "Jan '26", total_bill: 31580 },
        { month: "Feb '26", total_bill: 28970 },
        { month: "Mar '26", total_bill: 33520 },
        { month: "Apr '26", total_bill: 31025 },
    ];

    const getDefaultRateData = () => [
        { month: "Sep '25", rate: 8 },
        { month: "Oct '25", rate: 8 },
        { month: "Nov '25", rate: 8 },
        { month: "Dec '25", rate: 9 },
        { month: "Jan '26", rate: 9 },
        { month: "Feb '26", rate: 9 },
        { month: "Mar '26", rate: 9 },
        { month: "Apr '26", rate: 9 },
    ];

    if (loading) {
        return (
            <Layout>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
                    {[...Array(5)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-dark-800 rounded-lg border border-dark-200 dark:border-dark-700 p-3 md:p-4 shadow-sm animate-pulse"
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-16"></div>
                                    <div className="h-8 bg-gray-200 dark:bg-dark-700 rounded w-12"></div>
                                </div>
                                <div className="h-10 w-10 bg-gray-200 dark:bg-dark-700 rounded-lg"></div>
                            </div>
                            <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-full mt-2"></div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
                        <LoadingState message="Loading monthly bills chart..." />
                    </div>
                    <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
                        <LoadingState message="Loading kWh rate chart..." />
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <DashboardStats stats={dashboardData.stats} error={error} />

            <DashboardCharts
                monthlyBillsData={dashboardData.monthlyBillsData}
                kwhRateData={dashboardData.kwhRateData}
                theme={theme}
            />

            <DashboardSummary
                monthlyBillsData={dashboardData.monthlyBillsData}
                kwhRateData={dashboardData.kwhRateData}
            />
        </Layout>
    );
};

export default Dashboard;
