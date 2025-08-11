import { EgressInfo } from 'livekit-server-sdk';
import { BroadcastingInfo, BroadcastingStatus } from '../models/broadcasting.model.js';
import { EgressStatus } from '@livekit/protocol';
import { DataTopic } from '../models/signal.model.js';
export declare class BroadcastingHelper {
    static toBroadcastingInfo(egressInfo: EgressInfo): BroadcastingInfo;
    static extractOpenViduStatus(status: EgressStatus | undefined): BroadcastingStatus;
    /**
     * Checks if the given egress information represents a broadcasting egress.
     * @param egress - The egress information to check.
     * @returns A boolean indicating whether the egress is for broadcasting or not.
     */
    static isBroadcastingEgress(egress: EgressInfo): boolean;
    static getDataTopicFromStatus(egressInfo: EgressInfo): DataTopic;
    static extractFilename(egressInfo: EgressInfo): string | undefined;
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
//# sourceMappingURL=broadcasting.helper.d.ts.map