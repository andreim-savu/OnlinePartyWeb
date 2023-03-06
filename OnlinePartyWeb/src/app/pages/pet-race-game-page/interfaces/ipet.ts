import { IPetRacePerk } from "./ipet-race-perk";

export interface IPet {
    id: string;
    name: string;
    perks: IPetRacePerk[];
    agility: number; //speed
    strength: number; //run mult
    intelligence: number; //avoid obstacles
    constitution: number; //stamina regen
    endurance: number; //stamina consumption
    dexterity: number; //obstacle modifier
}
