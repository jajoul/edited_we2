import { LoggerService } from '../services/logger.service.js';
import { WebhookService } from '../services/webhook.service.js';
import { RoomService } from '../services/room.service.js';
import { DJANGO_WEBHOOK_URL, DJANGO_WEBHOOK_URL_START } from '../config.js';

const webhookService = WebhookService.getInstance();
const roomService = RoomService.getInstance();
const logger = LoggerService.getInstance();

export const webhookHandler = async (req, res) => {
    try {
        const webhookEvent = await webhookService.getEventFromWebhook(req.body, req.get('Authorization'));
        const { event: eventType, egressInfo, room, participant } = webhookEvent;
        const roomOrRoomName = getRoomOrRoomName(webhookEvent);
        let isRoomCreatedByMe = false;
        if (roomOrRoomName) {
            isRoomCreatedByMe = roomOrRoomName ? await roomService.isRoomCreatedByMe(roomOrRoomName) : false;
        }

        // Skip webhook events that are not related to OpenVidu Call only if there is a room or room name
        // and the room was not created by me
        if (roomOrRoomName && !isRoomCreatedByMe) {
            logger.verbose(`Skipping webhook, event is not related to OpenVidu Call: ${eventType}`);
            return res.status(200).send();
        }
        logger.verbose(`Received webhook event: ${eventType}`);
        switch (eventType) {
            case 'egress_started':
            case 'egress_updated':
                await webhookService.handleEgressUpdated(egressInfo);
                break;
            case 'egress_ended':
                await webhookService.handleEgressEnded(egressInfo);
                break;
            case 'participant_joined':
                await webhookService.handleParticipantJoined(room, participant);
                break;
            case 'room_started':
                // Send HTTP request to http://example.com/room-finished
                fetch(DJANGO_WEBHOOK_URL_START, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "room_id": room.name
                    }),
                })
                .then(response => {
                    if (response.ok) {
                        console.log('Successfully sent room_started request.');
                    } else {
                        console.error(`Failed to send room_started request. Status code: ${response.status}`);
                    }
                })
                .catch(error => {
                    console.error(`Error sending room_finished request: ${error}`);
                });

                break;
            case 'room_finished':
                // Send HTTP request to http://example.com/room-finished
                fetch(DJANGO_WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "room_id": room.name
                    }),
                })
                .then(response => {
                    if (response.ok) {
                        console.log('Successfully sent room_finished request.');
                    } else {
                        console.error(`Failed to send room_finished request. Status code: ${response.status}`);
                    }
                })
                .catch(error => {
                    console.error(`Error sending room_finished request: ${error}`);
                });

                break;
            default:
                break;
        }
    } catch (error) {
        logger.error(`Error handling webhook event: ${error}`);
    }
    return res.status(200).send();
};

function getRoomOrRoomName(webhookEvent) {
    const { room, egressInfo, ingressInfo } = webhookEvent;
    // KNOWN issue: room metadata is empty when track_publish and track_unpublish events are received
    // This not affect OpenVidu Call, but it is a limitation of the LiveKit server
    return room ?? egressInfo?.roomName ?? ingressInfo?.roomName ?? '';
}
