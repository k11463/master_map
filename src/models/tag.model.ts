import {Entity, model, property, hasMany} from '@loopback/repository';
import {User} from './user.model';
import {UserTag} from './user-tag.model';

@model()
export class Tag extends Entity {

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  tag_id?: number;

  @property({
    type: 'string',
    required: true,
  })
  tag_name: string;

  @hasMany(() => User, {through: {model: () => UserTag, keyFrom: 'tag_id', keyTo: 'user_id'}})
  users: User[];

  constructor(data?: Partial<Tag>) {
    super(data);
  }
}

export interface TagRelations {
  // describe navigational properties here
}

export type TagWithRelations = Tag & TagRelations;
