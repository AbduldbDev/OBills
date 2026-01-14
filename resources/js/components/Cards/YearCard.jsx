import React from "react";

const YearCard = ({ year, isCurrentYear, onSelect }) => {
    const currentYear = new Date().getFullYear();

    const handleClick = () => {
        if (onSelect) {
            onSelect(year);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`group relative bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-4 transition-all duration-200 hover:shadow-lg hover:border-gray-300 dark:hover:border-dark-600 cursor-pointer `}
        >
            {/* Year Content */}
            <div className="flex flex-col items-center text-center">
                {/* Year Number Circle */}
                <div
                    className={`w-20 h-20 rounded-full  ${
                        isCurrentYear
                            ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800"
                            : "bg-dark-900 dark:bg-white"
                    }  flex items-center justify-center mb-3 relative `}
                >
                    <span
                        className={`font-bold text-xl ${
                            isCurrentYear
                                ? "text-green-600 dark:text-green-400"
                                : "text-white dark:text-gray-900"
                        }`}
                    >
                        {year}
                    </span>

                    {/* Current year indicator */}
                    {isCurrentYear && (
                        <div className="absolute top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                    )}
                </div>

                <h3
                    className={`font-semibold mb-1 text-gray-900 dark:text-white`}
                >
                    {year}
                </h3>
            </div>
        </div>
    );
};

export default YearCard;
