import React from "react";

const SearchFilterBar = ({
    searchTerm,
    setSearchTerm,
    filterValue,
    setFilterValue,
    filterOptions,
    sortBy,
    sortOrder,
    onSort,
    sortOptions,
    searchPlaceholder = "Search...",
    filterLabel = "Filter:",
    sortLabel = "Sort:",
}) => {
    const hasFilter = filterOptions && filterOptions.length > 0;
    const hasSort = sortOptions && sortOptions.length > 0;

    return (
        <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-4 mb-6">
            <div className="space-y-4">
                {/* Search Bar - Always show if search functionality is provided */}
                {(searchTerm !== undefined || setSearchTerm) && (
                    <div className="relative">
                        <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchTerm || ""}
                            onChange={(e) =>
                                setSearchTerm && setSearchTerm(e.target.value)
                            }
                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-dark-900 border border-gray-300 dark:border-dark-700 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600 text-sm"
                        />
                    </div>
                )}

                {/* Filters and Sort Row - Only show if at least one is available */}
                {(hasFilter || hasSort) && (
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Filter Dropdown - Only show if filterOptions is provided */}
                        {hasFilter && (
                            <div className="lg:w-auto order-1 lg:order-2">
                                <div className="flex items-center space-x-3">
                                    <span className="lg:block hidden text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                        {filterLabel}
                                    </span>
                                    <select
                                        value={filterValue || ""}
                                        onChange={(e) =>
                                            setFilterValue &&
                                            setFilterValue(e.target.value)
                                        }
                                        className="w-full lg:w-40 px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-dark-900 border border-gray-300 dark:border-dark-700 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600 text-sm"
                                    >
                                        {filterOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Sort Buttons - Only show if sortOptions is provided */}
                        {hasSort && (
                            <div className="lg:flex lg:items-center lg:space-x-3 order-2 lg:order-1">
                                <span className="hidden lg:inline text-sm text-gray-600 dark:text-gray-400">
                                    {sortLabel}
                                </span>
                                <div className="flex space-x-2">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() =>
                                                onSort && onSort(option.value)
                                            }
                                            className={`flex-1 lg:flex-none px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                                sortBy === option.value
                                                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                                                    : "bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600"
                                            }`}
                                            title={option.tooltip}
                                        >
                                            <span className="flex items-center justify-center">
                                                {option.label}
                                                {sortBy === option.value && (
                                                    <span className="ml-1 text-xs">
                                                        {sortOrder === "asc"
                                                            ? "↑"
                                                            : "↓"}
                                                    </span>
                                                )}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchFilterBar;
