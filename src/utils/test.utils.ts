/**
 * Sanitizes a string for safe use as a file name.
 *
 * Converts spaces to underscores, removes special characters
 * except alphanumeric, underscores, and dashes, and lowercases the result.
 *
 * @param name - The input string to sanitize
 * @returns A safe, formatted file name string
 */
export function sanitizeFileName(name: string): string {
    return name
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_-]/g, '')
        .toLowerCase();
}

/**
 * Wraps a test function to automatically track its pass/fail status.
 *
 * This utility sets a global `testPassed` variable to `true` before running the test,
 * and sets it to `false` if the test throws an error. The error is then re-thrown
 * to ensure Jest still marks the test as failed.
 *
 * Works for both synchronous and asynchronous test functions.
 *
 * @param fn - The test function to wrap (sync or async)
 * @returns An async function that tracks the test status
 */
export function trackTestStatus(fn: () => Promise<void> | void) {
    return async () => {
        testPassed = true;
        try {
            await fn();
        } catch (err) {
            testPassed = false;
            throw err;
        }
    };
}