import { IMafiaPlayer } from "./mafia-player";
import { IRoom } from "./room";

export interface IMafiaRoom extends IRoom {
    _roomCode: string;
    _gameName: string;
    _players: IMafiaPlayer[];
    _state: string;
}
