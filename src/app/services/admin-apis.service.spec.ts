import { TestBed } from '@angular/core/testing';

import { AdminApisService } from './admin-apis.service';

describe('AdminApisService', () => {
  let service: AdminApisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminApisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
