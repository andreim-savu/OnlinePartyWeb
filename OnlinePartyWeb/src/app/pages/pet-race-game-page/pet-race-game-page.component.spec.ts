import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetRaceGamePageComponent } from './pet-race-game-page.component';

describe('PetRaceGamePageComponent', () => {
  let component: PetRaceGamePageComponent;
  let fixture: ComponentFixture<PetRaceGamePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PetRaceGamePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PetRaceGamePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
