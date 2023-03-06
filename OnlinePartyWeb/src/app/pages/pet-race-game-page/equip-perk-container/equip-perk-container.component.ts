import { Component, Input, OnInit } from '@angular/core';
import { IPetRacePerk } from '../interfaces/ipet-race-perk';

@Component({
  selector: 'app-equip-perk-container',
  templateUrl: './equip-perk-container.component.html',
  styleUrls: ['./equip-perk-container.component.scss']
})
export class EquipPerkContainerComponent implements OnInit {

  @Input() equippedPerk!: IPetRacePerk;

  constructor() { }

  ngOnInit(): void {
  }

}
