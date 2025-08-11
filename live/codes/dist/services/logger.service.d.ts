import winston from 'winston';
export declare class LoggerService {
    private static instance;
    readonly logger: winston.Logger;
    private constructor();
    static getInstance(): LoggerService;
    log(level: string, message: string): void;
    error(message: string): void;
    warn(message: string): void;
    info(message: string): void;
    verbose(message: string): void;
    debug(message: string): void;
    silly(message: string): void;
}
//# sourceMappingURL=logger.service.d.ts.map