
import React from "react";

const ChartTooltip = ({ active, payload, label }) => {
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

export default ChartTooltip;
