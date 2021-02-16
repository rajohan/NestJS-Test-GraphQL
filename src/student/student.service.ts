import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { v4 as uuid } from "uuid";

import { CreateStudentInput } from "./create-student.input";
import { Student } from "./student.entity";

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student) private studentRepository: Repository<Student>
    ) {}

    async getStudent(id: string): Promise<Student> {
        const student = await this.studentRepository.findOne({ id });

        if (!student) {
            throw new NotFoundException();
        }

        return student;
    }

    async getStudents(): Promise<Student[]> {
        return await this.studentRepository.find({});
    }

    async createStudent(createStudentInput: CreateStudentInput): Promise<Student> {
        const { firstName, lastName } = createStudentInput;

        const student = this.studentRepository.create({
            id: uuid(),
            firstName: firstName,
            lastName: lastName,
        });

        return await this.studentRepository.save(student);
    }

    async getManyStudents(studentIds: string[]): Promise<Student[]> {
        return await this.studentRepository.find({
            where: {
                id: {
                    $in: studentIds,
                },
            },
        });
    }
}
