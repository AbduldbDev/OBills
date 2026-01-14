import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import FormInput from "../Form/FormInput";
import FormCheckbox from "../Form/FormCheckbox";


const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [errors, setErrors] = useState({});
    const { login } = useAuth();
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username) {
            newErrors.username = "Username is required";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setErrors({});

        // Validate form
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);

        try {
            const result = await login(formData.username, formData.password);

            if (result.success) {
                showMessage("Login successful. Redirecting...", "success");
                setTimeout(() => {
                    navigate("/");
                }, 800);
            } else {
                // Handle API errors
                setErrors({
                    username: "Invalid login credentials. ",
                });
                showMessage("Invalid login credentials. ", "error");
            }
        } catch (error) {
            showMessage("An error occurred. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => {
            setMessage({ text: "", type: "" });
        }, 5000);
    };

    return (
        <div
            className={`font-sans min-h-screen ${
                isDarkMode ? "bg-dark-900" : "bg-white"
            } ${isDarkMode ? "text-white" : "text-black"}`}
        >
            <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
                <div className="w-full max-w-md sm:max-w-lg">
                    {/* Header */}
                    <div className="text-center mb-8 sm:mb-10">
                        <div className="flex flex-col items-center justify-center mb-4 sm:mb-6 space-y-3 sm:space-y-4">
                            <div
                                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center ${
                                    isDarkMode ? "bg-white" : "bg-black"
                                }`}
                            >
                                <i
                                    className={`fas fa-bolt ${
                                        isDarkMode ? "text-black" : "text-white"
                                    } text-xl sm:text-2xl`}
                                ></i>
                            </div>
                            <div className="text-center">
                                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                                    Ongchad Bills
                                </h1>
                                <p
                                    className={`text-xs sm:text-sm ${
                                        isDarkMode
                                            ? "text-gray-400"
                                            : "text-gray-600"
                                    } mt-1 sm:mt-1.5 tracking-wide`}
                                >
                                    Electric Bills Management System
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Login Card */}
                    <div
                        className={`login-card rounded-xl border ${
                            isDarkMode
                                ? "bg-dark-800 border-dark-700"
                                : "bg-white border-gray-300"
                        } p-5 sm:p-8`}
                    >
                        <div className="text-center mb-6 sm:mb-8">
                            <h2 className="text-lg sm:text-xl font-semibold mb-1.5 sm:mb-2">
                                Welcome Back
                            </h2>
                            <p
                                className={`text-xs sm:text-sm ${
                                    isDarkMode
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                }`}
                            >
                                Please sign in to your account
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 md:space-y-3"
                        >
                            {/* Username Field */}
                            <FormInput
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                error={errors.username}
                                disabled={isLoading}
                                required={true}
                                icon="fas fa-user"
                                className="mb-5"
                                inputClassName={`${
                                    isDarkMode
                                        ? "border-dark-700 focus:ring-white"
                                        : "border-gray-300 focus:ring-black"
                                } ${isDarkMode ? "bg-dark-900" : "bg-white"}`}
                            />

                            {/* Password Field */}
                            <FormInput
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                error={errors.password}
                                disabled={isLoading}
                                required={true}
                                icon="fas fa-lock"
                                className="mb-3"
                                showPasswordToggle={true}
                                autoComplete="current-password"
                                inputClassName={`${
                                    isDarkMode
                                        ? "border-dark-700"
                                        : "border-gray-300"
                                } ${isDarkMode ? "bg-dark-900" : "bg-white"}`}
                            />

                            {/* Remember Me Checkbox */}
                            <FormCheckbox
                                label="Remember this device"
                                name="rememberMe"
                                checked={rememberMe}
                                onChange={(e) =>
                                    setRememberMe(e.target.checked)
                                }
                                disabled={isLoading}
                                className="pl-1"
                            />

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-2.5 sm:py-3.5 text-sm sm:text-base font-semibold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200 border shadow-sm flex items-center justify-center ${
                                    isDarkMode
                                        ? "bg-white text-black border-white"
                                        : "bg-black text-white border-black"
                                } ${
                                    isLoading
                                        ? "opacity-70 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin mr-2 sm:mr-2.5"></i>
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-sign-in-alt mr-2 sm:mr-2.5"></i>
                                        Sign In
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Admin Note */}
                        <div
                            className={`mt-8 sm:mt-10 pt-5 sm:pt-6 border-t ${
                                isDarkMode
                                    ? "border-dark-700"
                                    : "border-gray-200"
                            }`}
                        >
                            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                                <i
                                    className={`fas fa-user-shield ${
                                        isDarkMode
                                            ? "text-gray-400"
                                            : "text-gray-500"
                                    } text-xs sm:text-sm`}
                                ></i>
                                <p
                                    className={`text-xs sm:text-sm text-center ${
                                        isDarkMode
                                            ? "text-gray-400"
                                            : "text-gray-600"
                                    }`}
                                >
                                    Exclusive Access • Ongchad Apartment
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
