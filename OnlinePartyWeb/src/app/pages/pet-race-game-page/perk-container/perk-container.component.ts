import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { IPetRacePerk } from '../interfaces/ipet-race-perk';

@Component({
  selector: 'app-perk-container',
  templateUrl: './perk-container.component.html',
  styleUrls: ['./perk-container.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PerkContainerComponent implements OnInit {

  @Input() perkData!: IPetRacePerk;
  @Input() selected: boolean = false;

  levels: number[] = [];

  constructor() { }

  ngOnInit(): void {
    this.levels = Array(this.perkData.level).fill(0).map((x,i)=>i);
  }

}
