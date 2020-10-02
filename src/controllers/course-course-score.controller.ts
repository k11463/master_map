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
  Course,
  CourseScore,
} from '../models';
import {CourseRepository} from '../repositories';

export class CourseCourseScoreController {
  constructor(
    @repository(CourseRepository) protected courseRepository: CourseRepository,
  ) { }

  @get('/courses/{id}/course-scores', {
    responses: {
      '200': {
        description: 'Array of Course has many CourseScore',
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
    return this.courseRepository.scores(id).find(filter);
  }

  @post('/courses/{id}/course-scores', {
    responses: {
      '200': {
        description: 'Course model instance',
        content: {'application/json': {schema: getModelSchemaRef(CourseScore)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Course.prototype.course_id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CourseScore, {
            title: 'NewCourseScoreInCourse',
            exclude: ['score_id'],
            optional: ['course_id']
          }),
        },
      },
    }) courseScore: Omit<CourseScore, 'score_id'>,
  ): Promise<CourseScore> {
    return this.courseRepository.scores(id).create(courseScore);
  }

  @patch('/courses/{id}/course-scores', {
    responses: {
      '200': {
        description: 'Course.CourseScore PATCH success count',
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
    return this.courseRepository.scores(id).patch(courseScore, where);
  }

  @del('/courses/{id}/course-scores', {
    responses: {
      '200': {
        description: 'Course.CourseScore DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(CourseScore)) where?: Where<CourseScore>,
  ): Promise<Count> {
    return this.courseRepository.scores(id).delete(where);
  }
}
