import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyThroughRepositoryFactory, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {PgDataSource} from '../datasources';
import {Course, CourseRelations, User, UserCourse, CourseScore} from '../models';
import {UserCourseRepository} from './user-course.repository';
import {UserRepository} from './user.repository';
import {CourseScoreRepository} from './course-score.repository';

export class CourseRepository extends DefaultCrudRepository<
  Course,
  typeof Course.prototype.course_id,
  CourseRelations
  > {

  public readonly students: HasManyThroughRepositoryFactory<User, typeof User.prototype.user_id,
    UserCourse,
    typeof Course.prototype.course_id
  >;

  public readonly scores: HasManyRepositoryFactory<CourseScore, typeof Course.prototype.course_id>;

  constructor(
    @inject('datasources.pg') dataSource: PgDataSource, @repository.getter('UserCourseRepository') protected userCourseRepositoryGetter: Getter<UserCourseRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('CourseScoreRepository') protected courseScoreRepositoryGetter: Getter<CourseScoreRepository>,
  ) {
    super(Course, dataSource);
    this.scores = this.createHasManyRepositoryFactoryFor('scores', courseScoreRepositoryGetter,);
    this.registerInclusionResolver('scores', this.scores.inclusionResolver);
    this.students = this.createHasManyThroughRepositoryFactoryFor('students', userRepositoryGetter, userCourseRepositoryGetter,);
  }
}
