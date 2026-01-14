import React from "react";

const MonthCard = ({
    month,
    isCurrentMonth,
    selectedYear,
    onSelect,
    hasData = true,
    noData = false,
}) => {
    const currentYear = new Date().getFullYear();

    const handleClick = () => {
        if (onSelect) {
            onSelect(month.id);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`group relative bg-white dark:bg-dark-800 rounded-xl border p-4 transition-all duration-200 cursor-pointer ${
                hasData
                    ? `border-gray-200 dark:border-dark-700 hover:shadow-lg hover:border-gray-300 dark:hover:border-dark-600`
                    : `border-gray-100 dark:border-dark-800 hover:border-gray-200 dark:hover:border-dark-700 hover:shadow`
            }`}
        >
            {/* Month Content */}
            <div className="flex flex-col items-center text-center">
                {/* Month Number Circle */}
                <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 relative ${
                        hasData
                            ? isCurrentMonth
                                ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800"
                                : "bg-dark-900 dark:bg-white"
                            : "bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600"
                    }`}
                >
                    <span
                        className={`font-bold text-xl ${
                            hasData
                                ? isCurrentMonth
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-white dark:text-gray-900"
                                : "text-gray-500 dark:text-gray-400"
                        }`}
                    >
                        {month.id}
                    </span>

                    {/* Current month indicator */}
                    {isCurrentMonth && (
                        <div
                            className={`absolute top-1 -right-1 w-3 h-3 rounded-full ${
                                hasData ? "bg-green-500" : "bg-gray-400"
                            }`}
                        ></div>
                    )}
                </div>

                {/* Month Name */}
                <h3
                    className={`font-semibold mb-1 ${
                        hasData
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-500 dark:text-gray-400"
                    }`}
                >
                    {month.name}
                </h3>
            </div>

            {/* Year indicator for non-current years */}
            {selectedYear !== currentYear && (
                <div className="mt-2 text-center">
                    <span
                        className={`text-xs ${
                            hasData
                                ? "text-gray-400 dark:text-gray-500"
                                : "text-gray-400 dark:text-gray-500"
                        }`}
                    >
                        {selectedYear}
                    </span>
                </div>
            )}

            {/* Status Badge */}
            <div className=" flex justify-center mt-2">
                {noData ? (
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-dark-700 text-gray-500 dark:text-gray-400 rounded-full">
                        No Data
                    </span>
                ) : (
                    <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                        Available
                    </span>
                )}
            </div>

            {/* Hover effect indicator */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div
                    className={`absolute inset-0 rounded-xl ${
                        hasData
                            ? "bg-green-50 dark:bg-green-900/10"
                            : "bg-gray-50 dark:bg-dark-700/30"
                    }`}
                ></div>
            </div>
        </div>
    );
};

export default MonthCard;
