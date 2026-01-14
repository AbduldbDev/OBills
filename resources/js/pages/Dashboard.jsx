import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatsCards from "../components/Dashboard/StatsCards";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout/Layout";
import { DashboardApi } from "../api/dashboardApi";
import LoadingState from "../components/Common/LoadingState";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Line,
    ReferenceLine,
    Label,
} from "recharts";

const Dashboard = () => {
    const { theme } = useTheme(); // Get current theme
    const { user } = useAuth();
    const navigate = useNavigate();

    const [monthlyBillsData, setMonthlyBillsData] = useState([]);
    const [kwhRateData, setKwhRateData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const mockMonthlyBillsData = [
                { month: "Sep '25", total_bill: 18560 },
                { month: "Oct '25", total_bill: 28560 },
                { month: "Nov '25", total_bill: 32015 },
                { month: "Dec '25", total_bill: 29540 },
                { month: "Jan '26", total_bill: 31580 },
                { month: "Feb '26", total_bill: 28970 },
                { month: "Mar '26", total_bill: 33520 },
                { month: "Apr '26", total_bill: 31025 },
            ];

            const mockKwhRateData = [
                { month: "Sep '25", rate: 8 },
                { month: "Oct '25", rate: 8 },
                { month: "Nov '25", rate: 8 },
                { month: "Dec '25", rate: 9 },
                { month: "Jan '26", rate: 9 },
                { month: "Feb '26", rate: 9 },
                { month: "Mar '26", rate: 9 },
                { month: "Apr '26", rate: 9 },
            ];

            setMonthlyBillsData(mockMonthlyBillsData);
            setKwhRateData(mockKwhRateData);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    // Calculate average for bills data
    const getMonthlyBillsWithAverage = () => {
        if (monthlyBillsData.length === 0) return [];

        const total = monthlyBillsData.reduce(
            (sum, item) => sum + item.total_bill,
            0
        );
        const average = total / monthlyBillsData.length;

        return monthlyBillsData.map((item) => ({
            ...item,
            average: average,
        }));
    };

    // Calculate average for kWh rate data
    const getKwhRateWithAverage = () => {
        if (kwhRateData.length === 0) return [];

        const total = kwhRateData.reduce((sum, item) => sum + item.rate, 0);
        const average = total / kwhRateData.length;

        return kwhRateData.map((item) => ({
            ...item,
            average: average,
        }));
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatRate = (value) => {
        return `₱${value.toFixed(2)}`;
    };

    // Calculate statistics
    const calculateBillsStats = () => {
        if (monthlyBillsData.length === 0) return null;

        const totalBills = monthlyBillsData.map((item) => item.total_bill);
        const total = totalBills.reduce((sum, val) => sum + val, 0);
        const average = total / totalBills.length;
        const highest = Math.max(...totalBills);
        const highestMonth =
            monthlyBillsData.find((item) => item.total_bill === highest)
                ?.month || "N/A";
        const lowest = Math.min(...totalBills);
        const lowestMonth =
            monthlyBillsData.find((item) => item.total_bill === lowest)
                ?.month || "N/A";
        const growth =
            totalBills.length > 1
                ? ((totalBills[totalBills.length - 1] - totalBills[0]) /
                      totalBills[0]) *
                  100
                : 0;

        return {
            total,
            average,
            highest,
            highestMonth,
            lowest,
            lowestMonth,
            growth,
        };
    };

    const calculateRateStats = () => {
        if (kwhRateData.length === 0) return null;

        const rates = kwhRateData.map((item) => item.rate);
        const total = rates.reduce((sum, val) => sum + val, 0);
        const average = total / rates.length;
        const current = rates[rates.length - 1];
        const change =
            rates.length > 1 ? ((current - rates[0]) / rates[0]) * 100 : 0;
        const highest = Math.max(...rates);
        const highestMonth =
            kwhRateData.find((item) => item.rate === highest)?.month || "N/A";
        const lowest = Math.min(...rates);
        const lowestMonth =
            kwhRateData.find((item) => item.rate === lowest)?.month || "N/A";

        return {
            total,
            average,
            current,
            change,
            highest,
            highestMonth,
            lowest,
            lowestMonth,
        };
    };

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-dark-800 p-4 border border-gray-200 dark:border-dark-700 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-900 dark:text-white mb-2">
                        {label}
                    </p>
                    {payload.map((entry, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between gap-4 mb-1"
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                ></div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {entry.name}:
                                </span>
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {entry.name.includes("Bill") ||
                                entry.name.includes("Average")
                                    ? formatCurrency(entry.value)
                                    : formatRate(entry.value)}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Chart color based on theme
    const chartColors =
        theme === "dark"
            ? {
                  totalBill: "#3b82f6", // Blue
                  average: "#6b7280", // Gray
                  rate: "#10b981", // Emerald
                  averageRate: "#8b5cf6", // Purple
                  grid: "#374151",
                  text: "#9ca3af",
              }
            : {
                  totalBill: "#2563eb", // Blue
                  average: "#6b7280", // Gray
                  rate: "#059669", // Emerald
                  averageRate: "#7c3aed", // Purple
                  grid: "#e5e7eb",
                  text: "#6b7280",
              };

    if (loading) {
        return (
            <Layout>
                <StatsCards />
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

    const billsStats = calculateBillsStats();
    const rateStats = calculateRateStats();
    const monthlyBillsWithAverage = getMonthlyBillsWithAverage();
    const kwhRateWithAverage = getKwhRateWithAverage();

    return (
        <Layout>
            <StatsCards />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Monthly Bills Area Chart */}
                <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                                Monthly Bills Trend
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Total building bills with average line
                            </p>
                        </div>
                        <div className="mt-3 md:mt-0 flex items-center space-x-4">
                            <span className="flex items-center text-sm">
                                <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{
                                        backgroundColor: chartColors.totalBill,
                                    }}
                                ></div>
                                <span className="text-gray-600 dark:text-gray-400">
                                    Total Bill
                                </span>
                            </span>
                            <span className="flex items-center text-sm">
                                <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{
                                        backgroundColor: chartColors.average,
                                    }}
                                ></div>
                                <span className="text-gray-600 dark:text-gray-400">
                                    Average (
                                    {formatCurrency(billsStats?.average || 0)})
                                </span>
                            </span>
                        </div>
                    </div>

                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={monthlyBillsWithAverage}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 20,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={chartColors.grid}
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="month"
                                    stroke={chartColors.text}
                                    fontSize={12}
                                    tickLine={false}
                                />
                                <YAxis
                                    stroke={chartColors.text}
                                    fontSize={12}
                                    tickLine={false}
                                    tickFormatter={(value) =>
                                        formatCurrency(value).replace("₱", "")
                                    }
                                    axisLine={false}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{
                                        stroke: chartColors.grid,
                                        strokeWidth: 1,
                                    }}
                                />
                                <Legend
                                    verticalAlign="top"
                                    height={36}
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{
                                        fontSize: "12px",
                                        color: chartColors.text,
                                    }}
                                />

                                {/* Total Bill Area */}
                                <Area
                                    type="monotone"
                                    dataKey="total_bill"
                                    name="Total Bill"
                                    stroke={chartColors.totalBill}
                                    fill={chartColors.totalBill}
                                    fillOpacity={0.2}
                                    strokeWidth={2}
                                    dot={{
                                        r: 4,
                                        strokeWidth: 2,
                                        fill: chartColors.totalBill,
                                    }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />

                                {/* Average Line */}
                                <Line
                                    type="monotone"
                                    dataKey="average"
                                    name="Average"
                                    stroke={chartColors.average}
                                    strokeWidth={1.5}
                                    strokeDasharray="5 5"
                                    dot={false}
                                    activeDot={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Bills Statistics */}
                    {billsStats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                            <div className="bg-gray-50 dark:bg-dark-900 rounded-lg p-3">
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Total Period
                                </p>
                                <p className="text-base font-bold text-gray-900 dark:text-white mt-1">
                                    {formatCurrency(billsStats.total)}
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-dark-900 rounded-lg p-3">
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Monthly Avg
                                </p>
                                <p className="text-base font-bold text-gray-900 dark:text-white mt-1">
                                    {formatCurrency(billsStats.average)}
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-dark-900 rounded-lg p-3">
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Peak Month
                                </p>
                                <p className="text-base font-bold text-gray-900 dark:text-white mt-1">
                                    {billsStats.highestMonth}
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-dark-900 rounded-lg p-3">
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Growth
                                </p>
                                <p
                                    className={`text-base font-bold mt-1 ${
                                        billsStats.growth >= 0
                                            ? "text-emerald-600 dark:text-emerald-400"
                                            : "text-red-600 dark:text-red-400"
                                    }`}
                                >
                                    {billsStats.growth >= 0 ? "+" : ""}
                                    {billsStats.growth.toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* kWh Rate Area Chart */}
                <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                                kWh Rate History
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Electricity rate per kWh with average line
                            </p>
                        </div>
                        <div className="mt-3 md:mt-0 flex items-center space-x-4">
                            <span className="flex items-center text-sm">
                                <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{
                                        backgroundColor: chartColors.rate,
                                    }}
                                ></div>
                                <span className="text-gray-600 dark:text-gray-400">
                                    Current Rate
                                </span>
                            </span>
                            <span className="flex items-center text-sm">
                                <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{
                                        backgroundColor:
                                            chartColors.averageRate,
                                    }}
                                ></div>
                                <span className="text-gray-600 dark:text-gray-400">
                                    Average Rate (
                                    {formatRate(rateStats?.average || 0)})
                                </span>
                            </span>
                        </div>
                    </div>

                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={kwhRateWithAverage}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 20,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={chartColors.grid}
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="month"
                                    stroke={chartColors.text}
                                    fontSize={12}
                                    tickLine={false}
                                />
                                <YAxis
                                    stroke={chartColors.text}
                                    fontSize={12}
                                    tickLine={false}
                                    tickFormatter={(value) =>
                                        `₱${value.toFixed(1)}`
                                    }
                                    axisLine={false}
                                    domain={["dataMin - 0.5", "dataMax + 0.5"]}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{
                                        stroke: chartColors.grid,
                                        strokeWidth: 1,
                                    }}
                                />
                                <Legend
                                    verticalAlign="top"
                                    height={36}
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{
                                        fontSize: "12px",
                                        color: chartColors.text,
                                    }}
                                />

                                {/* Current Rate Area */}
                                <Area
                                    type="monotone"
                                    dataKey="rate"
                                    name="Current Rate"
                                    stroke={chartColors.rate}
                                    fill={chartColors.rate}
                                    fillOpacity={0.2}
                                    strokeWidth={2}
                                    dot={{
                                        r: 4,
                                        strokeWidth: 2,
                                        fill: chartColors.rate,
                                    }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />

                                {/* Average Rate Line */}
                                <Line
                                    type="monotone"
                                    dataKey="average"
                                    name="Average Rate"
                                    stroke={chartColors.averageRate}
                                    strokeWidth={1.5}
                                    strokeDasharray="5 5"
                                    dot={false}
                                    activeDot={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Rate Statistics */}
                    {rateStats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                            <div className="bg-gray-50 dark:bg-dark-900 rounded-lg p-3">
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Current Rate
                                </p>
                                <p className="text-base font-bold text-gray-900 dark:text-white mt-1">
                                    {formatRate(rateStats.current)}
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-dark-900 rounded-lg p-3">
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Period Avg
                                </p>
                                <p className="text-base font-bold text-gray-900 dark:text-white mt-1">
                                    {formatRate(rateStats.average)}
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-dark-900 rounded-lg p-3">
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Peak Rate
                                </p>
                                <p className="text-base font-bold text-gray-900 dark:text-white mt-1">
                                    {rateStats.highestMonth}
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-dark-900 rounded-lg p-3">
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Change
                                </p>
                                <p
                                    className={`text-base font-bold mt-1 ${
                                        rateStats.change >= 0
                                            ? "text-emerald-600 dark:text-emerald-400"
                                            : "text-red-600 dark:text-red-400"
                                    }`}
                                >
                                    {rateStats.change >= 0 ? "+" : ""}
                                    {rateStats.change.toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary Section */}
            <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-4 md:p-6 mt-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Analytics Summary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-dark-900 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <i className="fas fa-chart-area text-blue-600 dark:text-blue-400"></i>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    Bills Performance
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Last {monthlyBillsData.length} months
                                </p>
                            </div>
                        </div>
                        {billsStats && (
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Highest Bill:
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(billsStats.highest)} (
                                        {billsStats.highestMonth})
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Lowest Bill:
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(billsStats.lowest)} (
                                        {billsStats.lowestMonth})
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Stability:
                                    </span>
                                    <span
                                        className={`font-medium ${
                                            Math.abs(billsStats.growth) < 10
                                                ? "text-emerald-600 dark:text-emerald-400"
                                                : "text-amber-600 dark:text-amber-400"
                                        }`}
                                    >
                                        {Math.abs(billsStats.growth) < 10
                                            ? "Stable"
                                            : "Volatile"}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 dark:bg-dark-900 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                <i className="fas fa-bolt text-emerald-600 dark:text-emerald-400"></i>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    Rate Analysis
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Electricity pricing
                                </p>
                            </div>
                        </div>
                        {rateStats && (
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Rate Range:
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatRate(rateStats.lowest)} -{" "}
                                        {formatRate(rateStats.highest)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Variance:
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {(
                                            rateStats.highest - rateStats.lowest
                                        ).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Trend:
                                    </span>
                                    <span
                                        className={`font-medium ${
                                            rateStats.change >= 0
                                                ? "text-amber-600 dark:text-amber-400"
                                                : "text-emerald-600 dark:text-emerald-400"
                                        }`}
                                    >
                                        {rateStats.change >= 0
                                            ? `Increasing (+${rateStats.change.toFixed(
                                                  1
                                              )}%)`
                                            : `Decreasing (${rateStats.change.toFixed(
                                                  1
                                              )}%)`}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 dark:bg-dark-900 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <i className="fas fa-lightbulb text-purple-600 dark:text-purple-400"></i>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    Insights
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Key observations
                                </p>
                            </div>
                        </div>
                        {billsStats && rateStats && (
                            <ul className="space-y-3.5">
                                <li className="flex items-start gap-2 text-sm">
                                    <i
                                        className={`fas fa-${
                                            billsStats.growth >= 0
                                                ? "arrow-up text-amber-500"
                                                : "arrow-down text-emerald-500"
                                        } mt-0.5`}
                                    ></i>
                                    <span className="text-gray-700 dark:text-gray-300">
                                        Bills show{" "}
                                        {billsStats.growth >= 0
                                            ? "growth"
                                            : "reduction"}{" "}
                                        of{" "}
                                        {Math.abs(billsStats.growth).toFixed(1)}
                                        %
                                    </span>
                                </li>
                                <li className="flex items-start gap-2 text-sm">
                                    <i
                                        className={`fas fa-${
                                            rateStats.change >= 0
                                                ? "arrow-up text-amber-500"
                                                : "arrow-down text-emerald-500"
                                        } mt-0.5`}
                                    ></i>
                                    <span className="text-gray-700 dark:text-gray-300">
                                        Rate{" "}
                                        {rateStats.change >= 0
                                            ? "increased"
                                            : "decreased"}{" "}
                                        by{" "}
                                        {Math.abs(rateStats.change).toFixed(1)}%
                                    </span>
                                </li>
                                <li className="flex items-start gap-2 text-sm">
                                    <i className="fas fa-calendar text-blue-500 mt-0.5"></i>
                                    <span className="text-gray-700 dark:text-gray-300">
                                        Peak billing in{" "}
                                        {billsStats.highestMonth} (₱
                                        {billsStats.highest.toLocaleString()})
                                    </span>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
