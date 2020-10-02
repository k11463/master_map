import {
  Filter,
  repository
} from '@loopback/repository';
import {
  del,
  get,
  HttpErrors, param,
  post,
  requestBody
} from '@loopback/rest';
import {
  Tag, User, UserTag
} from '../models';
import {TagRepository, UserRepository, UserTagRepository} from '../repositories';

export class UserTagController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(TagRepository) protected tagRepository: TagRepository,
    @repository(UserTagRepository) protected userTagRepository: UserTagRepository,
  ) {}

  @get('/userTags/{userId}')
  async findUserTags(
    @param.path.number('userId') userId: number,
    @param.query.object('filter') filter?: Filter<Tag>,
  ): Promise<Tag[]> {
    return this.userRepository.tags(userId).find(filter);
  }

  @post('/addTag/{userId}')
  async addTag(
    @param.path.number('userId') userId: typeof User.prototype.user_id,
    @requestBody() tag: Tag,
    @param.query.object('filter') filter?: Filter<Tag>,
  ): Promise<Tag[]> {
    const findUser = await this.userRepository.findOne({
      where: {user_id: userId}
    });
    if (findUser == null) {
      throw new HttpErrors['404']('沒有這個使用者');
    }
    else {
      const findTag = await this.tagRepository.findOne({
        where: {tag_name: tag.tag_name}
      });
      if (findTag == null) {
        await this.userRepository.tags(userId).create(tag);
        return this.userRepository.tags(userId).find(filter);
      }
      else {
        const findUserTags = await this.userRepository.tags(userId).find({
          where: {tag_name: findTag.tag_name}
        });
        if (findUserTags.length == 0) {
          const newUserTag: UserTag = new UserTag();
          newUserTag.user_id = findUser.user_id;
          newUserTag.tag_id = findTag.tag_id;
          await this.userTagRepository.create(newUserTag);
          return this.userRepository.tags(userId).find(filter);
        }
        else {
          throw new HttpErrors['404']('使用者已經有此TAG');
        }
      }
    }
  }

  @del('/removeTag/{userId}/{tag_name}')
  async removeTag(
    @param.path.number('userId') userId: number,
    @param.path.string('tag_name') tag_name: string,
    @param.query.object('filter') filter?: Filter<Tag>,
  ): Promise<Tag[]> {
    const findUser = await this.userRepository.findOne({
      where: {user_id: userId}
    });
    if (findUser == null) {
      throw new HttpErrors['404']('找不到使用者');
    }
    else {
      const findTag = await this.tagRepository.findOne({
        where: {tag_name: tag_name}
      });
      if (findTag == null) {
        throw new HttpErrors['404']('找不到此TAG');
      }
      else {
        const findUserTag = await this.userTagRepository.findOne({
          where: {user_id: userId, tag_id: findTag.tag_id}
        });
        if (findUserTag == null) {
          throw new HttpErrors['404']('使用者沒有此TAG');
        }
        else {
          await this.userTagRepository.deleteById(findUserTag.userTag_id);
          return this.userRepository.tags(userId).find(filter);
        }
      }
    }
  }

  @get('/tagUsers/{tagId}')
  async findTagUsers(
    @param.path.number('tagId') tagId: number,
    @param.query.object('filter') filter?: Filter<User>,
  ): Promise<User[]> {
    return this.tagRepository.users(tagId).find(filter);
  }
}
