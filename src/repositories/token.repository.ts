import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Token, TokenRelations, User} from '../models';
import {PgDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class TokenRepository extends DefaultCrudRepository<
  Token,
  typeof Token.prototype.token_id,
  TokenRelations
> {

  public readonly userid: BelongsToAccessor<User, typeof Token.prototype.token_id>;

  constructor(
    @inject('datasources.pg') dataSource: PgDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Token, dataSource);
    this.userid = this.createBelongsToAccessorFor('userid', userRepositoryGetter,);
    this.registerInclusionResolver('userid', this.userid.inclusionResolver);
  }
}
