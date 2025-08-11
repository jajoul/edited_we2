import { EgressInfo } from 'livekit-server-sdk';
import { RecordingInfo, RecordingOutputMode, RecordingStatus } from '../models/recording.model.js';
import { EgressStatus } from '@livekit/protocol';
import { DataTopic } from '../models/signal.model.js';
export declare class RecordingHelper {
    static toRecordingInfo(egressInfo: EgressInfo): RecordingInfo;
    /**
     * Checks if the egress is for recording.
     * @param egress - The egress information.
     * @returns A boolean indicating if the egress is for recording.
     */
    static isRecordingEgress(egress: EgressInfo): boolean;
    static extractOpenViduStatus(status: EgressStatus | undefined): RecordingStatus;
    static getDataTopicFromStatus(egressInfo: EgressInfo): DataTopic;
    /**
     * Extracts the OpenVidu output mode based on the provided egress information.
     * If the egress information contains roomComposite, it returns RecordingOutputMode.COMPOSED.
     * Otherwise, it returns RecordingOutputMode.INDIVIDUAL.
     *
     * @param egressInfo - The egress information containing the roomComposite flag.
     * @returns The extracted OpenVidu output mode.
     */
    static extractOutputMode(egressInfo: EgressInfo): RecordingOutputMode;
    static extractFilename(egressInfo: EgressInfo): string | undefined;
    static extractLocation(egressInfo: EgressInfo): string;
    static extractFileNameFromUrl(url: string | undefined): string | null;
    /**
     * Extracts the duration from the given egress information.
     * If the duration is not available, it returns 0.
     * @param egressInfo The egress information containing the file results.
     * @returns The duration in milliseconds.
     */
    static extractDuration(egressInfo: EgressInfo): number;
    /**
     * Extracts the endedAt value from the given EgressInfo object and converts it to milliseconds.
     * If the endedAt value is not provided, it defaults to 0.
     *
     * @param egressInfo - The EgressInfo object containing the endedAt value.
     * @returns The endedAt value converted to milliseconds.
     */
    static extractEndedAt(egressInfo: EgressInfo): number;
    /**
     * Extracts the creation timestamp from the given EgressInfo object.
     * If the startedAt property is not defined, it returns 0.
     * @param egressInfo The EgressInfo object from which to extract the creation timestamp.
     * @returns The creation timestamp in milliseconds.
     */
    static extractCreatedAt(egressInfo: EgressInfo): number;
    /**
     * Extracts the size from the given EgressInfo object.
     * If the size is not available, it returns 0.
     *
     * @param egressInfo - The EgressInfo object to extract the size from.
     * @returns The size extracted from the EgressInfo object, or 0 if not available.
     */
    static extractSize(egressInfo: EgressInfo): number;
    private static toSeconds;
    private static toMilliseconds;
}
//# sourceMappingURL=recording.helper.d.ts.map