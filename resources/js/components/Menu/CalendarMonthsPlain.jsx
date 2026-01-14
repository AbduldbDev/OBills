import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MonthCard from "../Cards/MonthCardPlain";
import PageHeader from "../Common/PageHeader";

const MonthCardsMenu = ({ BaseUrl }) => {
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const navigate = useNavigate();
    const [years, setYears] = useState([]);

    const months = [
        { id: 1, name: "January", shortName: "Jan" },
        { id: 2, name: "February", shortName: "Feb" },
        { id: 3, name: "March", shortName: "Mar" },
        { id: 4, name: "April", shortName: "Apr" },
        { id: 5, name: "May", shortName: "May" },
        { id: 6, name: "June", shortName: "Jun" },
        { id: 7, name: "July", shortName: "Jul" },
        { id: 8, name: "August", shortName: "Aug" },
        { id: 9, name: "September", shortName: "Sep" },
        { id: 10, name: "October", shortName: "Oct" },
        { id: 11, name: "November", shortName: "Nov" },
        { id: 12, name: "December", shortName: "Dec" },
    ];

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const yearsArray = [];
        for (let i = 0; i <= 5; i++) {
            yearsArray.push(currentYear - i);
        }

        setYears(yearsArray);
        setSelectedYear(currentYear);
    }, []);

    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value));
        setSelectedMonth(null);
    };

    const handleMonthSelect = (monthId) => {
        setSelectedMonth(monthId);

        const monthString = monthId.toString().padStart(2, "0");
        navigate(`/${BaseUrl}/${selectedYear}-${monthString}`);
    };

    return (
        <div className="pt-2">
            {/* Year Info Card */}
            <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-4 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
                            <i className="fas fa-calendar text-gray-100 dark:text-gray-900"></i>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Select Month
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Select a month to view details for{" "}
                                {selectedYear}
                            </p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="mt-4 md:mt-0 p-1">
                            <div className="flex items-center space-x-2">
                                <i className="fas fa-calendar-alt text-gray-400"></i>
                                <select
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                    className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-dark-800 border border-gray-300 dark:border-dark-700 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 text-sm"
                                >
                                    {years.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Months Grid */}
            <div className="min-h-[55vh]">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {months.map((month) => {
                        const isCurrentMonth =
                            selectedYear === new Date().getFullYear() &&
                            month.id === new Date().getMonth() + 1;

                        return (
                            <MonthCard
                                key={month.id}
                                month={month}
                                isCurrentMonth={isCurrentMonth}
                                selectedYear={selectedYear}
                                onSelect={() => handleMonthSelect(month.id)}
                                isSelected={selectedMonth === month.id}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Footer Info */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-700">
                <div className="flex flex-wrap justify-between items-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Showing calendar for{" "}
                        <span className="font-medium text-gray-900 dark:text-white">
                            {selectedYear}
                        </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
                        <i className="fas fa-info-circle mr-1"></i>
                        Years available: {years[0]} - {years[years.length - 1]}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthCardsMenu;
