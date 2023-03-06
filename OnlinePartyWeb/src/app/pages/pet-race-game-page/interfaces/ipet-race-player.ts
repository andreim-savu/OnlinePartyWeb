import { IPet } from "./ipet";
import { IPetRacePerk } from "./ipet-race-perk";

export interface IPetRacePlayer {
    id: string;
    name: string;
    pet?: IPet;
    inventoryPerks: IPetRacePerk[];
    perkSelectionPerks: IPetRacePerk[];
    isReady: boolean;
    host: boolean;
}
