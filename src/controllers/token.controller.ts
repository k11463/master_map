import {inject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  del,
  HttpErrors,
  RestBindings
} from '@loopback/rest';
import {TokenRepository} from '../repositories';

export class TokenController {
  constructor(
    @repository(TokenRepository)
    public tokenRepository: TokenRepository,
  ) {}

  @del('/logout')
  async logout(
    @inject(RestBindings.Http.REQUEST) request: any
  ): Promise<void> {
    const access_token = request.header('access_token');
    if (!access_token) {
      throw new HttpErrors[422]('Required header not found');
    }
    const token = await this.tokenRepository.findOne({
      where: {token: access_token},
    });
    if (!token) {
      throw new HttpErrors[404]('Token not found');
    }
    await this.tokenRepository.delete(token);
  }
}
