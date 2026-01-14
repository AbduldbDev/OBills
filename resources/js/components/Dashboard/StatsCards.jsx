import React from "react";

const StatsCards = () => {
    const stats = [
        {
            title: "Pending",
            value: "4",
            color: "amber",
            icon: "fa-clock",
            description: "Total: ₱1,332.80",
        },
        {
            title: "Paid",
            value: "4",
            color: "emerald",
            icon: "fa-check-circle",
            description: "All time records",
        },
        {
            title: "Active Tenants",
            value: "3",
            color: "blue",
            icon: "fa-users",
            description: "Total 5",
        },
        {
            title: "Month",
            value: "JAN '26",
            color: "purple",
            icon: "fa-calendar-alt",
            description: "Current billing",
        },
    ];

    // Color class mapping to avoid dynamic class issues
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
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {stats.map((stat, index) => {
                const colorClass = colorClasses[stat.color];

                return (
                    <div
                        key={index}
                        className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-3 md:p-4 shadow-sm"
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
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 md:mt-2">
                            {stat.description}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default StatsCards;
