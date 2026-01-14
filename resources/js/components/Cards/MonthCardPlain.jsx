import React from "react";

const MonthCard = ({ month, isCurrentMonth, selectedYear, onSelect }) => {
    const currentYear = new Date().getFullYear();

    const handleClick = () => {
        if (onSelect) {
            onSelect(month.id);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`group relative bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-4 transition-all duration-200 hover:shadow-lg hover:border-gray-300 dark:hover:border-dark-600 cursor-pointer `}
        >
            {/* Month Content */}
            <div className="flex flex-col items-center text-center">
                {/* Month Number Circle */}
                <div
                    className={`w-14 h-14 rounded-full  ${
                        isCurrentMonth
                            ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800"
                            : "bg-dark-900 dark:bg-white"
                    }  flex items-center justify-center mb-3 relative `}
                >
                    <span
                        className={`font-bold text-xl ${
                            isCurrentMonth
                                ? "text-green-600 dark:text-green-400"
                                : "text-white dark:text-gray-900"
                        }`}
                    >
                        {month.id}
                    </span>

                    {/* Current month indicator */}
                    {isCurrentMonth && (
                        <div className="absolute top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                    )}
                </div>

                {/* Month Name */}
                <h3
                    className={`font-semibold mb-1 text-gray-900 dark:text-white`}
                >
                    {month.name}
                </h3>

                {/* Short Name */}
                <p className={`text-sm text-gray-500 dark:text-gray-400`}>
                    {month.shortName}
                </p>
            </div>

            {/* Year indicator for non-current years */}
            {selectedYear !== currentYear && (
                <div className="mt-2 text-center">
                    <span className={`text-xs `}>{selectedYear}</span>
                </div>
            )}
        </div>
    );
};

export default MonthCard;
