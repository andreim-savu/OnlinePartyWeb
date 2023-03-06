import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IPet } from './interfaces/ipet';
import { IPetRacePerk } from './interfaces/ipet-race-perk';
import { IPetRacePlayer } from './interfaces/ipet-race-player';
import { IPetRaceRoom } from './interfaces/ipet-race-room';

@Component({
  selector: 'app-pet-race-game-page',
  templateUrl: './pet-race-game-page.component.html',
  styleUrls: ['./pet-race-game-page.component.scss']
})
export class PetRaceGamePageComponent implements OnInit {

  roomCode: string = "";
  playerData!: IPetRacePlayer;
  /*Possible States
  Pet
  Perk
  Race
  Loadout
  */
  state: string = "";
  selectedPerk!: IPetRacePerk | null;

  highlightedPet!: IPet | null
  highlightedPerk!: IPetRacePerk | null;

  roomSubscription!: Subscription;

  playerIndex: number = 0;

  roomLoaded: boolean = false;

  playerId: string = "";

  constructor(private db: AngularFireDatabase, private router: Router) { }

  ngOnInit(): void {
    this.roomCode = this.router.url.split("/")[this.router.url.split("/").length - 1];

    this.playerId = sessionStorage.getItem('userId')!;
    this.getData();
    this.setPetStats();
    this.subscribeToRoom();
  }

  setPetStats(): void {
    let statsRemaining = 15;
    for (let pet of this.mockPets) {
      for (let i = 0; i < statsRemaining; i++) {
        let randomStat = Math.floor(Math.random() * 6);
        if (randomStat === 0) { pet.agility++; }
        else if (randomStat === 1) { pet.strength++; }
        else if (randomStat === 2) { pet.intelligence++; }
        else if (randomStat === 3) { pet.constitution++; }
        else if (randomStat === 4) { pet.endurance++; }
        else if (randomStat === 5) { pet.dexterity++; }
      }
    }
  }

  getMockData() {
    this.playerData = {
      id: "123",
      name: "Ramzar",
      inventoryPerks: [],
      perkSelectionPerks: [],
      isReady: false,
      host: true
    }
    this.state = "Lobby";
    this.roomLoaded = true;
  }

  async getData() {
    // let room = this.db.object('rooms/' + this.roomCode);
    // this.roomSubscription = room.snapshotChanges().subscribe(data => {
    //   console.log("Data changed");
    //   let roomData = data.payload.val() as IPetRaceRoom;
    //   for (let player of roomData._players) {
    //     console.log(player);
    //     if (player.id === playerId) {
    //       this.playerIndex = roomData._players.indexOf(player);
    //       this.playerData = player as IPetRacePlayer;
    //       this.playerData.inventoryPerks = player.inventoryPerks ? player.inventoryPerks : [];
    //       this.playerData.perkSelectionPerks = player.perkSelectionPerks ? player.perkSelectionPerks : [];
    //       this.roomLoaded = true;
    //       this.state = roomData._state;
    //       if (this.playerData.pet) {
    //         this.playerData.pet.perks = player.pet?.perks ? player.pet?.perks : [];
    //       }
    //       break;
    //     }
    //   }
    // });

    let data = (await this.db.object("rooms/" + this.roomCode).query.get()).val();
    let roomData = data as IPetRaceRoom;

    for (let player of roomData._players) {
      if (player.id === this.playerId) {
        this.playerIndex = roomData._players.indexOf(player);
        this.playerData = player as IPetRacePlayer;
        this.playerData.inventoryPerks = player.inventoryPerks ? player.inventoryPerks : [];
        this.playerData.perkSelectionPerks = player.perkSelectionPerks ? player.perkSelectionPerks : [];
        this.state = roomData._state;
        if (this.playerData.pet) {
          this.playerData.pet.perks = player.pet?.perks ? player.pet?.perks : [];
        }
        this.roomLoaded = true;
        break;
      }
    }
  }

  inRace = false;

  subscribeToRoom() {
    let state = this.db.object("rooms/" + this.roomCode + "/_state");
    this.roomSubscription = state.snapshotChanges().subscribe(data => {
      let state = data.payload.val();

      if (!this.inRace && state ==="Race") {
        console.log("At race");
        this.inRace = true;
      }

      else if (this.inRace && state === "Loadout") {
        console.log("At loadout");
        this.getData();
        this.unsubscribeFromRoom();
        this.inRace = false;
      }
      this.getData();
    });
  }

  unsubscribeFromRoom() {
    this.roomSubscription.unsubscribe();
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
    this.updatePlayer();
    this.subscribeToRoom();
  }

  isSelectPetDisabled(): boolean {
    if (!this.playerData.pet && !this.highlightedPet) { return true; }
    return false;
  }

  isSelectPerkDisabled(): boolean {
    if (!this.highlightedPerk) { return true; }

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
  }

  petClick() {
    this.playerData.pet = this.highlightedPet!;
    this.playerData.pet.name = this.playerData.name;
    this.highlightedPet = null;
    this.setReady(true);
  }

  perkClick() {
    if (this.highlightedPerk!.level > 1) {
      for (let i = 0; i < this.playerData.inventoryPerks.length; i++) {
        if (this.highlightedPerk?.id === this.playerData.inventoryPerks[i].id) {
          this.playerData.inventoryPerks[i] = this.highlightedPerk;
          this.playerData.perkSelectionPerks = [];
          this.highlightedPerk = null;
          this.updatePlayer();
          return;
        }
      }       
      for (let i = 0; i < this.playerData.pet!.perks.length; i++) {
        if (this.highlightedPerk?.id === this.playerData.pet?.perks[i].id) {
          this.playerData.pet!.perks[i] = this.highlightedPerk!;
          this.playerData.perkSelectionPerks = [];
          this.highlightedPerk = null;
          this.updatePlayer();
          return;
        }
      }
    }

    this.playerData.inventoryPerks.push(this.highlightedPerk!);
    this.playerData.perkSelectionPerks = [];
    this.highlightedPerk = null;
    this.updatePlayer();
  }

  loadoutButtonClick() {
    console.log(this.selectedPerk);
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

  setLoadoutButtonText(): string {
    if (!this.selectedPerk) { return "Equip"; }
    if (this.playerData.inventoryPerks.includes(this.selectedPerk)) { return "Equip"; }
    if (this.playerData.pet!.perks.includes(this.selectedPerk)) { return "Unequip"; }
    return "";
  }

  updatePlayer() {
    this.db.object(`rooms/${this.roomCode}/_players/${this.playerIndex}`).set(this.playerData);
  }

  mockPets: IPet[] = [
    {
      id: "1",
      name: "Mitzi",
      perks: [],
      agility: 9,
      strength: 9,
      intelligence: 9,
      constitution: 9,
      endurance: 9,
      dexterity: 9
    },
    {
      id: "2",
      name: "Mac",
      perks: [],
      agility: 9,
      strength: 9,
      intelligence: 9,
      constitution: 9,
      endurance: 9,
      dexterity: 9
    },
    {
      id: "3",
      name: "Motanitorul",
      perks: [],
      agility: 9,
      strength: 9,
      intelligence: 9,
      constitution: 9,
      endurance: 9,
      dexterity: 9
    }
  ];
}
