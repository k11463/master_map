import {
  repository
} from '@loopback/repository';
import {
  get, HttpErrors, param,
  post, requestBody
} from '@loopback/rest';
import {CourseScore} from '../models';
import {CourseRepository, CourseScoreRepository} from '../repositories';

export class CourseScoreCourseController {
  constructor(
    @repository(CourseScoreRepository)
    public courseScoreRepository: CourseScoreRepository,
    @repository(CourseRepository)
    public courseRepository: CourseRepository,
  ) {}

  @post('/addScore/{courseId}/{userId}')
  async addCourse(
    @param.path.number('courseId') courseId: number,
    @param.path.number('userId') userId: number,
    @requestBody() score: CourseScore
  ): Promise<CourseScore> {
    const findCourse = await this.courseRepository.findOne({where: {course_id: courseId}});
    if (findCourse == null) {
      throw new HttpErrors['404']('找不到課程');
    }
    else {
      score.course_id = courseId;
      score.user_id = userId;
      return this.courseRepository.scores(courseId).create(score);
    }
  }

  @get('/score/{courseId}')
  async score(@param.path.number('courseId') courseId: number): Promise<CourseScore> {
    const findScore = await this.courseScoreRepository.findOne({where: {course_id: courseId}});
    if (findScore == null) {
      throw new HttpErrors['404']('此課程沒有半個留言');
    }
    else {
      return findScore;
    }
  }
}
