import api from "./axios";

export const apartmentApi = {
    // Get all apartment units
    getUnits: async () => {
        try {
            const response = await api.get("/units");
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getUnit: async (id) => {
        try {
            const response = await api.get(`/units/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create new apartment unit
    createUnit: async (unitData) => {
        try {
            const response = await api.post("/units", unitData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update apartment unit
    updateUnit: async (id, unitData) => {
        try {
            const response = await api.put(`/units/${id}`, unitData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete apartment unit
    deleteUnit: async (id) => {
        try {
            const response = await api.delete(`/units/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
