import { Injectable } from '@nestjs/common';
import { FacebookApiService } from '../../../infrastructure/facebook/services/facebook-api.service';

@Injectable()
export class GetAdAccountsUseCase {
  constructor(private readonly facebookApi: FacebookApiService) {}

  async execute(): Promise<any> {
    return await this.facebookApi.getAdAccounts();
  }
}
