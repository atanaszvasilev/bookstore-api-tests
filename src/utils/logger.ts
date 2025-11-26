import log4js, { Logger } from 'log4js';
let logger: Logger;
let fileLogger: Logger;

/**
 * Default Log4js configuration.
 * 
 * - `out`: logs to the console (stdout) with a pattern layout.
 * - `completeLogFile`: logs to `logs/logs.log` with a pattern layout.
 * - Default log level is `info`; `fileLogger` uses `trace` level.
 */
const defaultConfig = {
    appenders: {
        out: {
            type: 'stdout',
            layout: {
                type: 'pattern',
                pattern: `%[[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p]%] %m`
            }
        },
        completeLogFile: {
            type: 'file',
            filename: 'logs/logs.log',
            layout: {
                type: 'pattern',
                pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] %m'
            }
        }
    },
    categories: {
        default: { appenders: ['out', 'completeLogFile'], level: 'info' },
        fileLogger: { appenders: ['completeLogFile'], level: 'trace' }
    }
};

// Initial configuration
log4js.configure(defaultConfig);

// Create logger instances
logger = log4js.getLogger();
fileLogger = log4js.getLogger('fileLogger');

/**
 * Configures Log4js with an additional per-test log file.
 * 
 * @param testLogPath - File path for the temporary per-test log
 */
function configureLogger(testLogPath: string) {
    const configWithTestFile = {
        ...defaultConfig,
        appenders: {
            ...defaultConfig.appenders,
            testLogFile: {
                type: 'file',
                filename: testLogPath,
                layout: {
                    type: 'pattern',
                    pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] %m'
                }
            }
        },
        categories: {
            default: { appenders: ['out', 'completeLogFile', 'testLogFile'], level: 'info' },
            fileLogger: { appenders: ['completeLogFile', 'testLogFile'], level: 'trace' }
        }
    };

    log4js.configure(configWithTestFile);
    logger = log4js.getLogger();
    fileLogger = log4js.getLogger('fileLogger');
}

/**
 * Flush all loggers and wait until all pending writes are completed.
 * Useful to ensure all log messages are written before reading or deleting files.
 * 
 * @returns Promise that resolves when loggers are flushed
 */
function flushLogger(): Promise<void> {
    return new Promise((resolve, reject) => {
        log4js.shutdown(err => (err ? reject(err) : resolve()));
    });
}

export { configureLogger, fileLogger, flushLogger, logger };