import { TestBed } from '@angular/core/testing';

import { CourseSpaceService } from './course-space.service';

describe('CourseSpaceService', () => {
  let service: CourseSpaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseSpaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
