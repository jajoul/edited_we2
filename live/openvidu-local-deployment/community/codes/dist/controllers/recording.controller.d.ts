import { Request, Response } from 'express';
export declare const startRecording: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const stopRecording: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Endpoint only available for the admin user
 */
export declare const getAllRecordings: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const streamRecording: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteRecording: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=recording.controller.d.ts.map