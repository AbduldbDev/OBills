import React from "react";

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "danger",
    isLoading = false,
}) => {
    if (!isOpen) return null;

    // Type styles
    const typeStyles = {
        danger: {
            icon: "fas fa-exclamation-triangle",
            iconColor: "text-red-500",
            confirmButton: "bg-red-600 hover:bg-red-700 text-white",
        },
        warning: {
            icon: "fas fa-exclamation-circle",
            iconColor: "text-yellow-500",
            confirmButton: "bg-yellow-600 hover:bg-yellow-700 text-white",
        },
        info: {
            icon: "fas fa-info-circle",
            iconColor: "text-blue-500",
            confirmButton: "bg-blue-600 hover:bg-blue-700 text-white",
        },
        success: {
            icon: "fas fa-check-circle",
            iconColor: "text-green-500",
            confirmButton: "bg-green-600 hover:bg-green-700 text-white",
        },
    };

    const styles = typeStyles[type];

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/80 bg-opacity-50 dark:bg-opacity-70 transition-opacity"></div>

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-dark-800 p-6 shadow-xl transition-all">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-700 mb-4">
                            <i
                                className={`${styles.icon} ${styles.iconColor} text-xl`}
                            ></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {message}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 mt-3 sm:mt-0 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={` flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles.confirmButton}`}
                        >
                            {isLoading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    Processing...
                                </>
                            ) : (
                                confirmText
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
