import { TestBed } from '@angular/core/testing';

import { LanugageService } from './lanugage.service';

describe('LanugageService', () => {
  let service: LanugageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanugageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
