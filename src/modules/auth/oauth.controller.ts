import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';

@ApiTags('Auth (OAuth)')
@Controller('auth/oauth')
export class OAuthController {
  // Skeleton endpoints for OAuth providers. These are placeholders
  // that you can implement with passport strategies later.

  @Get('google')
  @ApiOperation({ summary: 'Start Google OAuth (placeholder)' })
  async googleAuth(@Res() res: Response) {
    // In a real implementation, redirect to Google OAuth consent
    return res.status(501).json({ message: 'Google OAuth not implemented' });
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback (placeholder)' })
  async googleCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query() q: any,
  ) {
    return res
      .status(501)
      .json({ message: 'Google callback not implemented', query: q });
  }

  @Get('github')
  @ApiOperation({ summary: 'Start GitHub OAuth (placeholder)' })
  async githubAuth(@Res() res: Response) {
    return res.status(501).json({ message: 'GitHub OAuth not implemented' });
  }

  @Get('github/callback')
  @ApiOperation({ summary: 'GitHub OAuth callback (placeholder)' })
  async githubCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query() q: any,
  ) {
    return res
      .status(501)
      .json({ message: 'GitHub callback not implemented', query: q });
  }
}
