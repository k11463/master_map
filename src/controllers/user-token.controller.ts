import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import jwt from 'jsonwebtoken';
import {
  Token, User
} from '../models';
import {UserRepository} from '../repositories';
export class UserTokenController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @get('/users/{id}/tokens', {
    responses: {
      '200': {
        description: 'Array of User has many Token',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Token)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Token>,
  ): Promise<Token[]> {
    return this.userRepository.tokens(id).find(filter);
  }

  @post('/users/{id}/tokens', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Token)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.user_id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Token, {
            title: 'NewTokenInUser',
            exclude: ['token_id'],
            optional: ['user_id']
          }),
        },
      },
    }) token: Omit<Token, 'token_id'>,
  ): Promise<Token> {
    let jwtToken = await jwt.sign(token.token, `${process.env.JWT_SECRET}`);
    token.token = jwtToken;
    return this.userRepository.tokens(id).create(token);
  }

  @patch('/users/{id}/tokens', {
    responses: {
      '200': {
        description: 'User.Token PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Token, {partial: true}),
        },
      },
    })
    token: Partial<Token>,
    @param.query.object('where', getWhereSchemaFor(Token)) where?: Where<Token>,
  ): Promise<Count> {
    return this.userRepository.tokens(id).patch(token, where);
  }

  @del('/users/{id}/tokens', {
    responses: {
      '200': {
        description: 'User.Token DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Token)) where?: Where<Token>,
  ): Promise<Count> {
    return this.userRepository.tokens(id).delete(where);
  }
}
