import React from "react";

const LoadingState = ({
    message = "Loading...",
    type = "spinner", // 'spinner', 'skeleton', or 'dots'
    skeletonCount = 5, // Number of skeleton items to show
    className = "", // Additional classes
}) => {
    // Spinner loading (default)
    if (type === "spinner") {
        return (
            <div
                className={`flex justify-center items-center min-h-[400px] ${className}`}
            >
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto border-4 border-gray-300 border-t-gray-900 dark:border-dark-700 dark:border-t-white rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                        {message}
                    </p>
                </div>
            </div>
        );
    }

    // Dots loading animation
    if (type === "dots") {
        return (
            <div
                className={`flex justify-center items-center min-h-[400px] ${className}`}
            >
                <div className="text-center">
                    <div className="flex justify-center space-x-2 mb-4">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            ></div>
                        ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        {message}
                    </p>
                </div>
            </div>
        );
    }

    // Skeleton loading - for list/card layouts
    if (type === "skeleton") {
        return (
            <div className={className}>
                {/* You can customize skeleton layout based on your needs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: skeletonCount }).map((_, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6 animate-pulse"
                        >
                            {/* Icon/avatar skeleton */}
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-dark-700"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-dark-600 rounded w-1/2"></div>
                                </div>
                            </div>

                            {/* Content skeleton */}
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded"></div>
                                <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-2/3"></div>
                            </div>

                            {/* Button skeleton */}
                            <div className="mt-6 flex space-x-2">
                                <div className="flex-1 h-10 bg-gray-200 dark:bg-dark-600 rounded"></div>
                                <div className="flex-1 h-10 bg-gray-200 dark:bg-dark-600 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Card skeleton - specifically for card layouts
    if (type === "card-skeleton") {
        return (
            <div
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
            >
                {Array.from({ length: skeletonCount }).map((_, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-4 animate-pulse"
                    >
                        <div className="flex flex-col items-center">
                            {/* Icon skeleton */}
                            <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-dark-700 mb-3"></div>

                            {/* Title skeleton */}
                            <div className="h-5 bg-gray-300 dark:bg-dark-700 rounded w-3/4 mb-2"></div>

                            {/* Subtitle skeleton */}
                            <div className="h-6 bg-gray-300 dark:bg-dark-700 rounded w-1/2 mb-3"></div>

                            {/* Content skeleton */}
                            <div className="w-full pt-3 border-t border-gray-100 dark:border-dark-700">
                                <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-full"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Table skeleton - for table layouts
    if (type === "table-skeleton") {
        return (
            <div className={className}>
                {/* Table header skeleton */}
                <div className="bg-gray-50 dark:bg-dark-800 rounded-t-xl border border-gray-200 dark:border-dark-700 p-4 animate-pulse">
                    <div className="flex justify-between items-center">
                        <div className="h-6 bg-gray-300 dark:bg-dark-700 rounded w-48"></div>
                        <div className="h-10 bg-gray-300 dark:bg-dark-700 rounded w-32"></div>
                    </div>
                </div>

                {/* Table rows skeleton */}
                <div className="bg-white dark:bg-dark-800 border border-t-0 border-gray-200 dark:border-dark-700 rounded-b-xl divide-y divide-gray-200 dark:divide-dark-700">
                    {Array.from({ length: skeletonCount }).map((_, index) => (
                        <div key={index} className="p-4 animate-pulse">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded w-64"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-dark-600 rounded w-32"></div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="h-8 w-20 bg-gray-200 dark:bg-dark-600 rounded"></div>
                                    <div className="h-8 w-20 bg-gray-200 dark:bg-dark-600 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Simple bar skeleton - minimal loading
    if (type === "bar-skeleton") {
        return (
            <div className={`space-y-3 ${className}`}>
                {Array.from({ length: skeletonCount }).map((_, index) => (
                    <div
                        key={index}
                        className="animate-pulse flex items-center space-x-4"
                    >
                        <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-dark-700"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded"></div>
                            <div className="h-3 bg-gray-200 dark:bg-dark-600 rounded w-5/6"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return null;
};

export default LoadingState;
