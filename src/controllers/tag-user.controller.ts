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
import {
  Tag,

  User
} from '../models';
import {TagRepository} from '../repositories';

export class TagUserController {
  constructor(
    @repository(TagRepository) protected tagRepository: TagRepository,
  ) {}

  @get('/tagUsers/{tagId}')
  async find(
    @param.path.number('tagId') tagId: number,
    @param.query.object('filter') filter?: Filter<User>,
  ): Promise<User[]> {
    return this.tagRepository.users(tagId).find(filter);
  }

  @post('/tags/{id}/users', {
    responses: {
      '200': {
        description: 'create a User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Tag.prototype.tag_id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUserInTag',
            exclude: ['user_id'],
          }),
        },
      },
    }) user: Omit<User, 'user_id'>,
  ): Promise<User> {
    return this.tagRepository.users(id).create(user);
  }

  @patch('/tags/{id}/users', {
    responses: {
      '200': {
        description: 'Tag.User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: Partial<User>,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.tagRepository.users(id).patch(user, where);
  }

  @del('/tags/{id}/users', {
    responses: {
      '200': {
        description: 'Tag.User DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.tagRepository.users(id).delete(where);
  }
}
