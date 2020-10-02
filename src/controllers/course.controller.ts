import {
  Filter,
  repository
} from '@loopback/repository';
import {
  del, get,
  HttpErrors, param,
  patch, post,
  requestBody
} from '@loopback/rest';
import {Course, User, UserCourse} from '../models';
import {CourseRepository, UserCourseRepository, UserRepository} from '../repositories';

export class CourseController {
  constructor(
    @repository(CourseRepository)
    public courseRepository: CourseRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCourseRepository)
    public userCourseRepository: UserCourseRepository,
  ) {}

  @post('/addCourse/{teacherId}')
  async addCourse(
    @param.path.number('teacherId') teacherId: number,
    @requestBody() course: Course
  ): Promise<Course> {
    const findUser = await this.userRepository.findOne({
      where: {user_id: teacherId}
    });
    if (findUser == null) {
      throw new HttpErrors['404']('找不到使用者');
    }
    else {
      course.teacher_id = teacherId;
      return this.courseRepository.create(course);
    }
  }

  @post('/joinCourse/{studentId}/{CourseId}')
  async joinCourse(
    @param.path.number('studentId') studentId: number,
    @param.path.number('CourseId') CourseId: number,
    @param.query.object('filter') filter_user?: Filter<User>,
    @param.query.object('filter') filter_course?: Filter<Course>
  ): Promise<Course[]> {
    const findCourse = await this.courseRepository.findOne({where: {course_id: CourseId}});
    const findCourseStudents = await this.courseRepository.students(CourseId).find(filter_user);
    if (findCourse == null) {
      throw new HttpErrors['404']('此課程不存在');
    }
    else {
      if (findCourseStudents.length < findCourse.student_limit) {
        if (findCourse.teacher_id == studentId) {
          throw new HttpErrors['404']('不能加入自己的課程');
        }
        else {
          const findSelf = await this.userCourseRepository.find({where: {student_id: studentId}});
          if (findSelf == null) {
            const userCourse: UserCourse = new UserCourse();
            userCourse.course_id = findCourse.course_id;
            userCourse.student_id = studentId;
            await this.userCourseRepository.create(userCourse);
            return this.userRepository.courses(studentId).find(filter_course);
          }
          else {
            throw new HttpErrors['404']('已經加入此課程');
          }
        }
      }
      else {
        throw new HttpErrors['404']('此課程人數已達上限');
      }
    }
  }

  @del('/removeCourse/{courseId}')
  async removeCourse(
    @param.path.number('courseId') courseId: number,
    @param.query.object('filter') filter?: Filter<Course>
  ): Promise<Course[]> {
    const findCourse = await this.courseRepository.findOne({where: {course_id: courseId}});
    if (findCourse == null) {
      throw new HttpErrors['404']('找不到課程');
    }
    else {
      await this.courseRepository.deleteById(courseId);
      return this.courseRepository.find(filter);
    }
  }

  @patch('/updateCourse/{courseId}')
  async updateCourse(
    @param.path.number('courseId') courseId: number,
    @requestBody() course: Course
  ): Promise<Course> {
    const findCourse = await this.courseRepository.findOne({
      where: {course_id: courseId}
    });
    if (findCourse == null) {
      throw new HttpErrors['404']('找不到課程');
    }
    else {
      await this.courseRepository.updateById(courseId, course);
      return this.courseRepository.findById(courseId);
    }
  }

  @get('/courses')
  async getCourse(
    @param.filter(Course) filter?: Filter<Course>,
  ): Promise<Course[]> {
    return this.courseRepository.find(filter);
  }

  @get('/courses/teacher/{userId}')
  async teacherGetCourses(
    @param.path.number('userId') userId: number,
  ): Promise<Course[]> {
    const findCourses = await this.courseRepository.find({where: {teacher_id: userId}});
    if (findCourses.length == 0) {
      throw new HttpErrors['404']('你沒有開任何課程');
    }
    else {
      return findCourses;
    }
  }

  @get('/courses/student/{userId}')
  async studentGetCourses(
    @param.path.number('userId') userId: number,
    @param.filter(Course) filter?: Filter<Course>
  ): Promise<Course[]> {
    const findCourses = await this.userRepository.courses(userId).find(filter);
    if (findCourses.length == 0) {
      throw new HttpErrors['404']('你沒有參加任何課程');
    }
    else {
      return findCourses;
    }
  }
}
