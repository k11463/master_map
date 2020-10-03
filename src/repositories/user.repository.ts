import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {User, UserRelations, Token, Tag, UserTag, Course, UserCourse, CourseScore} from '../models';
import {PgDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {TokenRepository} from './token.repository';
import {UserTagRepository} from './user-tag.repository';
import {TagRepository} from './tag.repository';
import {UserCourseRepository} from './user-course.repository';
import {CourseRepository} from './course.repository';
import {CourseScoreRepository} from './course-score.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.user_id,
  UserRelations
> {

  public readonly tokens: HasManyRepositoryFactory<Token, typeof User.prototype.user_id>;

  public readonly tags: HasManyThroughRepositoryFactory<Tag, typeof Tag.prototype.tag_id,
          UserTag,
          typeof User.prototype.user_id
        >;

  public readonly courses: HasManyThroughRepositoryFactory<Course, typeof Course.prototype.course_id,
          UserCourse,
          typeof User.prototype.user_id
        >;

  public readonly scores: HasManyRepositoryFactory<CourseScore, typeof User.prototype.user_id>;

  constructor(
    @inject('datasources.pg') dataSource: PgDataSource, @repository.getter('TokenRepository') protected tokenRepositoryGetter: Getter<TokenRepository>, @repository.getter('UserTagRepository') protected userTagRepositoryGetter: Getter<UserTagRepository>, @repository.getter('TagRepository') protected tagRepositoryGetter: Getter<TagRepository>, @repository.getter('UserCourseRepository') protected userCourseRepositoryGetter: Getter<UserCourseRepository>, @repository.getter('CourseRepository') protected courseRepositoryGetter: Getter<CourseRepository>, @repository.getter('CourseScoreRepository') protected courseScoreRepositoryGetter: Getter<CourseScoreRepository>,
  ) {
    super(User, dataSource);
    this.scores = this.createHasManyRepositoryFactoryFor('scores', courseScoreRepositoryGetter,);
    this.registerInclusionResolver('scores', this.scores.inclusionResolver);
    this.courses = this.createHasManyThroughRepositoryFactoryFor('courses', courseRepositoryGetter, userCourseRepositoryGetter,);
    this.tags = this.createHasManyThroughRepositoryFactoryFor('tags', tagRepositoryGetter, userTagRepositoryGetter,);
    this.tokens = this.createHasManyRepositoryFactoryFor('tokens', tokenRepositoryGetter,);
    this.registerInclusionResolver('tokens', this.tokens.inclusionResolver);
  }
}
