import { UsersService } from '../../modules/users/users.service';
import { UsersRepository } from '../../modules/users/users.repository';

describe('UsersService unit', () => {
  it('returns the scaffolded list response', () => {
    const repo = ({ findAll: () => [] } as unknown) as UsersRepository;
    const service = new UsersService(repo);

    const res = service.findAll();
    expect(res).toEqual({ data: [] });
  });
});
