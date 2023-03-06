import { Injectable } from '@angular/core';
import { IPlayer } from '../interfaces/player';
import { IRoom } from '../interfaces/room';

@Injectable({
  providedIn: 'root'
})
export class MafiaGameServiceService {

  currentUser?: IPlayer;

  constructor() { }

  initUser(user: IPlayer) {
    this.currentUser = user;
  }
}
