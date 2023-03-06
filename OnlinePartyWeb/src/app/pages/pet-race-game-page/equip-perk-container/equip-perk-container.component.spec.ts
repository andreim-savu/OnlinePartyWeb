import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipPerkContainerComponent } from './equip-perk-container.component';

describe('EquipPerkContainerComponent', () => {
  let component: EquipPerkContainerComponent;
  let fixture: ComponentFixture<EquipPerkContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquipPerkContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipPerkContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
