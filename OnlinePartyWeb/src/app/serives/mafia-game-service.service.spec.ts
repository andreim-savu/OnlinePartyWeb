import { TestBed } from '@angular/core/testing';

import { MafiaGameServiceService } from './mafia-game-service.service';

describe('MafiaGameServiceService', () => {
  let service: MafiaGameServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MafiaGameServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
