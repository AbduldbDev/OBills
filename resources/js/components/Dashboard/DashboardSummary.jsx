import React from "react";

const DashboardSummary = ({ monthlyBillsData, kwhRateData }) => {
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

    return (
        <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-4 md:p-6 mt-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Analytics Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Bills Performance */}
                <SummaryCard
                    icon="fa-chart-area"
                    iconColor="blue"
                    title="Bills Performance"
                    subtitle={`Last ${monthlyBillsData.length} months`}
                >
                    {billsStats && (
                        <>
                            <SummaryItem
                                label="Highest Bill:"
                                value={`${formatCurrency(
                                    billsStats.highest
                                )} (${billsStats.highestMonth})`}
                            />
                            <SummaryItem
                                label="Lowest Bill:"
                                value={`${formatCurrency(billsStats.lowest)} (${
                                    billsStats.lowestMonth
                                })`}
                            />
                            <SummaryItem
                                label="Stability:"
                                value={
                                    Math.abs(billsStats.growth) < 10
                                        ? "Stable"
                                        : "Volatile"
                                }
                                valueColor={
                                    Math.abs(billsStats.growth) < 10
                                        ? "emerald"
                                        : "amber"
                                }
                            />
                        </>
                    )}
                </SummaryCard>

                {/* Rate Analysis */}
                <SummaryCard
                    icon="fa-bolt"
                    iconColor="emerald"
                    title="Rate Analysis"
                    subtitle="Electricity pricing"
                >
                    {rateStats && (
                        <>
                            <SummaryItem
                                label="Rate Range:"
                                value={`${formatRate(
                                    rateStats.lowest
                                )} - ${formatRate(rateStats.highest)}`}
                            />
                            <SummaryItem
                                label="Variance:"
                                value={(
                                    rateStats.highest - rateStats.lowest
                                ).toFixed(2)}
                            />
                            <SummaryItem
                                label="Trend:"
                                value={
                                    rateStats.change >= 0
                                        ? `Increasing (+${rateStats.change.toFixed(
                                              1
                                          )}%)`
                                        : `Decreasing (${rateStats.change.toFixed(
                                              1
                                          )}%)`
                                }
                                valueColor={
                                    rateStats.change >= 0 ? "amber" : "emerald"
                                }
                            />
                        </>
                    )}
                </SummaryCard>

                {/* Insights */}
                <SummaryCard
                    icon="fa-lightbulb"
                    iconColor="purple"
                    title="Insights"
                    subtitle="Key observations"
                >
                    {billsStats && rateStats && (
                        <ul className="space-y-3.5">
                            <InsightItem
                                icon={
                                    billsStats.growth >= 0
                                        ? "arrow-up"
                                        : "arrow-down"
                                }
                                iconColor={
                                    billsStats.growth >= 0 ? "amber" : "emerald"
                                }
                                text={`Bills show ${
                                    billsStats.growth >= 0
                                        ? "growth"
                                        : "reduction"
                                } of ${Math.abs(billsStats.growth).toFixed(
                                    1
                                )}%`}
                            />
                            <InsightItem
                                icon={
                                    rateStats.change >= 0
                                        ? "arrow-up"
                                        : "arrow-down"
                                }
                                iconColor={
                                    rateStats.change >= 0 ? "amber" : "emerald"
                                }
                                text={`Rate ${
                                    rateStats.change >= 0
                                        ? "increased"
                                        : "decreased"
                                } by ${Math.abs(rateStats.change).toFixed(1)}%`}
                            />
                            <InsightItem
                                icon="calendar"
                                iconColor="blue"
                                text={`Peak billing in ${
                                    billsStats.highestMonth
                                } (₱${billsStats.highest.toLocaleString()})`}
                            />
                        </ul>
                    )}
                </SummaryCard>
            </div>
        </div>
    );
};

// Helper Components
const SummaryCard = ({ icon, iconColor, title, subtitle, children }) => {
    const colorClasses = {
        blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
        emerald:
            "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
        purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    };

    return (
        <div className="bg-gray-50 dark:bg-dark-900 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${colorClasses[iconColor]}`}>
                    <i className={`fas ${icon}`}></i>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {subtitle}
                    </p>
                </div>
            </div>
            <div className="space-y-2">{children}</div>
        </div>
    );
};

const SummaryItem = ({ label, value, valueColor = "default" }) => {
    const colorClass =
        valueColor === "emerald"
            ? "text-emerald-600 dark:text-emerald-400"
            : valueColor === "amber"
            ? "text-amber-600 dark:text-amber-400"
            : "text-gray-900 dark:text-white";

    return (
        <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
                {label}
            </span>
            <span className={`font-medium ${colorClass}`}>{value}</span>
        </div>
    );
};

const InsightItem = ({ icon, iconColor, text }) => {
    const colorClass =
        iconColor === "emerald"
            ? "text-emerald-500"
            : iconColor === "amber"
            ? "text-amber-500"
            : "text-blue-500";

    return (
        <li className="flex items-start gap-2 text-sm">
            <i className={`fas fa-${icon} ${colorClass} mt-0.5`}></i>
            <span className="text-gray-700 dark:text-gray-300">{text}</span>
        </li>
    );
};

export default DashboardSummary;
