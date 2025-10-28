import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleAdsApi } from 'google-ads-api';
import {
  GoogleAdsCampaignDto,
  GoogleAdsCustomerDto,
} from '../../../application/dtos/google-ads.dto';
import { EnvVars } from '../../config/env.validation';

@Injectable()
export class GoogleAdsApiService {
  private readonly client: GoogleAdsApi;

  constructor(private readonly configService: ConfigService<EnvVars, true>) {
    const clientId = this.configService.get('GOOGLE_ADS_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_ADS_CLIENT_SECRET');
    const developerToken = this.configService.get('GOOGLE_ADS_DEVELOPER_TOKEN');
    if (!clientId || !clientSecret || !developerToken) {
      throw new Error('Google Ads credentials are not set');
    }
    this.client = new GoogleAdsApi({
      client_id: clientId,
      client_secret: clientSecret,
      developer_token: developerToken,
    });
  }

  async listCustomers(): Promise<GoogleAdsCustomerDto[]> {
    const refreshToken = this.configService.get('GOOGLE_ADS_REFRESH_TOKEN');
    if (!refreshToken) throw new Error('Google Ads refresh token not set');
    const response = await this.client.listAccessibleCustomers(refreshToken);
    // SDK retorna { resource_names: string[] }
    if (!response || !Array.isArray(response.resource_names)) return [];
    // resource_names: ['customers/1234567890', ...]
    return response.resource_names.map((resource: string) => {
      const id = resource.replace('customers/', '');
      // O Google Ads API não retorna dados detalhados aqui, só o id. Para buscar detalhes, seria necessário outra chamada.
      return {
        id,
        descriptiveName: '',
        currencyCode: '',
        timeZone: '',
      };
    });
  }

  async listCampaigns(customerId: string): Promise<GoogleAdsCampaignDto[]> {
    const refreshToken = this.configService.get('GOOGLE_ADS_REFRESH_TOKEN');
    if (!refreshToken) throw new Error('Google Ads refresh token not set');
    const customer = this.client.Customer({
      customer_id: customerId,
      refresh_token: refreshToken,
    });
    // Busca campanhas via query
    const response = await customer.query(
      `SELECT campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type FROM campaign`
    );
    if (!response || !Array.isArray(response)) return [];
    return response.map((c) => {
      const campaign = c.campaign ?? {};
      return {
        id: String(campaign.id ?? ''),
        name: String(campaign.name ?? ''),
        status: String(campaign.status ?? ''),
        advertisingChannelType: String(campaign.advertising_channel_type ?? ''),
      };
    });
  }
}
