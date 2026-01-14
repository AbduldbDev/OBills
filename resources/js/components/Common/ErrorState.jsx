import React from "react";

const ErrorState = ({
    error,
    onRetry,
    title = "Error Loading Data",
    retryText = "Try Again",
}) => {
    return (
        <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-exclamation-triangle text-2xl text-red-600 dark:text-red-400"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg font-medium"
                >
                    <i className="fas fa-redo mr-2"></i>
                    {retryText}
                </button>
            )}
        </div>
    );
};

export default ErrorState;
