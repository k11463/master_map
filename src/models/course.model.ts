import {Entity, hasMany, model, property} from '@loopback/repository';
import {CourseScore} from './course-score.model';
import {UserCourse} from './user-course.model';
import {User} from './user.model';

@model()
export class Course extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  course_id?: number;

  @property({
    type: 'string',
    required: true,
  })
  course_name: string;

  @property({
    type: 'string',
    required: true,
  })
  course_description: string;

  @property({
    type: 'string',
    required: true,
  })
  startTime: string;

  @property({
    type: 'string',
    required: true,
  })
  endTime: string;

  @property({
    type: 'string',
    required: true,
  })
  location: string;

  @property({
    type: 'number'
  })
  teacher_id?: number;

  @property({
    type: 'number',
    required: true,
  })
  student_limit: number;

  @hasMany(() => User, {through: {model: () => UserCourse, keyFrom: 'course_id', keyTo: 'student_id'}})
  students: User[];

  @hasMany(() => CourseScore, {keyTo: 'course_id'})
  scores: CourseScore[];

  constructor(data?: Partial<Course>) {
    super(data);
  }
}

export interface CourseRelations {
  // describe navigational properties here
}

export type CourseWithRelations = Course & CourseRelations;
