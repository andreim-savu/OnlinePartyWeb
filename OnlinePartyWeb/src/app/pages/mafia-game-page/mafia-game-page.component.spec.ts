import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MafiaGamePageComponent } from './mafia-game-page.component';

describe('MafiaGamePageComponent', () => {
  let component: MafiaGamePageComponent;
  let fixture: ComponentFixture<MafiaGamePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MafiaGamePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MafiaGamePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
