import { TestBed } from '@angular/core/testing';

import { PetRaceGameService } from './pet-race-game.service';

describe('PetRaceGameService', () => {
  let service: PetRaceGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PetRaceGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
