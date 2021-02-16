import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { StudentService } from "../student/student.service";
import { AssignStudentsToLessonInput } from "./assign-students-to-lesson.input";
import { Lesson } from "./lesson.entity";
import { CreateLessonInput } from "./lesson.input";
import { LessonService } from "./lesson.service";
import { LessonType } from "./lesson.type";

@Resolver(() => LessonType)
export class LessonResolver {
    constructor(
        private lessonService: LessonService,
        private studentService: StudentService
    ) {}

    @Query(() => LessonType)
    lesson(@Args("id") id: string): Promise<Lesson> {
        return this.lessonService.getLesson(id);
    }

    @Query(() => [LessonType])
    lessons(): Promise<Lesson[]> {
        return this.lessonService.getLessons();
    }

    @Mutation(() => LessonType)
    createLesson(@Args("createLessonInput") createLessonInput: CreateLessonInput) {
        return this.lessonService.createLesson(createLessonInput);
    }

    @Mutation(() => LessonType)
    assignStudentsToLesson(
        @Args("assignStudentsToLessonInput")
        assignStudentsToLessonInput: AssignStudentsToLessonInput
    ) {
        const { lessonId, studentIds } = assignStudentsToLessonInput;

        return this.lessonService.assignStudentsToLesson(lessonId, studentIds);
    }

    @ResolveField()
    students(@Parent() lesson: Lesson) {
        return this.studentService.getManyStudents(lesson.students);
    }
}
