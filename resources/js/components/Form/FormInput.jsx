import React, { useState } from "react";

const FormInput = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder = "",
    error = "",
    disabled = false,
    required = false,
    icon = null,
    className = "",
    inputClassName = "",
    showPasswordToggle = false,
    autoComplete = "off",
    maxLength,
    minLength,
    size = "md",
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const sizeClasses = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-3",
        lg: "px-4 py-3.5 text-lg",
    };

    const getInputType = () => {
        if (type === "password" && showPasswordToggle) {
            return showPassword ? "text" : "password";
        }
        return type;
    };

    const getIcon = () => {
        if (icon) return icon;

        // Default icons based on input type
        const iconMap = {
            text: "fas fa-pen",
            email: "fas fa-envelope",
            password: "fas fa-lock",
            number: "fas fa-hashtag",
            tel: "fas fa-phone",
            date: "fas fa-calendar",
            time: "fas fa-clock",
            url: "fas fa-link",
            search: "fas fa-search",
        };

        return iconMap[type] || "fas fa-pen";
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {/* Label */}
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Input Container */}
            <div className="relative">
                {/* Icon */}
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className={`${getIcon()} text-gray-400`}></i>
                    </div>
                )}

                {/* Input Field */}
                <input
                    id={name}
                    name={name}
                    type={getInputType()}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    maxLength={maxLength}
                    minLength={minLength}
                    className={`
                        w-full   ${
                            sizeClasses[size]
                        }  px-4 py-3 rounded-lg border
                        ${icon ? "pl-10" : ""}
                        ${
                            showPasswordToggle && type === "password"
                                ? "pr-10"
                                : ""
                        }
                        ${
                            error
                                ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-dark-700 focus:ring-dark-900 dark:focus:ring-white focus:red-blue-500"
                        }
                        bg-gray-50 dark:bg-dark-900 
                        text-gray-900 dark:text-white 
                        focus:outline-none focus:ring-1 focus:border-transparent
                        transition-colors
                        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                        ${inputClassName}
                    `}
                    {...props}
                />

                {/* Password Toggle Button */}
                {showPasswordToggle && type === "password" && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        disabled={disabled}
                    >
                        <i
                            className={`fas ${
                                showPassword ? "fa-eye-slash" : "fa-eye"
                            } text-gray-400 hover:text-gray-600 dark:hover:text-gray-300`}
                        ></i>
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-500 flex items-center">
                    <i className="fas fa-exclamation-circle mr-1.5"></i>
                    {error}
                </p>
            )}
        </div>
    );
};

export default FormInput;
