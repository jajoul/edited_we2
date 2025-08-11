import { Room, SendDataOptions } from 'livekit-server-sdk';
export declare class RoomService {
    private static instance;
    private roomClient;
    private logger;
    private ROOM_OWNER_NAME;
    private constructor();
    static getInstance(): RoomService;
    /**
     * Creates a new room with the specified name.
     * @param roomName - The name of the room to create.
     * @returns A Promise that resolves to the created Room object.
     */
    createRoom(roomName: string): Promise<Room>;
    /**
     * Retrieves a room by its name.
     * @param roomName - The name of the room to retrieve.
     * @returns A Promise that resolves to the retrieved Room object.
     * @throws If there was an error retrieving the room or if the room was not found.
     */
    getRoom(roomName: string): Promise<Room>;
    /**
     * Checks if a room was created by the current user.
     *
     * @param roomOrRoomName - The room object or the room name.
     * @returns A promise that resolves to a boolean indicating whether the room was created by the current user.
     */
    isRoomCreatedByMe(roomOrRoomName: Room | string): Promise<boolean>;
    /**
     * Sends a signal to the specified room.
     *
     * @param roomName - The name of the room.
     * @param rawData - The raw data to be sent as a signal.
     * @param options - The options for sending the signal.
     * @returns A Promise that resolves to the updated Room object after sending the signal.
     * @throws {OpenViduCallError} If there is an error sending the signal.
     * @throws {Error} If the room is not found or if there is no RoomServiceClient available.
     */
    sendSignal(roomName: string, rawData: any, options: SendDataOptions): Promise<Room>;
}
//# sourceMappingURL=room.service.d.ts.map