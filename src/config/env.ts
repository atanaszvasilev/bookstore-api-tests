import dotenv from "dotenv";
import fs from 'fs';
import path from "path";
import { fileLogger, logger } from '../utils/logger';

/**
 * Load environment variables from the corresponding `.env` file
 * based on the `ENV` variable or default to "stage".
 * Logs active environment and environment properties to the file logger.
 */
export function loadEnv() {
    const env = process.env.ENV || "stage";
    const envFile = path.resolve(process.cwd(), `.env.${env}`);

    // Ensure the .env file exists
    if (!fs.existsSync(envFile)) {
        throw new Error(`Failed to load ".env" file: ${envFile} does not exist`);
    }

    // Load environment variables quietly
    dotenv.config({ path: envFile, quiet: true });

    // Log active environment to console logger
    logger.info(`🌐 Active environment: ${env.toUpperCase()}`);

    // Read .env file content, filter comments and empty lines
    const envContent = fs.readFileSync(envFile, "utf-8")
        .split("\n")
        .filter(line => line.trim() !== "" && !line.trim().startsWith("#"))
        .join("\n");

    // Log environment properties to file logger with a preceding newline for clarity
    fileLogger.debug(`\nEnvironment properties:\n${envContent}\n`);
}