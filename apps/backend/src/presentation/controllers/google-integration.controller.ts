import { Controller, Get, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { SaveAdIntegrationUseCase } from '../../application/use-cases/integrations/save-ad-integration.use-case';
import { EnvVars } from '../../infrastructure/config/env.validation';

@Controller('integrations/google')
export class GoogleIntegrationController {
  constructor(
    private readonly configService: ConfigService<EnvVars, true>,
    private readonly saveAdIntegration: SaveAdIntegrationUseCase,
  ) {}

  @Get('initiate')
  initiateOAuth(@Req() req: Request, @Res() res: Response) {
    const clientId: string = this.configService.get('GOOGLE_ADS_CLIENT_ID');
    const redirectUri: string = this.configService.get(
      'GOOGLE_ADS_REDIRECT_URI',
    );
    const scope = [
      'https://www.googleapis.com/auth/adwords',
      'openid',
      'profile',
      'email',
    ].join(' ');
    const state = 'secureRandomState'; // ideal: gerar por usuário/sessão
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri ?? '')}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scope)}` +
      `&access_type=offline` +
      `&prompt=consent` +
      `&state=${state}`;
    return res.redirect(authUrl);
  }

  @Get('callback')
  async handleCallback(@Req() req: Request, @Res() res: Response) {
    const code = req.query.code as string;
    const clientId: string = this.configService.get('GOOGLE_ADS_CLIENT_ID');
    const clientSecret: string = this.configService.get(
      'GOOGLE_ADS_CLIENT_SECRET',
    );
    const redirectUri: string = this.configService.get(
      'GOOGLE_ADS_REDIRECT_URI',
    );
    // Troca o code por access_token e refresh_token
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const body = new URLSearchParams({
      code,
      client_id: clientId ?? '',
      client_secret: clientSecret ?? '',
      redirect_uri: redirectUri ?? '',
      grant_type: 'authorization_code',
    });
    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const tokenData = (await tokenRes.json()) as {
      access_token: string;
      expires_in: number;
      refresh_token: string;
      scope: string;
      token_type: string;
      id_token?: string;
    };
    // Exemplo: userId fixo, ajuste para pegar do usuário autenticado
    await this.saveAdIntegration.execute({
      userId: 1,
      provider: 'google_ads',
      clientId: clientId ?? '',
      clientSecret: clientSecret ?? '',
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
    });
    return res.json({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
    });
  }
}
