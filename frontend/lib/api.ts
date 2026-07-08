//central place for backend api calls
import axios from "axios";
//creates custom instance of axios called api
export const api = axios.create({
    baseURL: "", //empty baseURL ensures requests are routed through next js api proxy endpoints
    withCredentials: true, //include auth cookies (HttpOnly JWT) in API requests
});
