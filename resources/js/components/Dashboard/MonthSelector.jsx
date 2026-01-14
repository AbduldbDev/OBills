import React from "react";

const MonthSelector = () => {
    const months = [
        { name: "January 2026", active: true },
        { name: "December 2025", active: false },
        { name: "November 2025", active: false },
    ];

    return (
        <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
                {months.map((month, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2 rounded-lg font-medium text-sm ${
                            month.active
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700"
                        }`}
                    >
                        {month.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MonthSelector;
