//central place for backend api calls
import axios from "axios";
//creates custom version of axios called api ensures every request auto prefixed with backend url
export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});
//middleware for requests -  runs every time API call is made using api
//checks browser storage for saved jwt login token and attaches to http header if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});