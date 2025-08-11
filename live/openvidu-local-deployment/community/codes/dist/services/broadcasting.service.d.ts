import { BroadcastingInfo } from '../models/broadcasting.model.js';
export declare class BroadcastingService {
    protected static instance: BroadcastingService;
    private livekitService;
    private roomService;
    private logger;
    static getInstance(): BroadcastingService;
    startBroadcasting(roomName: string, broadcastUrl: string): Promise<BroadcastingInfo>;
    stopBroadcasting(egressId: string): Promise<BroadcastingInfo>;
    private generateCompositeOptionsFromRequest;
    private generateFileOutputFromRequest;
    getAllBroadcastingsByRoom(roomName: string, roomId: string): Promise<BroadcastingInfo[]>;
}
//# sourceMappingURL=broadcasting.service.d.ts.map