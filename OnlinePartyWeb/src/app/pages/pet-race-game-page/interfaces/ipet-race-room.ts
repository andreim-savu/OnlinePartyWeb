import { IRoom } from "src/app/interfaces/room";
import { IPetRacePlayer } from "./ipet-race-player";

export interface IPetRaceRoom extends IRoom {
    _roomCode: string;
    _gameName: string;
    _players: IPetRacePlayer[];
    _state: string;
    _turnNo: number;
}
