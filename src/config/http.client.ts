import axios from "axios";
import { fileLogger } from "../utils/logger";

/**
 * Axios HTTP client configured with base URL and timeout from environment variables.
 * Includes request and response interceptors for logging full request/response details.
 */
const baseURL = process.env.BASE_URL;
if (!baseURL) {
    fileLogger.error("❌ BASE_URL is not defined in environment variables");
    throw new Error("BASE_URL is missing");
}

export const httpClient = axios.create({
    baseURL,
    timeout: Number(process.env.TIMEOUT) || 10000,
    validateStatus: (status) => status < 400, // Reject promise for 4xx/5xx
});

// Request logging interceptor
httpClient.interceptors.request.use(
    (config) => {
        fileLogger.trace(`\n➡️ [Request] ${config.method?.toUpperCase()} ${config.url}`);
        if (config.data) {
            fileLogger.trace(`   Request Body: ${JSON.stringify(config.data, null, 2)}`);
        }
        return config;
    },
    (error) => {
        fileLogger.error(`❌ [Request Error] ${error}`);
        return Promise.reject(error);
    }
);

// Response logging interceptor
httpClient.interceptors.response.use(
    (response) => {
        fileLogger.trace(`✅ [Response] ${response.status} ${response.config.url}`);
        fileLogger.trace(`   Response Body: ${JSON.stringify(response.data, null, 2)}`);
        return response;
    },
    (error) => {
        if (error.response) {
            fileLogger.error(`❌ [Response Error] ${error.response.status} ${error.config.url}`);
            fileLogger.error(`   Response Body: ${JSON.stringify(error.response.data, null, 2)}`);
        } else {
            fileLogger.error(`❌ [Response Error] ${error.message}`);
        }
        return Promise.reject(error);
    }
);