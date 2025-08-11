import { StreamOutput, StreamProtocol } from 'livekit-server-sdk';
import { LiveKitService } from './livekit.service.js';
import { LoggerService } from './logger.service.js';
import { BroadcastingHelper } from '../helpers/broadcasting.helper.js';
import { DataTopic } from '../models/signal.model.js';
import { RoomService } from './room.service.js';
export class BroadcastingService {
    static instance;
    livekitService = LiveKitService.getInstance();
    roomService = RoomService.getInstance();
    logger = LoggerService.getInstance();
    static getInstance() {
        if (!BroadcastingService.instance) {
            BroadcastingService.instance = new BroadcastingService();
        }
        return BroadcastingService.instance;
    }
    async startBroadcasting(roomName, broadcastUrl) {
        try {
            const options = this.generateCompositeOptionsFromRequest();
            const output = this.generateFileOutputFromRequest(broadcastUrl);
            const egressInfo = await this.livekitService.startRoomComposite(roomName, output, options);
            return BroadcastingHelper.toBroadcastingInfo(egressInfo);
        }
        catch (error) {
            this.logger.error(`Error starting recording in room ${roomName}: ${error}`);
            const options = {
                destinationSids: [],
                topic: DataTopic.BROADCASTING_FAILED
            };
            this.roomService.sendSignal(roomName, {}, options);
            throw error;
        }
    }
    async stopBroadcasting(egressId) {
        try {
            const egressInfo = await this.livekitService.stopEgress(egressId);
            return BroadcastingHelper.toBroadcastingInfo(egressInfo);
        }
        catch (error) {
            this.logger.error(`Error stopping broadcasting ${egressId}: ${error}`);
            throw error;
        }
    }
    generateCompositeOptionsFromRequest(layout = 'speaker') {
        return {
            layout: layout
            // customBaseUrl: customLayout,
            // audioOnly: false,
            // videoOnly: false
        };
    }
    generateFileOutputFromRequest(url) {
        return new StreamOutput({
            protocol: StreamProtocol.RTMP,
            urls: [url]
        });
    }
    async getAllBroadcastingsByRoom(roomName, roomId) {
        try {
            const options = {
                roomName
            };
            const allEgress = await this.livekitService.getEgress(options);
            const broadcastingInfo = allEgress
                .filter((egress) => BroadcastingHelper.isBroadcastingEgress(egress) && egress.roomId === roomId)
                .map(BroadcastingHelper.toBroadcastingInfo);
            return broadcastingInfo;
        }
        catch (error) {
            this.logger.error(`Error getting recordings: ${error}`);
            throw error;
        }
    }
}
//# sourceMappingURL=broadcasting.service.js.map