import { EgressInfo, EncodedFileOutput, ListEgressOptions, ParticipantInfo, RoomCompositeOptions, StreamOutput } from 'livekit-server-sdk';
export declare class LiveKitService {
    protected static instance: LiveKitService;
    private egressClient;
    private roomClient;
    private logger;
    private constructor();
    static getInstance(): LiveKitService;
    generateToken(roomName: string, participantName: string): Promise<string>;
    private participantAlreadyExists;
    startRoomComposite(roomName: string, output: EncodedFileOutput | StreamOutput, options: RoomCompositeOptions): Promise<EgressInfo>;
    stopEgress(egressId: string): Promise<EgressInfo>;
    getEgress(options: ListEgressOptions): Promise<EgressInfo[]>;
    isEgressParticipant(participant: ParticipantInfo): boolean;
}
//# sourceMappingURL=livekit.service.d.ts.map