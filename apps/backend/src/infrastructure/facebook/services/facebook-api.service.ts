import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdAccount, FacebookAdsApi } from 'facebook-nodejs-business-sdk';
import {
  FacebookAdAccountDto,
  FacebookCampaignDto,
} from '../../../application/dtos/facebook.dto';
import { EnvVars } from '../../config/env.validation';

@Injectable()
export class FacebookApiService {
  constructor(private readonly configService: ConfigService<EnvVars, true>) {
    const accessToken = this.configService.get('FACEBOOK_ACCESS_TOKEN') || '';
    FacebookAdsApi.init(accessToken);
  }

  async getAdAccounts(): Promise<FacebookAdAccountDto[]> {
    const userId = this.configService.get('FACEBOOK_USER_ID');
    if (!userId) throw new Error('FACEBOOK_USER_ID not set');
    const fields = ['id', 'name', 'account_status', 'currency', 'business'];
    const accounts = await AdAccount.getByUserId(userId, fields);
    return accounts.map((acc: Record<string, unknown>) => ({
      id: acc['id'] as string,
      name: acc['name'] as string,
      accountStatus: acc['account_status'] as number,
      currency: acc['currency'] as string,
      business: acc['business'] as string,
    }));
  }

  async getCampaigns(adAccountId: string): Promise<FacebookCampaignDto[]> {
    const fields = ['id', 'name', 'status', 'objective'];
    const campaigns = await new AdAccount(adAccountId).getCampaigns(fields);
    return campaigns.map((c: Record<string, unknown>) => ({
      id: c['id'] as string,
      name: c['name'] as string,
      status: c['status'] as string,
      objective: c['objective'] as string,
    }));
  }
}
