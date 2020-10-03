import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {PgDataSource} from '../datasources';
import {Course, CourseScore, CourseScoreRelations, User} from '../models';
import {CourseRepository} from './course.repository';
import {UserRepository} from './user.repository';

export class CourseScoreRepository extends DefaultCrudRepository<
  CourseScore,
  typeof CourseScore.prototype.score_id,
  CourseScoreRelations
  > {

  public readonly courseId: BelongsToAccessor<Course, typeof CourseScore.prototype.score_id>;

  public readonly user: BelongsToAccessor<User, typeof CourseScore.prototype.score_id>;

  constructor(
    @inject('datasources.pg') dataSource: PgDataSource, @repository.getter('CourseRepository') protected courseRepositoryGetter: Getter<CourseRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(CourseScore, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.courseId = this.createBelongsToAccessorFor('courseId', courseRepositoryGetter,);
    this.registerInclusionResolver('courseId', this.courseId.inclusionResolver);
  }
}
