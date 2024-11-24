interface BaseRoomConfig {
  roomId: string;
  userId: string;
}

interface HostConfig extends BaseRoomConfig {
  isHost: true;
}

interface ParticipantConfig extends BaseRoomConfig {
  isHost: false;
  isSpectator: boolean;
}

export type RoomConfig = HostConfig | ParticipantConfig;
