import { UsersService } from '../../modules/users/users.service';
import { UsersRepository } from '../../modules/users/users.repository';
import { ConfigService } from '@nestjs/config';

describe('UsersService unit', () => {
  it('returns the scaffolded list response', async () => {
    const repo = ({ findAll: async () => [] } as unknown) as UsersRepository;
    const config = { get: () => '10' } as unknown as ConfigService;
    const service = new UsersService(repo, config);

    const res = await service.findAll();
    expect(res).toEqual({ data: [] });
  });
});
