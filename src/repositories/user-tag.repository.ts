import {DefaultCrudRepository} from '@loopback/repository';
import {UserTag, UserTagRelations} from '../models';
import {PgDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UserTagRepository extends DefaultCrudRepository<
  UserTag,
  typeof UserTag.prototype.userTag_id,
  UserTagRelations
> {
  constructor(
    @inject('datasources.pg') dataSource: PgDataSource,
  ) {
    super(UserTag, dataSource);
  }
}
