import { TasksService } from '../../modules/tasks/tasks.service';

describe('TasksService unit', () => {
  it('returns the scaffolded list response', () => {
    const service = new TasksService();

    expect(service.findAll()).toBe('This action returns all tasks');
  });
});
