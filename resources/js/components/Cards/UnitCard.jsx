import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apartmentApi } from "../../api/apartmentApi";
import ConfirmationModal from "../Common/ConfirmationModal";

const UnitCard = ({
    unit,
    onDeleteSuccess, // Callback when delete is successful
    getStatusColor,
    getStatusLabel,
    isReadOnly,
}) => {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    const handleEdit = () => {
        navigate(`/units/edit/${unit.id}`);
    };

    const handleDeleteClick = () => {
        setDeleteError(null);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        setDeleteError(null);

        try {
            await apartmentApi.deleteUnit(unit.id);

            // Show success message
            setShowDeleteModal(false);

            // Call the success callback to update parent component
            if (onDeleteSuccess) {
                onDeleteSuccess(unit.id);
            }
        } catch (error) {
            console.error("Delete error:", error);
            setDeleteError(
                error.response?.data?.message ||
                    "Failed to delete unit. Please try again."
            );
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        if (!isDeleting) {
            setShowDeleteModal(false);
            setDeleteError(null);
        }
    };

    return (
        <>
            <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-5 transition-all duration-200 hover:shadow-md">
                {/* Header with Unit Number */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 overflow-hidden`}
                        >
                            <span className="font-bold text-lg">
                                <i className="fas fa-house font-bold text-gray-900 dark:text-white text-lg"></i>
                            </span>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                                Unit {unit.unit_number}
                            </h3>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            unit.status
                        )}`}
                    >
                        {getStatusLabel(unit.status)}
                    </span>
                </div>

                {/* Unit Details */}
                <div className="space-y-3 pl-2">
                    {/* Tenant Info */}
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-dark-700 flex items-center justify-center mr-3">
                            <i className="fas fa-user text-gray-500 dark:text-gray-400 text-sm"></i>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                Tenant
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {unit.tenant_name || "Vacant"}
                            </p>
                        </div>
                    </div>

                    {/* Submeter Info */}
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-dark-700 flex items-center justify-center mr-3">
                            <i className="fas fa-bolt text-gray-500 dark:text-gray-400 text-sm"></i>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                Submeter
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                                SM-{unit.submeter_number || "N/A"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                {!isReadOnly && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-700">
                        <div className="flex space-x-2">
                            {/* Edit Button */}
                            <button
                                onClick={handleEdit}
                                className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors flex items-center justify-center border border-gray-300 dark:border-dark-600"
                            >
                                <i className="fas fa-edit mr-2"></i>
                                Edit
                            </button>

                            {/* Delete Button */}
                            <button
                                onClick={handleDeleteClick}
                                className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors flex items-center justify-center border border-gray-300 dark:border-dark-600"
                            >
                                <i className="fas fa-trash mr-2"></i>
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Unit"
                message={`Are you sure you want to delete Unit ${unit.unit_number}? This action cannot be undone.`}
                confirmText="Delete Unit"
                cancelText="Cancel"
                type="danger"
                isLoading={isDeleting}
            />

            {/* Delete Error Alert */}
            {deleteError && (
                <div className="fixed top-4 right-4 z-50 max-w-sm">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 shadow-lg">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <i className="fas fa-exclamation-circle text-red-600 dark:text-red-400 text-lg"></i>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {deleteError}
                                </p>
                                <button
                                    onClick={() => setDeleteError(null)}
                                    className="mt-1 text-xs text-red-500 dark:text-red-300 hover:text-red-700 dark:hover:text-red-200"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UnitCard;
