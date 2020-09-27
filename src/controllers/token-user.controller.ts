import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Token,
  User,
} from '../models';
import {TokenRepository} from '../repositories';

export class TokenUserController {
  constructor(
    @repository(TokenRepository)
    public tokenRepository: TokenRepository,
  ) { }

  @get('/tokens/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Token',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Token.prototype.token_id,
  ): Promise<User> {
    return this.tokenRepository.userid(id);
  }
}
