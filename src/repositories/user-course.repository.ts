import {DefaultCrudRepository} from '@loopback/repository';
import {UserCourse, UserCourseRelations} from '../models';
import {PgDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UserCourseRepository extends DefaultCrudRepository<
  UserCourse,
  typeof UserCourse.prototype.userCourse_id,
  UserCourseRelations
> {
  constructor(
    @inject('datasources.pg') dataSource: PgDataSource,
  ) {
    super(UserCourse, dataSource);
  }
}
