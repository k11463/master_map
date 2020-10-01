import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {User, UserRelations, Token, Tag, UserTag} from '../models';
import {PgDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {TokenRepository} from './token.repository';
import {UserTagRepository} from './user-tag.repository';
import {TagRepository} from './tag.repository';

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

  constructor(
    @inject('datasources.pg') dataSource: PgDataSource, @repository.getter('TokenRepository') protected tokenRepositoryGetter: Getter<TokenRepository>, @repository.getter('UserTagRepository') protected userTagRepositoryGetter: Getter<UserTagRepository>, @repository.getter('TagRepository') protected tagRepositoryGetter: Getter<TagRepository>,
  ) {
    super(User, dataSource);
    this.tags = this.createHasManyThroughRepositoryFactoryFor('tags', tagRepositoryGetter, userTagRepositoryGetter,);
    this.tokens = this.createHasManyRepositoryFactoryFor('tokens', tokenRepositoryGetter,);
    this.registerInclusionResolver('tokens', this.tokens.inclusionResolver);
  }
}
