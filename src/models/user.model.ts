import {Entity, hasMany, model, property} from '@loopback/repository';
import {Token} from './token.model';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  user_id?: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      format: "email",
      errorMessage: "Email格式錯誤。",
    }
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 8,
      maxLength: 16,
      pattern: '^[A-Z]',
      errorMessage: {
        minLength: '密碼最少為8個字元',
        maxLength: '密碼不可超過16個字元',
        pattern: '密碼第一個字請為英文大寫'
      }
    }
  })
  password: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 10,
      pattern: '09\\d',
      errorMessage: {
        maxLength: '電話號碼不可超過10碼',
        pattern: '電話號碼必須是數字，格式為09開頭'
      }
    }
  })
  phone_number: string;

  @property({
    type: 'boolean',
    default: false,
  })
  master_confirm?: boolean;

  @hasMany(() => Token, {keyTo: 'user_id'})
  tokens: Token[];

  @property({
    type: 'number',
  })
  userTag_id?: number;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
