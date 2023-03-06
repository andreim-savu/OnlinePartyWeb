import { Component, Input, OnInit } from '@angular/core';
import { IPetRacePerk } from '../interfaces/ipet-race-perk';

@Component({
  selector: 'app-perk-container',
  templateUrl: './perk-container.component.html',
  styleUrls: ['./perk-container.component.scss']
})
export class PerkContainerComponent implements OnInit {

  @Input() perkData!: IPetRacePerk;
  @Input() selected: boolean = false;

  stars: number[] = [];

  constructor() { }

  ngOnInit(): void {
    this.stars = Array(this.perkData.level).fill(0).map((x,i)=>i);
  }

}
