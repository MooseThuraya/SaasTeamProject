import { TestBed } from '@angular/core/testing';

import { ForumPostApiService } from './forumpost-api.service';

describe('ForumPostApiService', () => {
  let service: ForumPostApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForumPostApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
