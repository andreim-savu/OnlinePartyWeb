import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetContainerComponent } from './pet-container.component';

describe('PetContainerComponent', () => {
  let component: PetContainerComponent;
  let fixture: ComponentFixture<PetContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PetContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PetContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
