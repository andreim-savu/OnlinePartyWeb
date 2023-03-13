import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IPet } from './interfaces/ipet';
import { IPetRacePerk } from './interfaces/ipet-race-perk';
import { IPetRacePlayer } from './interfaces/ipet-race-player';
import { IPetRaceRoom } from './interfaces/ipet-race-room';
import { PetRaceGameService } from './pet-race-game.service';

@Component({
  selector: 'app-pet-race-game-page',
  templateUrl: './pet-race-game-page.component.html',
  styleUrls: ['./pet-race-game-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PetRaceGamePageComponent implements OnInit {

  roomCode: string = "";
  playerData!: IPetRacePlayer;
  playerIndex: number = 0;
  playerId: string = "";

  state: string = "";
  selectedPerk!: IPetRacePerk | null;

  highlightedPet!: IPet | null
  highlightedPerk!: IPetRacePerk | null;
  descriptionPerkLevels: number[] = [];

  loadoutPage = 1;
  turnNo: number = 1;
  roomLoaded: boolean = false;

  roomSubscription!: Subscription;

  constructor(private db: AngularFireDatabase, private router: Router, private service: PetRaceGameService) { }

  async ngOnInit() {
    this.roomCode = this.router.url.split("/")[this.router.url.split("/").length - 1];

    this.playerId = sessionStorage.getItem('userId')!;
    await this.service.getPerks();
    await this.getData();
    this.service.setPerks(this.playerData);
    this.getPerksFromString(this.playerData.perkSelectionPerks);
    this.setPetStats();
    this.subscribeToRoom();
    this.roomLoaded = true;
  }

  setPetStats(): void {
    let statsRemaining = 10;
    for (let pet of this.mockPets) {
      for (let i = 0; i < statsRemaining; i++) {
        let randomStat = Math.floor(Math.random() * 4);
        if (randomStat === 0) { pet.movementSpeed += 0.1; }
        else if (randomStat === 1) { pet.dodge++; }
        else if (randomStat === 2) { pet.regen += 1.5; }
        else if (randomStat === 3) { pet.depletion--; }
      }
    }
  }

  perksSelectionPerks: IPetRacePerk[] = [];

  getPerksFromString(perkString: string) {
    if (perkString) {
      let stringArray = perkString.split("/");
      let perksArray: IPetRacePerk[] = [];
      for (let s of stringArray) {
        let [perkId, perkLevel] = s.split(".");
        let perk = this.service.getPerkById(perkId.replace("-", ""), parseInt(perkLevel));
        if (perkId[0] === '-') { perk.frozen = true; }
        perksArray.push(perk);
      }
      this.perksSelectionPerks = perksArray;
    }
    if (this.perksSelectionPerks.length < 3) {
      this.service.setPerkChoices(this.perksSelectionPerks, this.turnNo);
    }
    this.updatePlayer();
  }

  async getData() {
    let data = (await this.db.object("rooms/" + this.roomCode).query.get()).val();
    let roomData = data as IPetRaceRoom;

    for (let player of roomData._players) {
      if (player.id === this.playerId) {
        this.playerIndex = roomData._players.indexOf(player);
        this.playerData = player as IPetRacePlayer;
        this.playerData.inventoryPerks = player.inventoryPerks ? player.inventoryPerks : [];
        this.playerData.perkSelectionPerks = player.perkSelectionPerks ? player.perkSelectionPerks : "";
        console.log(this.playerData.perkSelectionPerks);
        this.turnNo = roomData._turnNo;
        this.state = roomData._state;
        if (this.playerData.pet) {
          this.playerData.pet.perks = player.pet?.perks ? player.pet?.perks : [];
        }
        break;
      }
    }
  }

  subscribeToRoom() {
    let state = this.db.object("rooms/" + this.roomCode + "/_state");
    this.roomSubscription = state.snapshotChanges().subscribe(async (data) => {
      let state = data.payload.val();
      await this.getData();

      if (state === "Loadout" && !this.playerData.isReady) {
        this.loadoutPage = 1;
        this.getPerksFromString(this.playerData.perkSelectionPerks);
        this.roomLoaded = true;
      }
    });
  }

  navigateLoadout(direction: number) {
    this.loadoutPage += direction;
  }

  unsubscribeFromRoom() {
    this.roomSubscription.unsubscribe();
  }

  reroll() {
    if (this.playerData.freeRerolls > 0) {
      this.playerData.freeRerolls--;
    }
    else {
      if (this.playerData.coins <= 0) { return; }
      this.playerData.coins--;
    }
    this.perksSelectionPerks = this.perksSelectionPerks.filter(perk => perk.frozen);
    this.highlightedPerk = null;
    this.service.setPerksReroll(this.perksSelectionPerks, this.turnNo);
    this.updatePlayer();
  }

  showLobbySelectPerk(): boolean {
    if (!this.playerData.pet) { return false; }
    if (this.playerData.inventoryPerks.length || this.playerData.pet!.perks.length) { return false; }
    return true;
  }

  showLobbyLoadout(): boolean {
    if (!this.playerData.pet) { return false; }
    if (!this.playerData.inventoryPerks.length && !this.playerData.pet!.perks.length) { return false; }
    return true;
  }

  setReady(val: boolean): void {
    this.playerData.isReady = val;
    this.perksSelectionPerks = this.perksSelectionPerks.filter(perk => perk.frozen);
    this.selectedPerk = null;
    this.highlightedPerk = null;
    this.updatePlayer();
    this.subscribeToRoom();
  }

  isSelectPetDisabled(): boolean {
    if (!this.playerData.pet && !this.highlightedPet) { return true; }
    return false;
  }

  isSelectPerkDisabled(): boolean {
    if (!this.highlightedPerk || this.playerData.coins < 4) { return true; }

    return false;
  }

  isLoadoutButtonDisabled(): boolean {
    if (!this.selectedPerk) { return true; }
    return false;
  }

  highlightPerk(perk: IPetRacePerk) {
    this.highlightedPerk = perk;
  }

  highlightPet(pet: IPet) {
    this.highlightedPet = pet;
  }

  selectPerk(perk: IPetRacePerk): void {
    this.selectedPerk = perk;
    this.descriptionPerkLevels = Array(this.selectedPerk.level!).fill(0).map((x, i) => i);
  }

  petClick() {
    this.playerData.pet = this.highlightedPet!;
    this.playerData.pet.name = this.playerData.name;
    this.playerData.pet.id = this.playerData.id;
    this.highlightedPet = null;
    this.setReady(true);
  }

  test() {

    console.log(this.service.potentialCommonPerks);
  }

  perkClick() {
    if (!this.highlightedPerk) { return; }
    if (this.playerData.coins < 4) { return; }
    this.highlightedPerk.frozen = false;
    this.playerData.coins -= 4;
    this.service.updatePerk(this.highlightedPerk!);
    if (this.highlightedPerk!.level! > 1) {
      for (let i = 0; i < this.playerData.inventoryPerks.length; i++) {
        if (this.highlightedPerk?.id === this.playerData.inventoryPerks[i].id) {
          this.playerData.inventoryPerks[i] = this.highlightedPerk;
        }
      }
      for (let i = 0; i < this.playerData.pet!.perks.length; i++) {
        if (this.highlightedPerk?.id === this.playerData.pet?.perks[i].id) {
          this.playerData.pet!.perks[i] = this.highlightedPerk!;
        }
      }
    }
    else {
      this.playerData.inventoryPerks.push(this.highlightedPerk!);
    }
    this.perksSelectionPerks.splice(this.perksSelectionPerks.indexOf(this.highlightedPerk!), 1);
    this.highlightedPerk = null;

    this.updatePlayer();
  }

  loadoutButtonClick() {
    if (this.playerData.inventoryPerks.includes(this.selectedPerk!)) {
      this.equipPerk();
    }
    else if (this.playerData.pet!.perks.includes(this.selectedPerk!)) {
      this.unequipPerk();
    }
    this.selectedPerk = null;
  }

  equipPerk() {
    if (this.playerData.pet!.perks.length >= 5) { return; }

    for (let i = 0; i < this.playerData.inventoryPerks.length; i++) {
      if (this.selectedPerk === this.playerData.inventoryPerks[i]) {
        this.playerData.pet!.perks.push(this.playerData.inventoryPerks[i]);
        this.playerData.inventoryPerks.splice(i, 1);
      }
    }
  }

  unequipPerk() {
    for (let i = 0; i < this.playerData.pet!.perks.length; i++) {
      if (this.selectedPerk === this.playerData.pet!.perks[i]) {
        this.playerData.inventoryPerks.push(this.playerData.pet!.perks[i]);
        this.playerData.pet!.perks.splice(i, 1);
      }
    }
  }

  freezePerk() {
    if (!this.highlightedPerk) { return; }
    this.highlightedPerk!.frozen = !this.highlightedPerk?.frozen;
  }

  setLoadoutButtonText(): string {
    if (!this.selectedPerk) { return "Equip"; }
    if (this.playerData.inventoryPerks.includes(this.selectedPerk)) { return "Equip"; }
    if (this.playerData.pet!.perks.includes(this.selectedPerk)) { return "Unequip"; }
    return "";
  }

  updatePlayer() {
    let perkString = "";
    for (let perk of this.perksSelectionPerks) {
      if (perk.frozen) { perkString += "-"; }
      perkString += `${perk.id}.${perk.level}/`;
    }
    perkString = perkString.substring(0, perkString.length - 1);
    this.playerData.perkSelectionPerks = perkString;
    this.db.object(`rooms/${this.roomCode}/_players/${this.playerIndex}`).set(this.playerData);
  }

  mockPets: IPet[] = [
    {
      id: "1",
      name: "Mitzi",
      perks: [],
      movementSpeed: 8.5,
      dodge: 10,
      regen: 15,
      depletion: 40,
      modelNo: Math.floor(Math.random() * 6)
    },
    {
      id: "2",
      name: "Mac",
      perks: [],
      movementSpeed: 2.5,
      dodge: 10,
      regen: 15,
      depletion: 40,
      modelNo: Math.floor(Math.random() * 6)
    },
    {
      id: "3",
      name: "Motanitorul",
      perks: [],
      movementSpeed: 2.5,
      dodge: 10,
      regen: 15,
      depletion: 40,
      modelNo: Math.floor(Math.random() * 6)
    }
  ];
}
