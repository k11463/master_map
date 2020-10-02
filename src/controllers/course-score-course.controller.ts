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
  Course,
} from '../models';
import {CourseScoreRepository} from '../repositories';

export class CourseScoreCourseController {
  constructor(
    @repository(CourseScoreRepository)
    public courseScoreRepository: CourseScoreRepository,
  ) { }

  @get('/course-scores/{id}/course', {
    responses: {
      '200': {
        description: 'Course belonging to CourseScore',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Course)},
          },
        },
      },
    },
  })
  async getCourse(
    @param.path.number('id') id: typeof CourseScore.prototype.score_id,
  ): Promise<Course> {
    return this.courseScoreRepository.courseId(id);
  }
}
