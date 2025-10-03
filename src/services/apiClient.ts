import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import config from "../configs/config"

export const apiClient = axios.create({
    baseURL: `${config.publicAPI}`,
    withCredentials: true,
    timeout: 10000,
});

apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        config.headers.set("Accept-Version", "1.0");
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);
