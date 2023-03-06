import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IMafiaPlayer } from 'src/app/interfaces/mafia-player';
import { IMafiaRoom } from 'src/app/interfaces/mafia-room';
import { IPlayer } from 'src/app/interfaces/player';
import { IRoom } from 'src/app/interfaces/room';
import { IPetRacePlayer } from '../pet-race-game-page/interfaces/ipet-race-player';
import { IPetRaceRoom } from '../pet-race-game-page/interfaces/ipet-race-room';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  rooms: AngularFireObject<any> = this.db.object('rooms/room1');

  test2!: Subscription;
  
  constructor(private db: AngularFireDatabase, private router: Router, private firestore: AngularFirestore) { }

  ngOnInit(): void {
  }

  joinRoom(username: HTMLInputElement, code: HTMLInputElement) {
    let room = this.db.object('rooms/' + code.value);
    this.test2 = room.snapshotChanges().subscribe(data => {
      console.log(data.payload.val());

      if (!data.payload.val()) { return; }

      let roomData: IRoom = data.payload.val() as IRoom;

      if (roomData._state !== "Lobby") { return; }

      switch (roomData._gameName) {
        case "Mafia":
          this.joinMafia(roomData as IMafiaRoom, username, code);
          break;
        case "PetRace":
          this.joinPetRace(roomData as IPetRaceRoom, username, code);
          break;
      }
    });
  }

  joinMafia(roomData: IMafiaRoom, username: HTMLInputElement, code: HTMLInputElement) {
    let newPlayer: IMafiaPlayer = {
      id: this.generateRandomId(),
      username: username.value,
      role: "",
      targetId: "",
      lastTargetId: "",
      targetLocked: false,
      alive: true,
      host: false
    };

    if (!roomData._players) { 
      newPlayer.host = true;
      roomData._players = [newPlayer]; 
    }
    else { roomData._players.push(newPlayer); }

    this.db.object('rooms/' + code.value + "/_players").set(roomData._players);

    sessionStorage.setItem("userId", newPlayer.id);
    this.router.navigate(["/mafia/" + code.value]);

    this.test2.unsubscribe();
  }

  joinPetRace(roomData: IPetRaceRoom, username: HTMLInputElement, code: HTMLInputElement) {
    let newPlayer: IPetRacePlayer = {
      id: this.generateRandomId(),
      name: username.value,
      inventoryPerks: [],
      perkSelectionPerks: [],
      isReady: false,
      host: false
    };

    if (!roomData._players) { 
      newPlayer.host = true;
      roomData._players = [newPlayer]; 
    }
    else { roomData._players.push(newPlayer); }

    this.db.object('rooms/' + code.value + "/_players").set(roomData._players);

    sessionStorage.setItem("userId", newPlayer.id);
    this.router.navigate(["/pet-race/" + code.value]);

    this.test2.unsubscribe();
  }

  generateRandomId(): string {
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";

    for (let i = 0; i < 9; i++) {
      if ((i + 1) % 5 === 0) {
        id += "-";
        continue;
      }

      id += characters[Math.floor(Math.random() * characters.length)];
    }
    console.log(id);
    return id;
  }

  test() {
    for (let perk of this.perks) {
      this.firestore.collection('PetRacePerks').add(perk);
    }
  }

  perks: any[] = [{
    id: "0",
    name: "Agility Up",
    description: "Increases agility by 3/6/9/12/15.",
    rarity: "Common"
  },{
    id: "1",
    name: "Strength Up",
    description: "Increases strength by 3/6/9/12/15.",
    rarity: "Common"
  },{
    id: "2",
    name: "Intelligence Up",
    description: "Increases intelligence by 3/6/9/12/15.",
    rarity: "Common"
  },{
    id: "3",
    name: "Constitution Up",
    description: "Increases constitution by 3/6/9/12/15.",
    rarity: "Common"
  },{
    id: "4",
    name: "Endurance Up",
    description: "Increases endurance by 3/6/9/12/15.",
    rarity: "Common"
  },{
    id: "5",
    name: "Dexterity Up",
    description: "Increases dexterity by 3/6/9/12/15.",
    rarity: "Common"
  },{
    id: "6",
    name: "All Stats Up",
    description: "Increases all stats by 1/2/3/4/5.",
    rarity: "Rare"
  },{
    id: "7",
    name: "Obstacle Avoider",
    description: "Avoid the first 1/2/3/4/5 obstacles.",
    rarity: "Rare"
  },{
    id: "8",
    name: "Run Burst",
    description: "When running gain 0.5/1/1.5/2/2.5 speed for 1 second.",
    rarity: "Rare"
  },{
    id: "9",
    name: "Energy Siphon",
    description: "When you finish running steal 5/5/10/10/15 stamina from other pets. (1/2/2/3/3 charges)",
    rarity: "Legendary"
  },{
    id: "10",
    name: "Stun Share",
    description: "When hitting an obstacle stun all other pets for 1x/1x/1.5x/1.5x/2x the normal duration. (1/2/2/3/3 charges)",
    rarity: "Legendary"
  },{
    id: "11",
    name: "Start Stamina",
    description: "Start the race with 10/20/30/40/50 stamina.",
    rarity: "Common"
  },{
    id: "12",
    name: "Fast Refresh",
    description: "After running gain 10/20/30/40/50 stamina.",
    rarity: "Epic"
  },{
    id: "13",
    name: "Slow Start",
    description: "Move at half speed for the first 5 seconds, after which move 1.2x/1.4x/1.6x/1.8x/2x faster.",
    rarity: "Epic"
  },{
    id: "14",
    name: "Positive Frustration",
    description: "When hitting an obstacle gain 0.1/0.2/0.3/0.4/0.5 speed.",
    rarity: "Epic"
  },{
    id: "15",
    name: "Loud Runner",
    description: "When you start running slow all other pets by 50%/50%/50%/50%/75% for 2/2/4/4/4 seconds. (1/2/2/3/3 charges)",
    rarity: "Legendary"
  },{
    id: "16",
    name: "Fast Finish",
    description: "Shorten the track by 5%/10%/15%/20%/25%",
    rarity: "Epic"
  },{
    id: "17",
    name: "Reduce Stun Duration",
    description: "Stun duration reduced by 0.1s/0.2s/0.3s/0.4s/0.5s.",
    rarity: "Epic"
  },{
    id: "18",
    name: "Water Specialist",
    description: "Move 20%/40%/60%/80%/100% faster in water.",
    rarity: "Rare"
  },{
    id: "19",
    name: "Sand Specialist",
    description: "Move 20%/40%/60%/80%/100% faster in sand.",
    rarity: "Rare"
  },{
    id: "20",
    name: "Motivated Walker",
    description: "Reduce stun duration by 0.1s/0.2s/0.3s/0.4s/0.5s while walking.",
    rarity: "Rare"
  },{
    id: "21",
    name: "Stat Motivation",
    description: "Your lowest 1/2/3/4/5 stats(s) become equal to your highest",
    rarity: "Legendary"
  }
];
}
