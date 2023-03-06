import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IMafiaPlayer } from 'src/app/interfaces/mafia-player';
import { IMafiaRoom } from 'src/app/interfaces/mafia-room';
import { IPlayer } from 'src/app/interfaces/player';
import { MafiaGameServiceService } from 'src/app/serives/mafia-game-service.service';

@Component({
  selector: 'app-mafia-game-page',
  templateUrl: './mafia-game-page.component.html',
  styleUrls: ['./mafia-game-page.component.scss']
})
export class MafiaGamePageComponent implements OnInit {

  roomCode: string = "";
  roomData?: IMafiaRoom;
  currentPlayer!: IMafiaPlayer;
  roomSubscription!: Subscription;

  currentIndex: number = 0;

  constructor(private db: AngularFireDatabase, private router: Router) { }

  async ngOnInit() {
    this.roomCode = this.router.url.split("/")[this.router.url.split("/").length - 1];
    let playerId: string = sessionStorage.getItem('userId')!;
    this.getRoomData(playerId);
  }

  async setRoomMockPlayers() {
    let mockPlayers: IMafiaPlayer[] = [
      {
        id: "0",
        username: "Andrei",
        role: "Village",
        targetId: "",
        lastTargetId: "",
        targetLocked: false,
        alive: true,
        host: true,
      },
      {
        id: "1",
        username: "Adina",
        role: "Mafia",
        targetId: "",
        lastTargetId: "",
        targetLocked: false,
        alive: true,
        host: false,
      },
      {
        id: "2",
        username: "Cosmin",
        role: "Medic",
        targetId: "",
        lastTargetId: "",
        targetLocked: false,
        alive: true,
        host: false,
      },
      {
        id: "3",
        username: "Ioana",
        role: "Mafia",
        targetId: "",
        lastTargetId: "",
        targetLocked: false,
        alive: true,
        host: false,
      },
      {
        id: "4",
        username: "Alexis",
        role: "Village",
        targetId: "",
        lastTargetId: "",
        targetLocked: false,
        alive: true,
        host: false,
      },
      {
        id: "5",
        username: "Bog",
        role: "Cop",
        targetId: "",
        lastTargetId: "",
        targetLocked: false,
        alive: true,
        host: false,
      },
      {
        id: "6",
        username: "Catalina",
        role: "Village",
        targetId: "",
        lastTargetId: "",
        targetLocked: false,
        alive: true,
        host: false,
      }
    ];

    this.currentPlayer = mockPlayers[0];
    console.log(this.currentPlayer);

    
    await this.db.object('rooms/' + this.roomCode).update({ _players: mockPlayers });
  }
 
  async getRoomData(currentPlayerId: string) {
    let room = this.db.object('rooms/' + this.roomCode);
    this.roomSubscription = room.snapshotChanges().subscribe(data => {
      this.roomData = data.payload.val() as IMafiaRoom;
      for (let player of this.roomData._players) {
        if (player.id === currentPlayerId) {
          this.currentPlayer = player as IMafiaPlayer;
        }
      }
    });
  }

  cyclePlayer(): void {
    this.currentIndex += 1;
    if (this.currentIndex > this.roomData?._players.length! - 1) { this.currentIndex = 0; }
    this.currentPlayer = this.roomData!._players[this.currentIndex];
  }

  startGame(): void {
    if (this.roomData!._players.length < 4) { return; }
    this.db.object('rooms/' + this.roomCode).update({ _state: "Roles" });
  }

  selectTarget(target: IMafiaPlayer): void {
    this.currentPlayer.targetId = target.id;
    this.updatePlayer();
  }

  lockTarget(): void {
    if (!this.currentPlayer.targetId) { return; }
    this.currentPlayer.targetLocked = true;
    this.updatePlayer();
  }

  updatePlayer() {
    for (let player of this.roomData!._players) {
      if (player.id === this.currentPlayer.id) {
        player = this.currentPlayer;
      }
    }
    this.db.object('rooms/' + this.roomCode + "/_players").set(this.roomData?._players);
  }

  test(): void {
    console.log(this.roomData);
    console.log(this.currentPlayer);
  }

  isOtherMafiaSelected(target: IMafiaPlayer): boolean {
    for (let player of this.roomData!._players) {
      if (player.role !== "Mafia" || player.id === this.currentPlayer.id) { continue; }
      if (player.targetId === target.id) { return true; }
    }
    return false;
  }

  getTargetName(): string {
    for (let player of this.roomData!._players) {
      if (player.id === this.currentPlayer.targetId) {
        return player.username;
      }
    }
    return "";
  }

  isTargetMafia(): boolean {
    for (let player of this.roomData!._players) {
      if (player.id === this.currentPlayer.targetId) {
        return player.role === "Mafia";
      }
    }
    return false;
  }
}
