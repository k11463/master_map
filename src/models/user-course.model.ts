import {Entity, model, property} from '@loopback/repository';

@model()
export class UserCourse extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  userCourse_id?: number;

  @property({
    type: 'number',
  })
  student_id?: number;

  @property({
    type: 'number',
  })
  course_id?: number;

  constructor(data?: Partial<UserCourse>) {
    super(data);
  }
}

export interface UserCourseRelations {
  // describe navigational properties here
}

export type UserCourseWithRelations = UserCourse & UserCourseRelations;
