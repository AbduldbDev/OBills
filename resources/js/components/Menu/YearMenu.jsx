import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import YearCard from "../Cards/YearCard";

const YearCardsMenu = ({ BaseUrl }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const navigate = useNavigate();
    const [years, setYears] = useState([]);

    // Generate years array: current year and past 5 years
    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const yearsArray = [];

        // Generate current year and past 5 years
        for (let i = 0; i <= 5; i++) {
            yearsArray.push(currentYear - i);
        }

        setYears(yearsArray);
        setSelectedYear(currentYear);
    }, []);

    const handleYearSelect = (year) => {
        setSelectedYear(year);
        // Navigate to year overview or summary page
        navigate(`/${BaseUrl}/${year}`);
    };

    return (
        <div className="pt-2">
            <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-4 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
                            <i className="fas fa-calendar text-gray-100 dark:text-gray-900"></i>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Select Year
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Select a year to view details
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="min-h-[55vh]">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {years.map((year) => {
                        const isCurrentYear = year === new Date().getFullYear();

                        return (
                            <YearCard
                                key={year}
                                year={year}
                                isCurrentYear={isCurrentYear}
                                onSelect={() => handleYearSelect(year)}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Footer Info */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-700">
                <div className="flex flex-wrap justify-between items-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Showing{" "}
                        <span className="font-medium text-gray-900 dark:text-white">
                            {years.length}
                        </span>{" "}
                        years
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
                        <i className="fas fa-info-circle mr-1"></i>
                        Years: {years[years.length - 1]} - {years[0]}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YearCardsMenu;
