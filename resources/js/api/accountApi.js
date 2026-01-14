import axios from "axios";
import api from "./axios";

export const accountApi = {
    // Create New Account
    createAccount: async (accountData) => {
        try {
            const response = await api.post("/accounts", accountData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get all accounts
    getAccounts: async () => {
        try {
            const response = await api.get("/accounts");
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAccount: async (id) => {
        try {
            const response = await api.get(`/accounts/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update account
    updateAccount: async (id, accountData) => {
        try {
            const response = await api.put(`/accounts/${id}`, accountData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete account
    deleteAccount: async (id) => {
        try {
            const response = await api.delete(`/accounts/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Check username availability
    checkUsernameAvailability: async (username) => {
        try {
            const response = await api.get(
                `/accounts/check-username/${username}`
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
