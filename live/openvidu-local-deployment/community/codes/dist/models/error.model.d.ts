type StatusError = 400 | 404 | 406 | 409 | 422 | 500 | 501;
export declare class OpenViduCallError extends Error {
    name: string;
    statusCode: StatusError;
    constructor(error: string, message: string, statusCode: StatusError);
}
export declare const errorLivekitIsNotAvailable: () => OpenViduCallError;
export declare const internalError: (error: any) => OpenViduCallError;
export declare const errorRequest: (error: string) => OpenViduCallError;
export declare const errorUnprocessableParams: (error: string) => OpenViduCallError;
export declare const errorRecordingNotFound: (recordingId: string) => OpenViduCallError;
export declare const errorRecordingNotStopped: (recordingId: string) => OpenViduCallError;
export declare const errorRecordingNotReady: (recordingId: string) => OpenViduCallError;
export declare const errorRecordingAlreadyStopped: (recordingId: string) => OpenViduCallError;
export declare const errorRecordingAlreadyStarted: (roomName: string) => OpenViduCallError;
export declare const errorSessionWithoutParticipants: (roomName: string) => OpenViduCallError;
export declare const errorBroadcastingAlreadyStarted: (roomName: string) => OpenViduCallError;
export declare const errorBroadcastingNotStarted: (roomName: string) => OpenViduCallError;
export declare const errorRoomNotFound: (roomName: string) => OpenViduCallError;
export declare const errorParticipantAlreadyExists: (participantName: string, roomName: string) => OpenViduCallError;
export {};
//# sourceMappingURL=error.model.d.ts.map