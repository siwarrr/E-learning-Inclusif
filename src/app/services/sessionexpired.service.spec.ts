import { TestBed } from '@angular/core/testing';

import { SessionexpiredService } from './sessionexpired.service';

describe('SessionexpiredService', () => {
  let service: SessionexpiredService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionexpiredService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
