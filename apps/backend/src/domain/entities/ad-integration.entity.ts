export type AdProvider = 'google_ads' | 'facebook_ads';

export class AdIntegration {
  id!: number;
  userId!: number;
  provider!: AdProvider;
  clientId!: string;
  clientSecret!: string;
  accessToken!: string;
  refreshToken!: string;
  expiresAt!: Date | null;
  status!: 'active' | 'inactive' | 'error';

  constructor(params: Partial<AdIntegration>) {
    Object.assign(this, params);
  }
}
