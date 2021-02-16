import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { v4 as uuid } from "uuid";

import { Lesson } from "./lesson.entity";
import { CreateLessonInput } from "./lesson.input";

@Injectable()
export class LessonService {
    constructor(@InjectRepository(Lesson) private lessonRepository: Repository<Lesson>) {}

    async getLesson(id: string): Promise<Lesson> {
        const lesson = await this.lessonRepository.findOne({ id });

        if (!lesson) {
            throw new NotFoundException();
        }

        return lesson;
    }

    async getLessons(): Promise<Lesson[]> {
        return await this.lessonRepository.find({});
    }

    async createLesson(createLessonInput: CreateLessonInput): Promise<Lesson> {
        const { name, startDate, endDate, students } = createLessonInput;

        const lesson = await this.lessonRepository.create({
            id: uuid(),
            name,
            startDate,
            endDate,
            students,
        });

        return this.lessonRepository.save(lesson);
    }

    async assignStudentsToLesson(
        lessonId: string,
        studentIds: string[]
    ): Promise<Lesson> {
        const lesson = await this.lessonRepository.findOne({ id: lessonId });

        if (!lesson) {
            throw new NotFoundException();
        }

        lesson.students = [...lesson.students, ...studentIds];

        return this.lessonRepository.save(lesson);
    }
}
