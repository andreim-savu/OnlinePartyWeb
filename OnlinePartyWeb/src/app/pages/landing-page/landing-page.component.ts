import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IMafiaPlayer } from 'src/app/interfaces/mafia-player';
import { IMafiaRoom } from 'src/app/interfaces/mafia-room';
import { IPlayer } from 'src/app/interfaces/player';
import { IRoom } from 'src/app/interfaces/room';
import { IPetRacePerk } from '../pet-race-game-page/interfaces/ipet-race-perk';
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

  perks: IPetRacePerk[] = [
    {
      id: "0",
      name: "Move Speed Up",
      description: "Increase movement speed by $0.1/0.2/0.3/0.4/0.5$m/s.",
      rarity: "Rare",
      level: 0
    },
    {
      id: "1",
      name: "Dodge Chance Up",
      description: "Increase dodge chance by $5%/10%/15%/20%/25%$m/s.",
      rarity: "Common",
      level: 0
    },
    {
      id: "2",
      name: "Stamina Regen Up",
      description: "Increase stamina regeneration by $1.5/3.0/4.5/6.0/7.5$/s.",
      rarity: "Common",
      level: 0
    },
    {
      id: "3",
      name: "Stamina Depletion Down",
      description: "Decreases stamina consumption by $1.0/2.0/3.0/4.0/5.0$/s.",
      rarity: "Common",
      level: 0
    },
    {
      id: "4",
      name: "Excited Runner",
      description: "Stamina regeneration and consumption happens $1.2/1.4/1.6/1.8/2.0$ times faster.",
      rarity: "Epic",
      level: 0
    },
    {
      id: "5",
      name: "Power Walker",
      description: "Increases movement speed by $0.2/0.4/0.6/0.8/1.0$m/s but decreases running speed by $5%/10%/15%/20%/25%$.",
      rarity: "Common",
      level: 0
    },
    {
      id: "6",
      name: "Run Speed Up",
      description: "Increases running speed by $5%/10%/15%/20%/25%$.",
      rarity: "Common",
      level: 0
    },
    {
      id: "7",
      name: "Obstacle Avoider",
      description: "Avoid the first $1/2/3/4/5$ obstacles.",
      rarity: "Rare",
      level: 1
    }, {
      id: "8",
      name: "Run Burst",
      description: "When running gain $0.5/1/1.5/2/2.5$ speed for 1 second.",
      rarity: "Rare",
      level: 1
    }, {
      id: "9",
      name: "Energy Siphon",
      description: "When you finish running steal $5/5/10/10/15$ stamina from other pets. ($1/2/2/3/3$ charges)",
      rarity: "Legendary",
      level: 1
    }, {
      id: "10",
      name: "Stun Share",
      description: "When hitting an obstacle stun all other pets for $1x/1x/1.5x/1.5x/2x$ the normal duration. ($1/2/2/3/3$ charges)",
      rarity: "Legendary",
      level: 1
    }, {
      id: "11",
      name: "Start Stamina",
      description: "Start the race with $10/20/30/40/50$ stamina.",
      rarity: "Common",
      level: 1
    }, {
      id: "12",
      name: "Fast Refresh",
      description: "After running gain $10/20/30/40/50$ stamina.",
      rarity: "Epic",
      level: 1
    }, {
      id: "13",
      name: "Slow Start",
      description: "Move at half speed for the first 5 seconds, after which move $1.2x/1.4x/1.6x/1.8x/2x$ faster.",
      rarity: "Epic",
      level: 1
    }, {
      id: "14",
      name: "Positive Frustration",
      description: "When hitting an obstacle gain $0.1/0.2/0.3/0.4/0.5$ speed.",
      rarity: "Legendary",
      level: 1
    }, {
      id: "15",
      name: "Loud Runner",
      description: "When you start running slow all other pets by $50%/50%/50%/50%/75%$ for $2/2/4/4/4$ seconds. ($1/2/2/3/3$ charges)",
      rarity: "Legendary",
      level: 1
    }, {
      id: "16",
      name: "Fast Finish",
      description: "Shorten the track by $5%/10%/15%/20%/25%$",
      rarity: "Epic",
      level: 1
    }, {
      id: "17",
      name: "Reduce Stun Duration",
      description: "Stun duration reduced by $0.1s/0.2s/0.3s/0.4s/0.5s$.",
      rarity: "Epic",
      level: 1
    }, {
      id: "18",
      name: "Water Specialist",
      description: "Move $20%/40%/60%/80%/100%$ faster in water.",
      rarity: "Rare",
      level: 1
    }, {
      id: "19",
      name: "Sand Specialist",
      description: "Move $20%/40%/60%/80%/100%$ faster in sand.",
      rarity: "Rare",
      level: 1
    }, {
      id: "20",
      name: "Motivated Walker",
      description: "Reduce stun duration by $0.1s/0.2s/0.3s/0.4s/0.5s$ while walking.",
      rarity: "Rare",
      level: 1
    }, {
      id: "21",
      name: "Pick Up Pace",
      description: "After running the running speed increases by $5%/10%/15%/20%/25%$.",
      rarity: "Rare",
      level: 1
    }
  ];
}
