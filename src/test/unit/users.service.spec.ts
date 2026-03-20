import { UsersService } from '../../modules/users/users.service';

describe('UsersService unit', () => {
  it('returns the scaffolded list response', () => {
    const service = new UsersService();

    expect(service.findAll()).toBe('This action returns all users');
  });
});
