import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/Auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import ApartmentsHistory from "./pages/ApartmentsHistory";
import PaymentHistory from "./pages/PaymentHistory";
import PaymentList from "./pages/PaymentList";
import ReadingList from "./pages/ReadingList";
import ReadingHistory from "./pages/ReadingHistory";
import Calendar from "./pages/Calendar";
import CalendarList from "./pages/CalendarList";
import Accounts from "./pages/Accounts";
import Units from "./pages/Units";
import LoginPage from "./pages/LoginPage";
import Calculation from "./pages/Calculation";
import BillReceipt from "./pages/BillReceipt";
import UnitAdd from "./pages/UnitAdd";
import EditApartmentForm from "./pages/UnitEdit";
import AddAccountForm from "./pages/AccountAdd";
import EditAccountForm from "./pages/AccountEdit";
import AddBillReceipt from "./pages/BillAdd";
import NotFoundPage from "./NotFound";
import ApartmentMonth from "./pages/ApartmentMonths";
import CalculationDetails from "./pages/CalculationDetails";
import ReadingMonths from "./pages/ReadingMonth";
import { ROLES } from "./constants/roles";

function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Routes>
            <Route
                path="/login"
                element={user ? <Navigate to="/" /> : <LoginPage />}
            />
            <Route
                path="/"
                element={
                    <PrivateRoute
                        allowedRoles={[
                            ROLES.SUPERADMIN,
                            ROLES.ADMIN,
                            ROLES.VIEWER,
                        ]}
                    >
                        <Dashboard />
                    </PrivateRoute>
                }
            />
            <Route
                path="/calculation"
                element={
                    <PrivateRoute
                        allowedRoles={[ROLES.SUPERADMIN, ROLES.ADMIN]}
                    >
                        <Calculation />
                    </PrivateRoute>
                }
            />
            <Route
                path="/bill-receipt"
                element={
                    <PrivateRoute
                        allowedRoles={[
                            ROLES.SUPERADMIN,
                            ROLES.ADMIN,
                            ROLES.VIEWER,
                        ]}
                    >
                        <BillReceipt />
                    </PrivateRoute>
                }
            />
            <Route
                path="/bill-receipt/new"
                element={
                    <PrivateRoute
                        allowedRoles={[
                            ROLES.SUPERADMIN,
                            ROLES.ADMIN,
                            ROLES.VIEWER,
                        ]}
                    >
                        <AddBillReceipt />
                    </PrivateRoute>
                }
            />
            <Route
                path="/apartments-history"
                element={
                    <PrivateRoute
                        allowedRoles={[
                            ROLES.SUPERADMIN,
                            ROLES.ADMIN,
                            ROLES.VIEWER,
                        ]}
                    >
                        <ApartmentsHistory />
                    </PrivateRoute>
                }
            />
            <Route
                path="/apartments-history/:id"
                element={
                    <PrivateRoute
                        allowedRoles={[
                            ROLES.SUPERADMIN,
                            ROLES.ADMIN,
                            ROLES.VIEWER,
                        ]}
                    >
                        <ApartmentMonth />
                    </PrivateRoute>
                }
            />
            <Route
                path="/apartments-history/:id/:month"
                element={
                    <PrivateRoute
                        allowedRoles={[
                            ROLES.SUPERADMIN,
                            ROLES.ADMIN,
                            ROLES.VIEWER,
                        ]}
                    >
                        <CalculationDetails />
                    </PrivateRoute>
                }
            />
            <Route
                path="/payment-history"
                element={
                    <PrivateRoute
                        allowedRoles={[
                            ROLES.SUPERADMIN,
                            ROLES.ADMIN,
                            ROLES.VIEWER,
                        ]}
                    >
                        <PaymentHistory />
                    </PrivateRoute>
                }
            />

            <Route
                path="/payment-history/:id"
                element={
                    <PrivateRoute
                        allowedRoles={[
                            ROLES.SUPERADMIN,
                            ROLES.ADMIN,
                            ROLES.VIEWER,
                        ]}
                    >
                        <PaymentList />
                    </PrivateRoute>
                }
            />
            <Route
                path="/reading-history"
                element={
                    <PrivateRoute
                        allowedRoles={[
                            ROLES.SUPERADMIN,
                            ROLES.ADMIN,
                            ROLES.VIEWER,
                        ]}
                    >
                        <ReadingHistory />
                    </PrivateRoute>
                }
            />
            <Route
                path="/reading-history/:id"
                element={
                    <PrivateRoute
                        allowedRoles={[
                            ROLES.SUPERADMIN,
                            ROLES.ADMIN,
                            ROLES.VIEWER,
                        ]}
                    >
                        <ReadingMonths />
                    </PrivateRoute>
                }
            />
            <Route
                path="/reading-history/:id/:year"
                element={
                    <PrivateRoute
                        allowedRoles={[
                            ROLES.SUPERADMIN,
                            ROLES.ADMIN,
                            ROLES.VIEWER,
                        ]}
                    >
                        <ReadingList />
                    </PrivateRoute>
                }
            />
            <Route
                path="/calendar"
                element={
                    <PrivateRoute
                        allowedRoles={[
                            ROLES.SUPERADMIN,
                            ROLES.ADMIN,
                            ROLES.VIEWER,
                        ]}
                    >
                        <Calendar />
                    </PrivateRoute>
                }
            />
            <Route
                path="/calendar/:month"
                element={
                    <PrivateRoute
                        allowedRoles={[
                            ROLES.SUPERADMIN,
                            ROLES.ADMIN,
                            ROLES.VIEWER,
                        ]}
                    >
                        <CalendarList />
                    </PrivateRoute>
                }
            />
            <Route
                path="/accounts"
                element={
                    <PrivateRoute
                        allowedRoles={[ROLES.SUPERADMIN, ROLES.ADMIN]}
                    >
                        <Accounts />
                    </PrivateRoute>
                }
            />
            <Route
                path="/accounts/new"
                element={
                    <PrivateRoute allowedRoles={[ROLES.SUPERADMIN]}>
                        <AddAccountForm />
                    </PrivateRoute>
                }
            />
            <Route
                path="/accounts/edit/:id"
                element={
                    <PrivateRoute allowedRoles={[ROLES.SUPERADMIN]}>
                        <EditAccountForm />
                    </PrivateRoute>
                }
            />

            <Route
                path="/units"
                element={
                    <PrivateRoute
                        allowedRoles={[
                            ROLES.SUPERADMIN,
                            ROLES.ADMIN,
                            ROLES.VIEWER,
                        ]}
                    >
                        <Units />
                    </PrivateRoute>
                }
            />
            <Route
                path="/units/new"
                element={
                    <PrivateRoute allowedRoles={[ROLES.SUPERADMIN]}>
                        <UnitAdd />
                    </PrivateRoute>
                }
            />
            <Route
                path="/units/edit/:id"
                element={
                    <PrivateRoute allowedRoles={[ROLES.SUPERADMIN]}>
                        <EditApartmentForm />
                    </PrivateRoute>
                }
            />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;
