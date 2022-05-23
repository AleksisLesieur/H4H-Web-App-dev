import { TestBed } from '@angular/core/testing';

import { CAuthguardService } from './c-authguard.service';

describe('CAuthguardService', () => {
  let service: CAuthguardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CAuthguardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
