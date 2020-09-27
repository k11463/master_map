import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Token extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  token_id?: number;

  @property({
    type: 'string',
    required: true,
  })
  token: string;

  @belongsTo(() => User, {name: 'userid'})
  user_id: number;

  constructor(data?: Partial<Token>) {
    super(data);
  }
}

export interface TokenRelations {
  // describe navigational properties here
}

export type TokenWithRelations = Token & TokenRelations;
