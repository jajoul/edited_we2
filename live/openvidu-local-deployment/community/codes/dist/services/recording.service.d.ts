/// <reference types="node" resolution-mode="require"/>
import { Readable } from 'stream';
import { RecordingInfo } from '../models/recording.model.js';
export declare class RecordingService {
    protected static instance: RecordingService;
    private livekitService;
    private roomService;
    private s3Service;
    private logger;
    static getInstance(): RecordingService;
    startRecording(roomName: string): Promise<RecordingInfo>;
    stopRecording(egressId: string): Promise<RecordingInfo>;
    deleteRecording(egressId: string, isRequestedByAdmin: boolean): Promise<RecordingInfo>;
    /**
     * Retrieves the list of recordings.
     * @returns A promise that resolves to an array of RecordingInfo objects.
     */
    getAllRecordings(continuationToken?: string): Promise<{
        recordingInfo: RecordingInfo[];
        continuationToken?: string;
    }>;
    /**
     * Retrieves all recordings for a given room.
     *
     * @param roomName - The name of the room.
     * @param roomId - The ID of the room.
     * @returns A promise that resolves to an array of RecordingInfo objects.
     * @throws If there is an error retrieving the recordings.
     */
    getAllRecordingsByRoom(roomName: string, roomId: string): Promise<RecordingInfo[]>;
    private getRecording;
    getRecordingAsStream(recordingId: string, range?: string): Promise<{
        fileSize: number | undefined;
        fileStream: Readable;
        start?: number;
        end?: number;
    }>;
    private generateCompositeOptionsFromRequest;
    /**
     * Generates a file output object based on the provided room name and file name.
     * @param recordingId - The recording id.
     * @param fileName - The name of the file (default is 'recording').
     * @returns The generated file output object.
     */
    private generateFileOutputFromRequest;
    private sanitizeRegExp;
}
//# sourceMappingURL=recording.service.d.ts.map