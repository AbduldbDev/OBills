import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/Common/PageHeader";
import FormInput from "../components/Form/FormInput";
import { billsApi } from "../api/billsApi";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout/Layout";

const BillAdd = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        posted_by: "",
        total_bill: "",
        rate: "",
        due_date: "",
        month: "",
        image: null,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const [monthOptions, setMonthOptions] = useState([]);

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                posted_by: user.name || user.username || user.email || "",
            }));
        }
    }, [user]);

    useEffect(() => {
        const generateMonthOptions = () => {
            const options = [];
            const today = new Date();

            for (let i = 0; i < 5; i++) {
                const date = new Date(
                    today.getFullYear(),
                    today.getMonth() - i,
                    1
                );
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const monthValue = `${year}-${month}`;
                const monthName = date.toLocaleDateString("en-US", {
                    month: "long",
                });
                const label = `${monthName} ${year}`;

                options.push({
                    value: monthValue,
                    label: label,
                    date: date,
                });
            }
            options.sort((a, b) => b.date - a.date);
            const currentMonth = `${today.getFullYear()}-${String(
                today.getMonth() + 1
            ).padStart(2, "0")}`;

            setMonthOptions(options);
            if (!formData.month) {
                setFormData((prev) => ({ ...prev, month: currentMonth }));
            }
        };

        generateMonthOptions();
    }, []);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.posted_by.trim()) {
            newErrors.posted_by = "Posted by name is required";
        }

        if (!formData.total_bill) {
            newErrors.total_bill = "Total bill amount is required";
        } else if (
            isNaN(formData.total_bill) ||
            parseFloat(formData.total_bill) <= 0
        ) {
            newErrors.total_bill = "Please enter a valid positive amount";
        }

        if (!formData.rate) {
            newErrors.rate = "Rate is required";
        } else if (isNaN(formData.rate) || parseFloat(formData.rate) <= 0) {
            newErrors.rate = "Please enter a valid positive rate";
        }

        if (!formData.due_date) {
            newErrors.due_date = "Due date is required";
        }

        if (!formData.month) {
            newErrors.month = "Billing month is required";
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/gif",
                "application/pdf",
            ];
            if (!validTypes.includes(file.type)) {
                setErrors((prev) => ({
                    ...prev,
                    image: "Please upload a valid image or PDF file",
                }));
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    image: "File size should be less than 5MB",
                }));
                return;
            }

            setFormData((prev) => ({
                ...prev,
                image: file,
            }));

            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewImage(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setPreviewImage(null);
            }

            if (errors.image) {
                setErrors((prev) => ({ ...prev, image: "" }));
            }
        }
    };

    const handleRemoveImage = () => {
        setFormData((prev) => ({ ...prev, image: null }));
        setPreviewImage(null);
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
            const formDataToSend = new FormData();
            formDataToSend.append("posted_by", formData.posted_by.trim());
            formDataToSend.append(
                "total_bill",
                parseFloat(formData.total_bill)
            );
            formDataToSend.append("rate", parseFloat(formData.rate));
            formDataToSend.append("due_date", formData.due_date);
            formDataToSend.append("month", formData.month);

            if (formData.image) {
                formDataToSend.append("image", formData.image);
            }

            const response = await billsApi.createBill(formDataToSend);
            const selectedMonth = monthOptions.find(
                (opt) => opt.value === formData.month
            );
            const monthDisplay = selectedMonth
                ? selectedMonth.label
                : formData.month;

            setSuccessMessage(
                `Bill for ${monthDisplay} has been added successfully!`
            );

            setFormData({
                posted_by: "",
                total_bill: "",
                rate: "",
                due_date: "",
                month: new Date().toISOString().slice(0, 7),
                image: null,
            });
            setPreviewImage(null);
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = "";

            setTimeout(() => {
                navigate("/bill-receipt");
            }, 2000);
        } catch (error) {
            if (error.response?.data?.errors) {
                const apiErrors = error.response.data.errors;
                const mappedErrors = {};

                if (apiErrors.posted_by) {
                    mappedErrors.posted_by = apiErrors.posted_by[0];
                }

                if (apiErrors.total_bill) {
                    mappedErrors.total_bill = apiErrors.total_bill[0];
                }

                if (apiErrors.rate) {
                    mappedErrors.rate = apiErrors.rate[0];
                }

                if (apiErrors.due_date) {
                    mappedErrors.due_date = apiErrors.due_date[0];
                }

                if (apiErrors.month) {
                    mappedErrors.month = apiErrors.month[0];
                }

                if (apiErrors.image) {
                    mappedErrors.image = apiErrors.image[0];
                }

                if (Object.keys(mappedErrors).length === 0) {
                    mappedErrors.submit =
                        error.response?.data?.message ||
                        "Failed to add bill. Please try again.";
                }

                setErrors(mappedErrors);
            } else {
                setErrors((prev) => ({
                    ...prev,
                    submit:
                        error.message ||
                        "Failed to add bill. Please try again.",
                }));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate("/bill-receipt");
    };

    return (
        <Layout>
            <div className="pt-2">
                <PageHeader
                    title="Add New Bill"
                    description="Add a new electricity bill receipt to the system"
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="space-y-5">
                        <div className="bg-white dark:bg-dark-800 rounded-lg lg:rounded-2xl border border-gray-200 dark:border-dark-700 p-6 shadow-sm">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Bill Information
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Enter the bill details below
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
                                                Redirecting to bills list...
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
                                    {/* Total Bill Field */}
                                    <FormInput
                                        label="Total Bill (₱)"
                                        name="total_bill"
                                        type="number"
                                        size="sm"
                                        value={formData.total_bill}
                                        onChange={handleChange}
                                        placeholder="Enter total bill amount"
                                        error={errors.total_bill}
                                        required={true}
                                        icon="fas fa-money-bill"
                                        disabled={isSubmitting}
                                        min="0"
                                        step="0.01"
                                    />

                                    {/* Rate Field */}
                                    <FormInput
                                        label="Rate per kWh (₱)"
                                        name="rate"
                                        type="number"
                                        size="sm"
                                        value={formData.rate}
                                        onChange={handleChange}
                                        placeholder="Enter rate per kWh"
                                        error={errors.rate}
                                        required={true}
                                        icon="fas fa-bolt"
                                        disabled={isSubmitting}
                                        min="0"
                                        step="0.01"
                                    />

                                    {/* Due Date Field */}
                                    <FormInput
                                        label="Due Date"
                                        name="due_date"
                                        type="date"
                                        size="sm"
                                        value={formData.due_date}
                                        onChange={handleChange}
                                        error={errors.due_date}
                                        required={true}
                                        icon="fas fa-calendar-day"
                                        disabled={isSubmitting}
                                        // min={new Date().toISOString().split("T")[0]}
                                    />

                                    {/* Month Selection */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Billing Month *
                                        </label>
                                        <div className="relative">
                                            <i className="fas fa-calendar-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                            <select
                                                name="month"
                                                value={formData.month}
                                                onChange={handleChange}
                                                disabled={isSubmitting}
                                                className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-dark-900 border ${
                                                    errors.month
                                                        ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500"
                                                        : "border-gray-300 dark:border-dark-700 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-gray-400 dark:focus:border-gray-600"
                                                } text-sm focus:outline-none focus:ring-2`}
                                            >
                                                <option value="">
                                                    Select billing month
                                                </option>
                                                {monthOptions.map((option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {errors.month && (
                                            <p className="text-xs text-red-600 dark:text-red-400">
                                                <i className="fas fa-exclamation-circle mr-1"></i>
                                                {errors.month}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Showing last 5 months including
                                            current month
                                        </p>
                                    </div>

                                    {/* Image Upload */}
                                    <div className="space-y-2 relative">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Receipt Image (Optional)
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 dark:border-dark-700 rounded-lg p-4 text-center hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
                                            {previewImage ? (
                                                <div className="space-y-3">
                                                    <div className="relative">
                                                        <img
                                                            src={previewImage}
                                                            alt="Preview"
                                                            className="mx-auto max-h-48 rounded-lg"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                handleRemoveImage
                                                            }
                                                            className="absolute h-5.5 w-5.5 pb-2 top-0  right-2 bg-red-500 text-white  rounded-full hover:bg-red-600"
                                                        >
                                                            <i className="fas fa-times text-xs"></i>
                                                        </button>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Image selected. Click to
                                                        change.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <i className="fas fa-cloud-upload-alt text-3xl text-gray-400"></i>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Click to upload receipt
                                                        image
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                                        PNG, JPG, PDF up to 5MB
                                                    </p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                name="image"
                                                onChange={handleFileChange}
                                                disabled={isSubmitting}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                accept=".jpg,.jpeg,.png,.gif,.pdf"
                                            />
                                        </div>
                                        {errors.image && (
                                            <p className="text-xs text-red-600 dark:text-red-400">
                                                <i className="fas fa-exclamation-circle mr-1"></i>
                                                {errors.image}
                                            </p>
                                        )}
                                    </div>

                                    {/* Form Actions */}
                                    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
                                        <div className="flex-1 sm:flex-none">
                                            <button
                                                type="button"
                                                onClick={handleCancel}
                                                disabled={isSubmitting}
                                                className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                                            >
                                                <i className="fas fa-arrow-left mr-2"></i>
                                                Back to Bills
                                            </button>
                                        </div>

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
                                                        Add Bill
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
                            Bill Creation Guidelines
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 mt-0.5">
                                    <i className="fas fa-1 text-blue-600 dark:text-blue-400 text-xs"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Month Selection
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        Select from the last 5 months. Current
                                        month is selected by default.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 mt-0.5">
                                    <i className="fas fa-2 text-blue-600 dark:text-blue-400 text-xs"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Date Information
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        Select correct billing month and due
                                        date
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 mt-0.5">
                                    <i className="fas fa-3 text-blue-600 dark:text-blue-400 text-xs"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Receipt Upload
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        Upload clear image or PDF of the receipt
                                        (optional)
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-700">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                Important Notes
                            </h4>
                            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                                <li className="flex items-start">
                                    <i className="fas fa-check text-green-500 mr-2 mt-0.5 text-xs"></i>
                                    Each month can only have one bill entry
                                </li>
                                <li className="flex items-start">
                                    <i className="fas fa-check text-green-500 mr-2 mt-0.5 text-xs"></i>
                                    Due date must be in the future
                                </li>
                                <li className="flex items-start">
                                    <i className="fas fa-check text-green-500 mr-2 mt-0.5 text-xs"></i>
                                    Total bill and rate must be positive numbers
                                </li>
                            </ul>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-900/20">
                            <div className="flex items-start">
                                <i className="fas fa-calendar-alt text-blue-500 mr-2 mt-0.5"></i>
                                <div>
                                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                                        Current Month Selection
                                    </p>
                                    <p className="text-xs text-blue-600 dark:text-blue-400">
                                        The current month (
                                        {new Date().toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "long",
                                                year: "numeric",
                                            }
                                        )}
                                        ) is pre-selected by default. You can
                                        choose from the last 5 months.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-gray-50 dark:bg-dark-900/50 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                <i className="fas fa-exclamation-triangle mr-1"></i>
                                All fields marked with * are required. Each
                                month must be unique.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default BillAdd;
