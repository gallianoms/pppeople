interface BaseRoomConfig {
  roomId: string;
  userId: string;
  estimationType?: 'fibonacci' | 't-shirt';
}

interface HostConfig extends BaseRoomConfig {
  isHost: true;
  isSpectator: boolean;
}

interface ParticipantConfig extends BaseRoomConfig {
  isHost: false;
  isSpectator: boolean;
}

export type RoomConfig = HostConfig | ParticipantConfig;
