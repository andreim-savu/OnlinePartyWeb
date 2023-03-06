import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerkContainerComponent } from './perk-container.component';

describe('PerkContainerComponent', () => {
  let component: PerkContainerComponent;
  let fixture: ComponentFixture<PerkContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerkContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerkContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
