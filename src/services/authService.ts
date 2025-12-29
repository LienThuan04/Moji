import api from "@/lib/axios";

export const authService = {

    signUp: async (username: string, email: string, password: string, displayName: string) => {
        const response = await api.post("/auth/signup", { email, password, username, displayName }, {withCredentials: true /* Ensure cookies are included */});
        return response.data;
    },

    signIn: async (username: string, password: string) => {
        const response = await api.post("/auth/signin", { username, password } , {withCredentials: true /* Ensure cookies are included */});
        return response.data;
    },

    fetchAccountInfo: async () => {
        const response = await api.get("/auth/account", {withCredentials: true /* Ensure cookies are included */});
        return response.data;
    },

    signOut: async () => {
        const response = await api.post("/auth/signout", {}, {withCredentials: true /* Ensure cookies are included */});
        return response.data;
    },

    refreshToken: async () => {
        const response = await api.post("/auth/refresh-token", {}, {withCredentials: true /* Ensure cookies are included */});
        return response.data;
    }

};