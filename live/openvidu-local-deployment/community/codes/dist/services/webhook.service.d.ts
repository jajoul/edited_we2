import { EgressInfo, ParticipantInfo, Room, WebhookEvent } from 'livekit-server-sdk';
export declare class WebhookService {
    private static instance;
    private livekitService;
    private s3Service;
    private roomService;
    private recordingService;
    private broadcastingService;
    private logger;
    private webhookReceiver;
    private constructor();
    static getInstance(): WebhookService;
    /**
     * Retrieves a WebhookEvent from the provided request body and authentication token.
     * @param body - The request body containing the webhook data.
     * @param auth - The authentication token for verifying the webhook request.
     * @returns The WebhookEvent extracted from the request body.
     */
    getEventFromWebhook(body: string, auth?: string): Promise<WebhookEvent>;
    handleEgressUpdated(egressInfo: EgressInfo): Promise<void>;
    /**
     * Handles the 'egress_ended' event by processing recording-related information, updating the recordings list,
     * and sending the appropriate data payload to indicate the end of a recording or broadcasting session.
     *
     * @param egressInfo - Information related to the egress event.
     */
    handleEgressEnded(egressInfo: EgressInfo): Promise<void>;
    /**
     *
     * Handles the 'participant_joined' event by gathering relevant room and participant information,
     * checking room status, and sending a data payload with room status information to the newly joined participant.
     * @param room - Information about the room where the participant joined.
     * @param participant - Information about the newly joined participant.
     */
    handleParticipantJoined(room: Room, participant: ParticipantInfo): Promise<void>;
    private sendStatusSignal;
}
//# sourceMappingURL=webhook.service.d.ts.map