/// <reference types="qs" />
import { Request, Response, NextFunction } from 'express';
export declare const withAdminAndUserBasicAuth: (req: Request, res: Response, next: NextFunction) => void;
export declare const withAdminBasicAuth: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const withUserBasicAuth: (req: Request, res: Response, next: NextFunction) => void;
export declare class AuthService {
    protected static instance: AuthService;
    private constructor();
    static getInstance(): AuthService;
    authenticateUser(username: string, password: string): boolean;
    authenticateAdmin(username: string, password: string): boolean;
}
//# sourceMappingURL=auth.service.d.ts.map