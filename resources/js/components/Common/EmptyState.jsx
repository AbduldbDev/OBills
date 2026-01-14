import React from "react";

const EmptyState = ({
    icon = "fa-users",
    title = "No items found",
    message = "Get started by adding your first item.",
    actionButton,
    showButton = true,
    buttonText = "Add Item",
    onButtonClick,
}) => {
    return (
        <div className="text-center py-12 h-5 ">
            <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center mb-4">
                <i className={`fas ${icon} text-2xl text-gray-400`}></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
            {showButton && actionButton ? (
                actionButton
            ) : showButton && onButtonClick ? (
                <button
                    onClick={onButtonClick}
                    className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg font-medium"
                >
                    <i className="fas fa-plus mr-2"></i>
                    {buttonText}
                </button>
            ) : null}
        </div>
    );
};

export default EmptyState;
