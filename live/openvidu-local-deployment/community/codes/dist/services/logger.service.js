import winston from 'winston';
import { LOG_LEVEL } from '../config.js';
export class LoggerService {
    static instance;
    logger;
    constructor() {
        this.logger = winston.createLogger({
            level: LOG_LEVEL,
            format: winston.format.combine(winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }), winston.format.printf((info) => {
                return `${info.timestamp} [${info.level}] ${info.message}`;
            }), winston.format.errors({ stack: true }))
        });
        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(new winston.transports.Console({
                format: winston.format.combine(winston.format.colorize(), winston.format.printf((info) => {
                    return `${info.timestamp} [${info.level}] ${info.message}`;
                }))
            }));
        }
    }
    static getInstance() {
        if (!LoggerService.instance) {
            LoggerService.instance = new LoggerService();
        }
        return LoggerService.instance;
    }
    // Generic method to log messages with a specific level
    log(level, message) {
        this.logger.log(level, message);
    }
    // Logs a message as an error
    error(message) {
        this.log('error', message);
    }
    // Logs a message as a warning
    warn(message) {
        this.log('warn', message);
    }
    // Logs a message as general information
    info(message) {
        this.log('info', message);
    }
    // Logs a message as verbose
    verbose(message) {
        this.log('verbose', message);
    }
    // Logs a message for debugging purposes
    debug(message) {
        this.log('debug', message);
    }
    // Logs a message as trivial information
    silly(message) {
        this.log('silly', message);
    }
}
//# sourceMappingURL=logger.service.js.map