import { TestBed } from '@angular/core/testing';

import { TaskService } from '../../../src/app/tasks/tasks.service';

describe('TaskService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaskService = TestBed.get(TaskService);
    expect(service).toBeTruthy();
  });
});
