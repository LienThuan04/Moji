import api from "@/lib/axios";

export const authService = {

    signUp: async (username: string, email: string, password: string, displayname: string) => {
        const response = await api.post("/auth/signup", { email, password, username, displayname }, {withCredentials: true /* Ensure cookies are included */});
        return response.data;
    },

    signIn: async (username: string, password: string) => {
        const response = await api.post("/auth/signin", { username, password } , {withCredentials: true /* Ensure cookies are included */});
        return response.data;
    },

    logout: async () => {
        const response = await api.post("/auth/logout", {}, {withCredentials: true /* Ensure cookies are included */});
        return response.data;
    },

};