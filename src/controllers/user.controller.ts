import {
  Filter,
  FilterExcludingWhere,
  repository
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef,
  HttpErrors, param,
  patch, post,
  put,
  requestBody
} from '@loopback/rest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Login, Token, User} from '../models';
import {TokenRepository, UserRepository} from '../repositories';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(TokenRepository)
    public tokenRepository: TokenRepository
  ) {}

  @post('/login')
  async singin(
    @requestBody() login: Login
  ): Promise<Token> {
    const findUser = await this.userRepository.findOne({
      where: {email: login.email}
    })
    if (findUser == null) {
      throw new HttpErrors[404]('User not found');
    }
    else {
      const passwordMatch = await bcrypt.compare(login.password, findUser?.password);
      if (passwordMatch) {
        let createdToken = await jwt.sign(login.password, `${process.env.JWT_SECRET}`);
        const token: Token = new Token();
        token.user_id = findUser.user_id!;
        token.token = createdToken;
        return this.userRepository.tokens(findUser.user_id).create(token);
      }
      else {
        throw new HttpErrors[404]('Password Wrong');
      }
    }
  }

  @post('/signup')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['user_id'],
          }),
        },
      },
    })
    user: User,
  ): Promise<User> {
    let hashedPwd = await bcrypt.hash(user.password, 10);
    user.password = hashedPwd;
    return this.userRepository.create(user);
  }

  @get('/users')
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}')
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
