import { AccessToken, EgressClient, RoomServiceClient } from 'livekit-server-sdk';
import { LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL, LIVEKIT_URL_PRIVATE } from '../config.js';
import { LoggerService } from './logger.service.js';
import { errorLivekitIsNotAvailable, errorParticipantAlreadyExists, internalError } from '../models/error.model.js';
export class LiveKitService {
    static instance;
    egressClient;
    roomClient;
    logger = LoggerService.getInstance();
    constructor() {
        const livekitUrlHostname = LIVEKIT_URL_PRIVATE.replace(/^ws:/, 'http:').replace(/^wss:/, 'https:');
        this.egressClient = new EgressClient(livekitUrlHostname, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
        this.roomClient = new RoomServiceClient(livekitUrlHostname, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
    }
    static getInstance() {
        if (!LiveKitService.instance) {
            LiveKitService.instance = new LiveKitService();
        }
        return LiveKitService.instance;
    }
    async generateToken(roomName, participantName) {
        try {
            if (await this.participantAlreadyExists(roomName, participantName)) {
                this.logger.error(`Participant ${participantName} already exists in room ${roomName}`);
                throw errorParticipantAlreadyExists(participantName, roomName);
            }
        }
        catch (error) {
            this.logger.error(`Error checking participant existence, ${JSON.stringify(error)}`);
            throw error;
        }
        this.logger.info(`Generating token for ${participantName} in room ${roomName}`);

		const participants = await this.roomClient.listParticipants(roomName);
		console.log("Participants: ", participants.length);

		
		if (participants.length){
			const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
				identity: participantName,
				name: participantName,
				metadata: JSON.stringify({
					livekitUrl: LIVEKIT_URL,
					roomAdmin: false
				})
			});

			const permissions = {
				room: roomName,
				roomCreate: false,
				roomJoin: true,
				roomList: false,
				roomRecord: false,
				roomAdmin: false,
				ingressAdmin: false,
				canPublish: true,
				canSubscribe: true,
				canPublishData: false,
				canUpdateOwnMetadata: false,
				hidden: true,
				recorder: false,
				agent: false
			};
			at.addGrant(permissions);
			return at.toJwt();
		}
		else{
			const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
				identity: participantName,
				name: participantName,
				metadata: JSON.stringify({
					livekitUrl: LIVEKIT_URL,
					roomAdmin: true
				})
			});

			const permissions = {
				room: roomName,
				roomCreate: true,
				roomJoin: true,
				roomList: true,
				roomRecord: true,
				roomAdmin: true,
				ingressAdmin: true,
				canPublish: true,
				canSubscribe: true,
				canPublishData: true,
				canUpdateOwnMetadata: false,
				hidden: false,
				recorder: true,
				agent: false
			};
			at.addGrant(permissions);
			return at.toJwt();
        }

        
    }
    async participantAlreadyExists(roomName, participantName) {
        try {
            const participants = await this.roomClient.listParticipants(roomName);
            return participants.some((participant) => participant.identity === participantName);
        }
        catch (error) {
            this.logger.error(error);
            if (error.cause.code === 'ECONNREFUSED') {
                throw errorLivekitIsNotAvailable();
            }
            return false;
        }
    }
    async startRoomComposite(roomName, output, options) {
        try {
            return await this.egressClient.startRoomCompositeEgress(roomName, output, options);
        }
        catch (error) {
            this.logger.error('Error starting Room Composite Egress');
            throw internalError(`Error starting Room Composite Egress: ${JSON.stringify(error)}`);
        }
    }
    async stopEgress(egressId) {
        try {
            this.logger.info(`Stopping ${egressId} egress`);
            return await this.egressClient.stopEgress(egressId);
        }
        catch (error) {
            this.logger.error(`Error stopping egress: JSON.stringify(error)`);
            throw internalError(`Error stopping egress: ${error}`);
        }
    }
    async getEgress(options) {
        try {
            return await this.egressClient.listEgress(options);
        }
        catch (error) {
            this.logger.error(`Error getting egress: ${JSON.stringify(error)}`);
            throw internalError(`Error getting egress: ${error}`);
        }
    }
    isEgressParticipant(participant) {
        return participant.identity.startsWith('EG_') && participant.permission?.recorder === true;
    }
}
//# sourceMappingURL=livekit.service.js.map