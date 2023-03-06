export interface IMafiaPlayer {
    id: string;
    username: string;
    role: string;
    targetId: string;
    lastTargetId: string;
    targetLocked: boolean;
    alive: boolean;
    host: boolean;
}
