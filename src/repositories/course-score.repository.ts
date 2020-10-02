import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {CourseScore, CourseScoreRelations, Course} from '../models';
import {PgDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {CourseRepository} from './course.repository';

export class CourseScoreRepository extends DefaultCrudRepository<
  CourseScore,
  typeof CourseScore.prototype.score_id,
  CourseScoreRelations
> {

  public readonly courseId: BelongsToAccessor<Course, typeof CourseScore.prototype.score_id>;

  constructor(
    @inject('datasources.pg') dataSource: PgDataSource, @repository.getter('CourseRepository') protected courseRepositoryGetter: Getter<CourseRepository>,
  ) {
    super(CourseScore, dataSource);
    this.courseId = this.createBelongsToAccessorFor('courseId', courseRepositoryGetter,);
    this.registerInclusionResolver('courseId', this.courseId.inclusionResolver);
  }
}
