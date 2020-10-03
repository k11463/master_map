import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  CourseScore,
} from '../models';
import {UserRepository} from '../repositories';

export class UserCourseScoreController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/course-scores', {
    responses: {
      '200': {
        description: 'Array of User has many CourseScore',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(CourseScore)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<CourseScore>,
  ): Promise<CourseScore[]> {
    return this.userRepository.scores(id).find(filter);
  }

  @post('/users/{id}/course-scores', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(CourseScore)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.user_id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CourseScore, {
            title: 'NewCourseScoreInUser',
            exclude: ['score_id'],
            optional: ['user_id']
          }),
        },
      },
    }) courseScore: Omit<CourseScore, 'score_id'>,
  ): Promise<CourseScore> {
    return this.userRepository.scores(id).create(courseScore);
  }

  @patch('/users/{id}/course-scores', {
    responses: {
      '200': {
        description: 'User.CourseScore PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CourseScore, {partial: true}),
        },
      },
    })
    courseScore: Partial<CourseScore>,
    @param.query.object('where', getWhereSchemaFor(CourseScore)) where?: Where<CourseScore>,
  ): Promise<Count> {
    return this.userRepository.scores(id).patch(courseScore, where);
  }

  @del('/users/{id}/course-scores', {
    responses: {
      '200': {
        description: 'User.CourseScore DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(CourseScore)) where?: Where<CourseScore>,
  ): Promise<Count> {
    return this.userRepository.scores(id).delete(where);
  }
}
