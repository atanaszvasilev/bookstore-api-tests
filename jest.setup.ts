import { loadEnv } from './src/config/env';
import { deleteAllFilesInFolder } from './src/utils/fs.utils';
import { logger } from './src/utils/logger';

/**
 * Global setup for tests.
 * - Cleans up previous log files.
 * - Loads environment-specific configuration.
 * - Logs test execution start.
 */
export default async () => {
    // Remove previous logs
    deleteAllFilesInFolder('logs');

    // Load environment configuration
    loadEnv();

    // Log start of test execution
    logger.info('\n\n▶️ Starting test execution...\n');
};