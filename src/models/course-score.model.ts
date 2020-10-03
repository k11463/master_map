import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Course} from './course.model';
import {User} from './user.model';

@model()
export class CourseScore extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  score_id?: number;

  @property({
    type: 'string',
  })
  score_content?: string;

  @property({
    type: 'number',
    required: true
  })
  score: number;

  @belongsTo(() => Course, {name: 'courseId'})
  course_id: number;

  @belongsTo(() => User, {name: 'user'})
  user_id: number;

  constructor(data?: Partial<CourseScore>) {
    super(data);
  }
}

export interface CourseScoreRelations {
  // describe navigational properties here
}

export type CourseScoreWithRelations = CourseScore & CourseScoreRelations;
