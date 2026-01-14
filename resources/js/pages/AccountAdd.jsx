import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/Common/PageHeader";
import FormInput from "../components/Form/FormInput";
import FormSelect from "../components/Form/FormSelect";
import { accountApi } from "../api/accountApi";
import Layout from "../components/Layout/Layout";

const AccountAdd = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const roleOptions = [
        { value: "super_admin", label: "Super Admin" },
        { value: "admin", label: "Administrator" },
        { value: "accountant", label: "Accountant" },
        { value: "viewer", label: "Viewer" },
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Username is required";
        } else if (
            !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
                formData.email
            )
        ) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password =
                "Must contain uppercase, lowercase, and numbers";
        }

        if (!formData.role) {
            newErrors.role = "Role is required";
        }

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccessMessage("");
        setErrors({});

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const submitData = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                role: formData.role,
            };

            const response = await accountApi.createAccount(submitData);
            setSuccessMessage(
                `Account for ${submitData.name} has been created successfully!`
            );

            setFormData({
                name: "",
                email: "",
                password: "",
                role: "",
            });

            setTimeout(() => {
                navigate("/accounts");
            }, 2000);
        } catch (error) {
            console.error("API Error:", error.response?.data);

            if (error.response?.data?.errors) {
                const apiErrors = error.response.data.errors;
                const mappedErrors = {};

                if (apiErrors.name) {
                    mappedErrors.name = apiErrors.name[0];
                }

                if (apiErrors.email) {
                    mappedErrors.email = apiErrors.email[0];
                }

                if (apiErrors.password) {
                    mappedErrors.password = apiErrors.password[0];
                }

                if (apiErrors.role) {
                    mappedErrors.role = apiErrors.role[0];
                }

                if (Object.keys(mappedErrors).length === 0) {
                    mappedErrors.submit =
                        error.response?.data?.message ||
                        "Failed to create account. Please try again.";
                }

                setErrors(mappedErrors);
            } else {
                setErrors((prev) => ({
                    ...prev,
                    submit:
                        error.message ||
                        "Failed to create account. Please try again.",
                }));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate("/accounts");
    };

    return (
        <Layout>
            <div className="pt-2">
                <PageHeader
                    title="Add New Account"
                    description="Create a new user account with appropriate permissions"
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="space-y-5">
                        <div className="bg-white dark:bg-dark-800 rounded-lg lg:rounded-2xl border border-gray-200 dark:border-dark-700 p-6 shadow-sm">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Account Information
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Enter the user details below
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Success & Error Messages */}
                                {successMessage && (
                                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                        <p className="text-sm text-green-600 dark:text-green-400">
                                            <i className="fas fa-check-circle mr-2"></i>
                                            {successMessage}
                                            <span className="block text-xs mt-1 text-green-500 dark:text-green-300">
                                                Redirecting to accounts list...
                                            </span>
                                        </p>
                                    </div>
                                )}

                                {errors.submit && (
                                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                        <p className="text-sm text-red-600 dark:text-red-400">
                                            <i className="fas fa-exclamation-circle mr-2"></i>
                                            {errors.submit}
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-5">
                                    {/* Name Field */}
                                    <FormInput
                                        label="Full Name"
                                        name="name"
                                        type="text"
                                        size="sm"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                        error={errors.name}
                                        required={true}
                                        icon="fas fa-user"
                                        disabled={isSubmitting}
                                    />

                                    {/* Email/Username Field */}
                                    <FormInput
                                        label="Username (Email)"
                                        name="email"
                                        type="email"
                                        size="sm"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter username (email address)"
                                        error={errors.email}
                                        required={true}
                                        icon="fas fa-envelope"
                                        disabled={isSubmitting}
                                    />

                                    {/* Password Field */}
                                    <FormInput
                                        label="Password"
                                        name="password"
                                        type="password"
                                        size="sm"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter password (min. 6 characters)"
                                        error={errors.password}
                                        required={true}
                                        icon="fas fa-lock"
                                        showPasswordToggle={true}
                                        disabled={isSubmitting}
                                        autoComplete="new-password"
                                    />

                                    {/* Role Dropdown */}
                                    <FormSelect
                                        label="Role"
                                        name="role"
                                        size="sm"
                                        value={formData.role}
                                        onChange={handleChange}
                                        options={roleOptions}
                                        error={errors.role}
                                        required={true}
                                        icon="fas fa-user-tag"
                                        disabled={isSubmitting}
                                    />

                                    {/* Form Actions */}
                                    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
                                        {/* Back Button - Left aligned on mobile and desktop */}
                                        <div className="flex-1 sm:flex-none">
                                            <button
                                                type="button"
                                                onClick={handleCancel}
                                                disabled={isSubmitting}
                                                className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                                            >
                                                <i className="fas fa-arrow-left mr-2"></i>
                                                Back to Accounts
                                            </button>
                                        </div>

                                        {/* Save Button - Full width on mobile, auto width on desktop */}
                                        <div className="flex-1 sm:flex-none">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <i className="fas fa-spinner fa-spin mr-2"></i>
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-save mr-2"></i>
                                                        Save Changes
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Guidelines Section */}
                    <div className="bg-white dark:bg-dark-800 rounded-lg lg:rounded-2xl border border-gray-200 dark:border-dark-700 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            <i className="fas fa-info-circle mr-2 text-blue-500"></i>
                            Account Creation Guidelines
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 mt-0.5">
                                    <i className="fas fa-1 text-blue-600 dark:text-blue-400 text-xs"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        User Information
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        Enter the full name and a valid email
                                        address as username
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 mt-0.5">
                                    <i className="fas fa-2 text-blue-600 dark:text-blue-400 text-xs"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Password Security
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        Password must be at least 6 characters
                                        with uppercase, lowercase, and numbers
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 mt-0.5">
                                    <i className="fas fa-3 text-blue-600 dark:text-blue-400 text-xs"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Role Selection
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        Choose appropriate permissions based on
                                        user responsibilities
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-700">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                Quick Tips
                            </h4>
                            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                <li className="flex items-start">
                                    <i className="fas fa-check text-green-500 mr-2 mt-0.5 text-xs"></i>
                                    Use a strong, unique password for each
                                    account
                                </li>
                                <li className="flex items-start">
                                    <i className="fas fa-check text-green-500 mr-2 mt-0.5 text-xs"></i>
                                    Email addresses must be unique across all
                                    accounts
                                </li>
                                <li className="flex items-start">
                                    <i className="fas fa-check text-green-500 mr-2 mt-0.5 text-xs"></i>
                                    Assign roles based on the user's
                                    responsibilities
                                </li>
                            </ul>
                        </div>

                        <div className="mt-6 p-4 bg-gray-50 dark:bg-dark-900/50 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                <i className="fas fa-exclamation-triangle mr-1"></i>
                                All fields marked with * are required. Email
                                addresses must be unique.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AccountAdd;
