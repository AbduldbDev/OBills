import React from "react";
import { useNavigate } from "react-router-dom";

const PageHeader = ({
    title,
    description,
    actionButton,
    showBackButton = false,
    backButtonText = "Back",
    children,
}) => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1); // Go back one page in history
    };

    return (
        <div className="mb-6">
            {/* Back Button Row - Only shown if back button is enabled */}
            {showBackButton && (
                <div className="mb-4">
                    <button
                        onClick={handleBackClick}
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                    >
                        <i className="fas fa-arrow-left"></i>
                        {backButtonText}
                    </button>
                </div>
            )}

            {/* Main Header Content */}
            <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start md:items-center">
                <div className="text-center lg:text-start">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {description}
                        </p>
                    )}
                    {children}
                </div>

                {actionButton && (
                    <div className="flex items-center space-x-3 mt-4 md:mt-0">
                        {actionButton}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
