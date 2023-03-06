import { Component, Input, OnInit } from '@angular/core';
import { IPet } from '../interfaces/ipet';

@Component({
  selector: 'app-pet-container',
  templateUrl: './pet-container.component.html',
  styleUrls: ['./pet-container.component.scss']
})
export class PetContainerComponent {

  @Input() petData!: IPet;
  @Input() selected: boolean = false;

  constructor() { }
}
