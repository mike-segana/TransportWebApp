//central place for backend api calls
import axios from "axios";
//creates custom instance of axios called api ensures every request auto prefixed with backend url
export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, //include auth cookies (HttpOnly JWT) in API requests
});
