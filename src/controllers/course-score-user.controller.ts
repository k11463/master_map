import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  CourseScore,
  User,
} from '../models';
import {CourseScoreRepository} from '../repositories';

export class CourseScoreUserController {
  constructor(
    @repository(CourseScoreRepository)
    public courseScoreRepository: CourseScoreRepository,
  ) { }

  @get('/course-scores/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to CourseScore',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof CourseScore.prototype.score_id,
  ): Promise<User> {
    return this.courseScoreRepository.user(id);
  }
}
