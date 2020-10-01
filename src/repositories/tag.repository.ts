import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {Tag, TagRelations, User, UserTag} from '../models';
import {PgDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserTagRepository} from './user-tag.repository';
import {UserRepository} from './user.repository';

export class TagRepository extends DefaultCrudRepository<
  Tag,
  typeof Tag.prototype.tag_id,
  TagRelations
> {

  public readonly users: HasManyThroughRepositoryFactory<User, typeof User.prototype.user_id,
          UserTag,
          typeof Tag.prototype.tag_id
        >;

  constructor(
    @inject('datasources.pg') dataSource: PgDataSource, @repository.getter('UserTagRepository') protected userTagRepositoryGetter: Getter<UserTagRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Tag, dataSource);
    this.users = this.createHasManyThroughRepositoryFactoryFor('users', userRepositoryGetter, userTagRepositoryGetter,);
  }
}
