import React from "react";
import { useNavigate } from "react-router-dom";
const AccountCard = ({
    account,
    onEdit,
    getAccountAge,
    onDelete,
    isReadOnly,
}) => {
    const navigate = useNavigate();

    const getUserInitials = () => {
        if (!account?.name) return "U";
        return account.name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };
    const handleEdit = () => {
        navigate(`/accounts/edit/${account.id}`);
    };

    const formatRole = (role) => {
        if (!role) return "Member";
        const roles = {
            super_admin: "Super Admin",
            admin: "Administrator",
            viewer: "Viewer",
        };
        return roles[role.toLowerCase()] || role;
    };

    const userInitials = getUserInitials();

    return (
        <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-5 transition-all duration-200 hover:shadow-md">
            {/* Header with User Info */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 overflow-hidden border border-gray-300 dark:border-gray-800`}
                    >
                        <span className="font-bold text-lg">
                            {userInitials}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                            {account.name || "Unnamed User"}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            @{account.email}
                        </p>
                    </div>
                </div>

                {/* Role Badge */}
                {/* <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(
                        account.role
                    )}`}
                >
                    {formatRole(account.role)}
                </span> */}
            </div>

            {/* Account Details */}
            <div className="space-y-3 pl-1.5">
                {/* Email Info */}
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-dark-700 flex items-center justify-center mr-3   ">
                        <i className="fas fa-envelope text-gray-500 dark:text-gray-400 text-sm"></i>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Email
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {account.email}
                        </p>
                    </div>
                </div>

                {/* Created Date */}
                {account.created_at && (
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-dark-700 flex items-center justify-center mr-3 ">
                            <i className="fas fa-calendar-alt text-gray-500 dark:text-gray-400 text-sm"></i>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                Created
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {getAccountAge(account.created_at)}
                            </p>
                        </div>
                    </div>
                )}

                {/* Role Info */}
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-dark-700 flex items-center justify-center mr-3">
                        <i className="fas fa-user-tag text-gray-500 dark:text-gray-400 text-sm"></i>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Role
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatRole(account.role)}
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
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(account.id);
                            }}
                            className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors flex items-center justify-center border border-gray-300 dark:border-dark-600"
                        >
                            <i className="fas fa-trash mr-2"></i>
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountCard;
