import React from "react";
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
} from "recharts";
import ChartTooltip from "./ChartTooltip";

const DashboardCharts = ({ monthlyBillsData, kwhRateData, theme }) => {
    const chartColors =
        theme === "dark"
            ? {
                  totalBill: "#3b82f6",
                  average: "#6b7280",
                  rate: "#10b981",
                  averageRate: "#8b5cf6",
                  grid: "#374151",
                  text: "#9ca3af",
              }
            : {
                  totalBill: "#2563eb",
                  average: "#6b7280",
                  rate: "#059669",
                  averageRate: "#7c3aed",
                  grid: "#e5e7eb",
                  text: "#6b7280",
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

    const billsStats = calculateBillsStats();
    const rateStats = calculateRateStats();
    const monthlyBillsWithAverage = getMonthlyBillsWithAverage();
    const kwhRateWithAverage = getKwhRateWithAverage();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Monthly Bills Chart */}
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
                                style={{ backgroundColor: chartColors.average }}
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
                                left: 0,
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
                                content={<ChartTooltip />}
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

                {billsStats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                        <StatCard
                            label="Monthly Avg"
                            value={formatCurrency(billsStats.average)}
                        />
                        <StatCard
                            label="Peak Month"
                            value={billsStats.highestMonth}
                        />
                        <StatCard
                            label="Growth"
                            value={`${
                                billsStats.growth >= 0 ? "+" : ""
                            }${billsStats.growth.toFixed(1)}%`}
                            color={billsStats.growth >= 0 ? "emerald" : "red"}
                        />
                    </div>
                )}
            </div>

            {/* kWh Rate Chart */}
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
                                style={{ backgroundColor: chartColors.rate }}
                            ></div>
                            <span className="text-gray-600 dark:text-gray-400">
                                Current Rate
                            </span>
                        </span>
                        <span className="flex items-center text-sm">
                            <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{
                                    backgroundColor: chartColors.averageRate,
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
                                left: 0,
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
                                content={<ChartTooltip />}
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

                {rateStats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                        <StatCard
                            label="Period Avg"
                            value={formatRate(rateStats.average)}
                        />
                        <StatCard
                            label="Peak Rate"
                            value={rateStats.highestMonth}
                        />
                        <StatCard
                            label="Change"
                            value={`${
                                rateStats.change >= 0 ? "+" : ""
                            }${rateStats.change.toFixed(1)}%`}
                            color={rateStats.change >= 0 ? "emerald" : "red"}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper component for stat cards
const StatCard = ({ label, value, color = "default" }) => {
    const colorClass =
        color === "emerald"
            ? "text-emerald-600 dark:text-emerald-400"
            : color === "red"
            ? "text-red-600 dark:text-red-400"
            : "text-gray-900 dark:text-white";

    return (
        <div className="bg-gray-50 dark:bg-dark-900 rounded-lg p-3">
            <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
            <p className={`text-base font-bold mt-1 ${colorClass}`}>{value}</p>
        </div>
    );
};

export default DashboardCharts;
