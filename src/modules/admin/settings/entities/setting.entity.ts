import { ApiProperty } from '@nestjs/swagger';

export class SystemSetting {
  @ApiProperty({ example: 'uuid-setting-1234', description: 'Internal ID' })
  id: string;

  @ApiProperty({
    example: 'auth.bcryptSaltRounds',
    description: 'System setting key',
  })
  key: string;

  @ApiProperty({ example: '10', description: 'String value of the setting' })
  value: string;

  @ApiProperty({
    example: 'Rounds for password hashing',
    description: 'Setting description',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Last update date',
  })
  updatedAt: Date;
}
