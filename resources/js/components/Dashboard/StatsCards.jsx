import React, { useState, useEffect } from "react";
import { DashboardApi } from "../../api/dashboardApi";

const StatsCards = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await DashboardApi.getDashboard();

            // Map API data to stats format
            const apiData = response.data;
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

            setStats(statsData);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError("Failed to load dashboard data");
            // Set default stats on error
            setStats(getDefaultStats());
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

    const getDefaultStats = () => {
        return [
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
    };

    // Color class mapping
    const colorClasses = {
        amber: {
            bg: "bg-amber-50 dark:bg-amber-900/20",
            text: "text-amber-600 dark:text-amber-400",
        },
        emerald: {
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            text: "text-emerald-600 dark:text-emerald-400",
        },
        blue: {
            bg: "bg-blue-50 dark:bg-blue-900/20",
            text: "text-blue-600 dark:text-blue-400",
        },
        purple: {
            bg: "bg-purple-50 dark:bg-purple-900/20",
            text: "text-purple-600 dark:text-purple-400",
        },
        red: {
            bg: "bg-red-50 dark:bg-red-900/20",
            text: "text-red-600 dark:text-red-400",
        },
    };

    if (loading) {
        return (
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
        );
    }

    if (error) {
        return (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2">
                    <i className="fas fa-exclamation-circle text-red-600 dark:text-red-400"></i>
                    <p className="text-sm text-red-600 dark:text-red-400">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
            {stats.map((stat, index) => {
                const colorClass = colorClasses[stat.color];

                return (
                    <div
                        key={index}
                        className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">
                                    {stat.title}
                                </p>
                                <h3 className="text-xl md:text-2xl font-bold mt-0.5 md:mt-1 text-gray-900 dark:text-white">
                                    {stat.value}
                                </h3>
                            </div>
                            <div
                                className={`p-1.5 md:p-2 rounded-lg ${colorClass.bg} ${colorClass.text}`}
                            >
                                <i
                                    className={`fas ${stat.icon} text-sm md:text-base`}
                                ></i>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 md:mt-2 line-clamp-2">
                            {stat.description}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default StatsCards;
