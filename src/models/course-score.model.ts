import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Course} from './course.model';

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

  @belongsTo(() => Course, {name: 'courseId'})
  course_id: number;

  constructor(data?: Partial<CourseScore>) {
    super(data);
  }
}

export interface CourseScoreRelations {
  // describe navigational properties here
}

export type CourseScoreWithRelations = CourseScore & CourseScoreRelations;
