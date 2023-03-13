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
      perkSelectionPerks: "",
      isReady: false,
      coins: 10,
      freeRerolls: 0,
      score: 0,
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
}
