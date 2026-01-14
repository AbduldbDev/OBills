import React from "react";

const PageHeader = ({ title, description, actionButton, children }) => {
    return (
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start md:items-center mb-6">
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
    );
};

export default PageHeader;
