import React, { useState, useEffect } from "react";
import { billsApi } from "../../api/billsApi";

const PaymentStatusModal = ({
    isOpen,
    onClose,
    payment,
    onUpdateStatus,
    isLoading = false,
}) => {
    const [selectedStatus, setSelectedStatus] = useState(payment?.status || "");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentDate, setPaymentDate] = useState("");
    const [paymentTime, setPaymentTime] = useState("");
    const [receiptImage, setReceiptImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const paymentMethods = [
        { value: "cash", label: "Cash", icon: "fa-money-bill" },
        { value: "gcash", label: "GCash", icon: "fa-mobile-screen" },
    ];

    const statusOptions = [
        {
            value: "pending",
            label: "Pending",
            color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
        },
        {
            value: "sent",
            label: "Sent",
            color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        },
        {
            value: "paid",
            label: "Paid",
            color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        },
        {
            value: "skipped",
            label: "Skipped",
            color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        },
    ];

    useEffect(() => {
        if (isOpen) {
            const now = new Date();
            const formattedDate = now.toISOString().split("T")[0];
            const formattedTime = now.toTimeString().slice(0, 5);

            setPaymentDate(formattedDate);
            setPaymentTime(formattedTime);
            setSelectedStatus(payment?.status || "");
            setPaymentMethod("");
            setReceiptImage(null);
            setPreviewUrl("");
            setErrors({});
            setSubmitError("");
        }
    }, [isOpen, payment]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = [
                "image/jpeg",
                "image/png",
                "image/gif",
                "image/webp",
            ];
            if (!validTypes.includes(file.type)) {
                setErrors((prev) => ({
                    ...prev,
                    receiptImage:
                        "Please upload a valid image (JPEG, PNG, GIF, WebP)",
                }));
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    receiptImage: "Image size should be less than 5MB",
                }));
                return;
            }

            setReceiptImage(file);
            setErrors((prev) => ({ ...prev, receiptImage: "" }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setReceiptImage(null);
        setPreviewUrl("");
    };

    const validateForm = () => {
        const newErrors = {};

        if (!selectedStatus) {
            newErrors.status = "Please select a status";
        }

        if (selectedStatus === "paid") {
            if (!paymentMethod) {
                newErrors.paymentMethod = "Please select payment method";
            }
            if (!paymentDate) {
                newErrors.paymentDate = "Please select payment date";
            }
            if (!paymentTime) {
                newErrors.paymentTime = "Please select payment time";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        try {
            if (!payment || !payment.id) {
                throw new Error("Payment object is missing ID property");
            }

            const formData = new FormData();

            formData.append("id", payment.id);
            formData.append("status", selectedStatus);

            if (payment.month) {
                formData.append("month", payment.month);
            }

            if (selectedStatus === "paid") {
                const paymentDateTime = `${paymentDate} ${paymentTime}:00`;
                formData.append("method", paymentMethod);
                formData.append("payment_date", paymentDateTime);

                if (receiptImage) {
                    formData.append("receipt", receiptImage);
                }
            }

            const response = await billsApi.updateStatus(formData);

            if (response.message || response.data) {
                if (onUpdateStatus) {
                    onUpdateStatus({
                        success: true,
                        data: response.data,
                        message:
                            response.message ||
                            "Payment status updated successfully",
                        payment: payment,
                    });
                }

                onClose();
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            let errorMsg = "Failed to update payment status";

            if (error.response) {
                if (
                    error.response.status === 422 &&
                    error.response.data.errors
                ) {
                    const validationErrors = error.response.data.errors;
                    const allErrors = Object.entries(validationErrors)
                        .map(
                            ([field, messages]) =>
                                `${field}: ${messages.join(", ")}`
                        )
                        .join("; ");
                    errorMsg = `Validation errors: ${allErrors}`;
                } else if (error.response.data.message) {
                    errorMsg = error.response.data.message;
                } else if (error.response.data.error) {
                    errorMsg = error.response.data.error;
                } else if (error.response.status === 404) {
                    errorMsg = "Payment not found";
                } else if (error.response.status === 500) {
                    errorMsg = "Server error. Please try again later.";
                }
            } else if (error.request) {
                errorMsg =
                    "No response from server. Please check your connection.";
            } else {
                errorMsg = error.message || "An unexpected error occurred";
            }

            setSubmitError(errorMsg);

            if (onUpdateStatus) {
                onUpdateStatus({
                    success: false,
                    error: errorMsg,
                    paymentId: payment?.id,
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 bg-black/80 bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-dark-800 shadow-2xl transition-all">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
                                    <i className="fas fa-credit-card text-gray-100 dark:text-gray-900"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Update Payment Status
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Unit SM-{payment?.unit_number || "N/A"}{" "}
                                        • {payment?.month || ""}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                                disabled={isSubmitting}
                            >
                                <i className="fas fa-times text-gray-500 dark:text-gray-400"></i>
                            </button>
                        </div>
                    </div>

                    <div className="px-6 py-4">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Select Status
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {statusOptions.map((status) => (
                                    <button
                                        key={status.value}
                                        onClick={() =>
                                            setSelectedStatus(status.value)
                                        }
                                        className={`px-4 py-3 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 ${
                                            selectedStatus === status.value
                                                ? `border ${status.color} border-opacity-50`
                                                : "border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700"
                                        }`}
                                        disabled={isSubmitting}
                                    >
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${status.color}`}
                                        >
                                            {status.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            {errors.status && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        {selectedStatus === "paid" && (
                            <div className="space-y-4 border-t border-gray-200 dark:border-dark-700 pt-4">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Payment Details
                                </h4>

                                <div>
                                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                                        {paymentMethods.map((method) => (
                                            <button
                                                key={method.value}
                                                type="button"
                                                onClick={() =>
                                                    setPaymentMethod(
                                                        method.value
                                                    )
                                                }
                                                className={`px-3 py-2 rounded-lg border transition-all duration-200 flex flex-col items-center gap-1 ${
                                                    paymentMethod ===
                                                    method.value
                                                        ? "border-2 border-gray-900 dark:border-white bg-gray-50 dark:bg-dark-700"
                                                        : "border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700"
                                                }`}
                                                disabled={isSubmitting}
                                            >
                                                <i
                                                    className={`fas ${method.icon} text-gray-600 dark:text-gray-400`}
                                                ></i>
                                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                    {method.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.paymentMethod && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.paymentMethod}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Payment Date
                                        </label>
                                        <input
                                            type="date"
                                            value={paymentDate}
                                            onChange={(e) =>
                                                setPaymentDate(e.target.value)
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isSubmitting}
                                        />
                                        {errors.paymentDate && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.paymentDate}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Payment Time
                                        </label>
                                        <input
                                            type="time"
                                            value={paymentTime}
                                            onChange={(e) =>
                                                setPaymentTime(e.target.value)
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isSubmitting}
                                        />
                                        {errors.paymentTime && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.paymentTime}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Receipt/Proof of Payment (Optional)
                                    </label>
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="receipt-upload"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                disabled={isSubmitting}
                                            />
                                            <label
                                                htmlFor="receipt-upload"
                                                className={`flex items-center justify-center px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                                                    isSubmitting
                                                        ? "border-gray-200 dark:border-dark-700 opacity-50 cursor-not-allowed"
                                                        : "border-gray-300 dark:border-dark-600 hover:border-gray-400 dark:hover:border-dark-500"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <i className="fas fa-cloud-upload-alt text-gray-400 dark:text-gray-500"></i>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        Click to upload receipt
                                                    </span>
                                                </div>
                                            </label>
                                        </div>

                                        {previewUrl && (
                                            <div className="relative border border-gray-200 dark:border-dark-700 rounded-lg overflow-hidden">
                                                <div className="p-2 bg-gray-50 dark:bg-dark-900 flex justify-between items-center">
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                                        Uploaded Receipt
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={removeImage}
                                                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 disabled:opacity-50"
                                                        disabled={isSubmitting}
                                                    >
                                                        <i className="fas fa-trash text-sm"></i>
                                                    </button>
                                                </div>
                                                <div className="p-2">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Receipt preview"
                                                        className="w-full h-32 object-contain rounded"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {errors.receiptImage && (
                                            <p className="text-sm text-red-600 dark:text-red-400">
                                                {errors.receiptImage}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {submitError && (
                            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <i className="fas fa-exclamation-circle text-red-600 dark:text-red-400 mt-0.5"></i>
                                    <div>
                                        <p className="text-sm text-red-800 dark:text-red-300 font-medium">
                                            Update Failed
                                        </p>
                                        <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                                            {submitError}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-700 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2.5 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save"></i>
                                    Update Status
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentStatusModal;
