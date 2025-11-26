import { allure } from 'jest-allure2-reporter/api';
import { createFile, deleteFile, readFile } from './src/utils/fs.utils';
import { configureLogger, fileLogger, flushLogger, logger } from './src/utils/logger';
import { sanitizeFileName } from './src/utils/test.utils';

let suiteName: string | undefined;
let previousSuiteName: string | undefined;
let testName: string | undefined;
let tmpTestLogs: string | undefined;

/**
 * Runs before each test.
 * 
 * 1️⃣ Extracts the current test suite and test name from Jest state.
 * 2️⃣ Builds a temporary log file path for the test (in `logs/tmp/<suite>/<test>.log`).
 * 3️⃣ Configures the logger to include the per-test log file.
 * 4️⃣ Logs the test suite start (only once per suite).
 * 5️⃣ Logs the test start.
 * 6️⃣ Creates the test log file on disk.
 */
beforeEach(() => {
    const fullTestName = expect.getState().currentTestName!;
    const [rawSuite, rawTest] = fullTestName.split(':');

    suiteName = rawSuite.trim();
    testName = rawTest.trim();

    tmpTestLogs = `logs/tmp/${sanitizeFileName(suiteName)}/${sanitizeFileName(testName)}.log`;
    configureLogger(tmpTestLogs);

    if (suiteName !== previousSuiteName) {
        logger.info(`🧪 Test suite: ${suiteName}`);
        previousSuiteName = suiteName;
    }

    fileLogger.info(`➡️ Running test: ${testName}`);

    createFile(tmpTestLogs);
});

/**
 * Runs after each test.
 * 
 * 1️⃣ Flushes all pending log entries to ensure the log file is complete.
 * 2️⃣ If the test passed:
 *    - Logs test success.
 *    - Deletes the temporary test log file and logs deletion.
 * 3️⃣ If the test failed:
 *    - Logs test failure.
 *    - Attaches the test log to Allure.
 *    - Logs a warning after attaching.
 * 4️⃣ Flushes all remaining log entries to ensure correct order.
 */
afterEach(async () => {
    if (!tmpTestLogs) return;

    if (testPassed) {
        fileLogger.info('✅ Test PASSED');

        deleteFile(tmpTestLogs);
    } else {
        fileLogger.error('❌ Test FAILED');

        await flushLogger();

        const testLogFile = readFile(tmpTestLogs);

        await allure.attachment('📝 Test log', testLogFile!, 'text/plain');
    }
    await flushLogger();
});