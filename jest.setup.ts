import { loadEnv } from './src/config/env';
import { deleteAllInFolder } from './src/utils/fs.utils';
import { logger } from './src/utils/logger';

declare global {
  var testPassed: boolean | false;
}

/**
 * Global setup for tests.
 * - Cleans up previous log files.
 * - Loads environment-specific configuration.
 * - Logs test execution start.
 */
export default async () => {
  // Remove previous logs
  deleteAllInFolder('logs');

  // Load environment configuration
  loadEnv();

  // Log start of test execution
  logger.info('\n\n▶️ Starting test execution...\n');
};