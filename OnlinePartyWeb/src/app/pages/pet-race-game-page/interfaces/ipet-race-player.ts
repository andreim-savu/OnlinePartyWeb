import { IPet } from "./ipet";
import { IPetRacePerk } from "./ipet-race-perk";

export interface IPetRacePlayer {
    id: string;
    name: string;
    pet?: IPet;
    inventoryPerks: IPetRacePerk[];
    perkSelectionPerks: string;
    isReady: boolean;
    coins: number;
    freeRerolls: number;
    score: number;
    host: boolean;
}
