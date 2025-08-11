export class OpenViduCallError extends Error {
    name;
    statusCode;
    constructor(error, message, statusCode) {
        super(message);
        this.name = error;
        this.statusCode = statusCode;
    }
}
// General errors
export const errorLivekitIsNotAvailable = () => {
    return new OpenViduCallError('LiveKit Error', 'LiveKit is not available', 500);
};
export const internalError = (error) => {
    return new OpenViduCallError('Unexpected error', `Something went wrong ${error}`, 500);
};
export const errorRequest = (error) => {
    return new OpenViduCallError('Wrong request', `Problem with some body parameter. ${error}`, 400);
};
export const errorUnprocessableParams = (error) => {
    return new OpenViduCallError('Wrong request', `Some parameters are not valid. ${error}`, 422);
};
// Recording errors
export const errorRecordingNotFound = (recordingId) => {
    return new OpenViduCallError('Recording Error', `Recording ${recordingId} not found`, 404);
};
export const errorRecordingNotStopped = (recordingId) => {
    return new OpenViduCallError('Recording Error', `Recording ${recordingId} is not stopped yet`, 409);
};
export const errorRecordingNotReady = (recordingId) => {
    return new OpenViduCallError('Recording Error', `Recording ${recordingId} is not ready yet`, 409);
};
export const errorRecordingAlreadyStopped = (recordingId) => {
    return new OpenViduCallError('Recording Error', `Recording ${recordingId} is already stopped`, 409);
};
export const errorRecordingAlreadyStarted = (roomName) => {
    return new OpenViduCallError('Recording Error', `The room '${roomName}' is already being recorded`, 409);
};
// Broadcasting errors
export const errorSessionWithoutParticipants = (roomName) => {
    return new OpenViduCallError('Broadcasting Error', `The room '${roomName}' do not have participants`, 406);
};
export const errorBroadcastingAlreadyStarted = (roomName) => {
    return new OpenViduCallError('Broadcasting Error', `The room '${roomName}' is already being broadcasted`, 409);
};
export const errorBroadcastingNotStarted = (roomName) => {
    return new OpenViduCallError('Broadcasting Error', `The room '${roomName}' is not being broadcasted`, 409);
};
// Room errors
export const errorRoomNotFound = (roomName) => {
    return new OpenViduCallError('Room Error', `The room '${roomName}' do not exist`, 404);
};
export const errorParticipantAlreadyExists = (participantName, roomName) => {
    return new OpenViduCallError('Room Error', `'${participantName}' already exists in room in ${roomName}`, 409);
};
//# sourceMappingURL=error.model.js.map