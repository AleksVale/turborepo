import { Controller, Get } from '@nestjs/common';
import { GetAdAccountsUseCase } from '../../application/use-cases/facebook/get-ad-accounts.use-case';

@Controller('facebook')
export class FacebookController {
  constructor(private readonly getAdAccountsSut: GetAdAccountsUseCase) {}

  @Get('ad-accounts')
  async getAdAccounts() {
    return await this.getAdAccountsSut.execute();
  }
}
