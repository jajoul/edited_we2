import { BroadcastingStatus } from '../models/broadcasting.model.js';
import { EgressStatus } from '@livekit/protocol';
import { DataTopic } from '../models/signal.model.js';
export class BroadcastingHelper {
    static toBroadcastingInfo(egressInfo) {
        const status = BroadcastingHelper.extractOpenViduStatus(egressInfo.status);
        // const platform = this.extractPlatform(egressInfo);
        const duration = BroadcastingHelper.extractDuration(egressInfo);
        const startedAt = BroadcastingHelper.extractCreatedAt(egressInfo);
        const endTimeInMilliseconds = BroadcastingHelper.extractEndedAt(egressInfo);
        return {
            id: egressInfo.egressId,
            status,
            startedAt,
            endedAt: endTimeInMilliseconds,
            duration
            // platform
        };
    }
    static extractOpenViduStatus(status) {
        switch (status) {
            case EgressStatus.EGRESS_STARTING:
                return BroadcastingStatus.STARTING;
            case EgressStatus.EGRESS_ACTIVE:
                return BroadcastingStatus.STARTED;
            case EgressStatus.EGRESS_ENDING:
                return BroadcastingStatus.STOPPED;
            // case EgressStatus.EGRESS_COMPLETE:
            // 	return BroadcastingStatus.READY;
            case EgressStatus.EGRESS_FAILED:
            case EgressStatus.EGRESS_ABORTED:
            case EgressStatus.EGRESS_LIMIT_REACHED:
                return BroadcastingStatus.FAILED;
            default:
                return BroadcastingStatus.FAILED;
        }
    }
    /**
     * Checks if the given egress information represents a broadcasting egress.
     * @param egress - The egress information to check.
     * @returns A boolean indicating whether the egress is for broadcasting or not.
     */
    static isBroadcastingEgress(egress) {
        const { streamResults = [], fileResults = [] } = egress;
        return (fileResults.length === 0 &&
            streamResults.length > 0 &&
            streamResults.some((streamResult) => streamResult?.url?.includes('rtmp')));
    }
    static getDataTopicFromStatus(egressInfo) {
        const status = BroadcastingHelper.extractOpenViduStatus(egressInfo.status);
        switch (status) {
            case BroadcastingStatus.STARTING:
                return DataTopic.BROADCASTING_STARTING;
            case BroadcastingStatus.STARTED:
                return DataTopic.BROADCASTING_STARTED;
            case BroadcastingStatus.STOPPED:
                return DataTopic.BROADCASTING_STOPPED;
            case BroadcastingStatus.FAILED:
                return DataTopic.BROADCASTING_FAILED;
            default:
                return DataTopic.BROADCASTING_FAILED;
        }
    }
    static extractFilename(egressInfo) {
        return egressInfo.fileResults?.[0]?.filename.split('/').pop();
    }
    /**
     * Extracts the duration from the given egress information.
     * If the duration is not available, it returns 0.
     * @param egressInfo The egress information containing the file results.
     * @returns The duration in milliseconds.
     */
    static extractDuration(egressInfo) {
        return this.toSeconds(Number(egressInfo.fileResults?.[0]?.duration ?? 0));
    }
    /**
     * Extracts the endedAt value from the given EgressInfo object and converts it to milliseconds.
     * If the endedAt value is not provided, it defaults to 0.
     *
     * @param egressInfo - The EgressInfo object containing the endedAt value.
     * @returns The endedAt value converted to milliseconds.
     */
    static extractEndedAt(egressInfo) {
        return this.toMilliseconds(Number(egressInfo.endedAt ?? 0));
    }
    /**
     * Extracts the creation timestamp from the given EgressInfo object.
     * If the startedAt property is not defined, it returns 0.
     * @param egressInfo The EgressInfo object from which to extract the creation timestamp.
     * @returns The creation timestamp in milliseconds.
     */
    static extractCreatedAt(egressInfo) {
        const { startedAt, updatedAt } = egressInfo;
        const createdAt = startedAt && Number(startedAt) !== 0 ? startedAt : updatedAt ?? 0;
        return this.toMilliseconds(Number(createdAt));
    }
    /**
     * Extracts the size from the given EgressInfo object.
     * If the size is not available, it returns 0.
     *
     * @param egressInfo - The EgressInfo object to extract the size from.
     * @returns The size extracted from the EgressInfo object, or 0 if not available.
     */
    static extractSize(egressInfo) {
        return Number(egressInfo.fileResults?.[0]?.size ?? 0);
    }
    static toSeconds(nanoseconds) {
        const nanosecondsToSeconds = 1 / 1_000_000_000;
        return nanoseconds * nanosecondsToSeconds;
    }
    static toMilliseconds(nanoseconds) {
        const nanosecondsToMilliseconds = 1 / 1_000_000;
        return nanoseconds * nanosecondsToMilliseconds;
    }
}
//# sourceMappingURL=broadcasting.helper.js.map