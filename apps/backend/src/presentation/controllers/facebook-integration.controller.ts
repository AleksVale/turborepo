import { Controller, Get, Inject, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { SaveAdIntegrationUseCase } from '../../application/use-cases/integrations/save-ad-integration.use-case';
import { EnvVars } from '../../infrastructure/config/env.validation';

@Controller('integrations/facebook')
export class FacebookIntegrationController {
  constructor(
    private readonly configService: ConfigService<EnvVars, true>,
    @Inject(SaveAdIntegrationUseCase)
    private readonly saveAdIntegration: SaveAdIntegrationUseCase,
  ) {}

  @Get('initiate')
  initiateOAuth(@Req() req: Request, @Res() res: Response) {
    const clientId: string = this.configService.get('FACEBOOK_CLIENT_ID');
    const redirectUri: string = this.configService.get('FACEBOOK_REDIRECT_URI');
    const scope = 'ads_management,ads_read,business_management';
    const state = 'secureRandomState';
    const authUrl =
      `https://www.facebook.com/v19.0/dialog/oauth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri ?? '')}` +
      `&scope=${encodeURIComponent(scope)}` +
      `&state=${state}`;
    return res.redirect(authUrl);
  }

  @Get('callback')
  async handleCallback(@Req() req: Request, @Res() res: Response) {
    const code = req.query.code as string;
    const clientId: string = this.configService.get('FACEBOOK_CLIENT_ID');
    const clientSecret: string = this.configService.get(
      'FACEBOOK_CLIENT_SECRET',
    );
    const redirectUri: string = this.configService.get('FACEBOOK_REDIRECT_URI');

    // Troca o code por access_token
    const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri ?? '',
    )}&client_secret=${clientSecret}&code=${code}`;
    const tokenRes = await fetch(tokenUrl);
    const tokenData = (await tokenRes.json()) as {
      access_token: string;
      token_type: string;
      expires_in: number;
    };
    // TODO: userId fixo, ajuste para pegar do usuário autenticado
    await this.saveAdIntegration.execute({
      userId: 1,
      provider: 'facebook_ads',
      clientId: clientId ?? '',
      clientSecret: clientSecret ?? '',
      accessToken: tokenData.access_token,
      refreshToken: '',
      expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
    });

    return res.json({
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
    });
  }
}
