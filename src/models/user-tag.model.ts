import {Entity, model, property} from '@loopback/repository';

@model()
export class UserTag extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  userTag_id?: number;

  @property({
    type: 'number',
  })
  user_id?: number;

  @property({
    type: 'number',
  })
  tag_id?: number;

  constructor(data?: Partial<UserTag>) {
    super(data);
  }
}

export interface UserTagRelations {
  // describe navigational properties here
}

export type UserTagWithRelations = UserTag & UserTagRelations;
