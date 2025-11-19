import log4js from 'log4js';

/**
 * Configures and exports a logger instance using Log4js.
 * 
 * This module configures the Log4js logger with two appenders:
 * 1. One for logging to the console (stdout).
 * 2. Another for logging to a file (`logs/logs.log`).
 * 
 * The default log level is set to `debug`, meaning it will log all messages of level `debug` or higher.
 * 
 * The configured logger instance is exported for use in other parts of the application.
 * 
 * @module logger
 */
log4js.configure({
    appenders: {
        out: {
            type: 'stdout',
            layout: {
                type: 'pattern',
                pattern: `%[[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p]%] %m`,
            }
        },
        file: {
            type: 'file',
            filename: 'logs/logs.log',
            layout: {
                type: 'pattern',
                pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] %m',
            }
        }
    },
    categories: {
        default: { appenders: ['out', 'file'], level: 'info' },
        fileLogger: { appenders: ['file'], level: 'trace' }
    },
});

// Create and export the logger instance
const logger = log4js.getLogger();
const fileLogger = log4js.getLogger('fileLogger');

// Export the logger instance for use in other parts of the application
export { fileLogger, logger };
