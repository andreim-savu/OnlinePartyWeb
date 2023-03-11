import { IPetRacePerk } from "./ipet-race-perk";

export interface IPet {
    id: string;
    name: string;
    perks: IPetRacePerk[];
    movementSpeed: number; //speed
    dodge: number; //avoid obstacles
    regen: number; //stamina regen
    depletion: number; //stamina depletion
    modelNo: number;
}
