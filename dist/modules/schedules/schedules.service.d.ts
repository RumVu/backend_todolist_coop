import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
export declare class SchedulesService {
    create(createScheduleDto: CreateScheduleDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateScheduleDto: UpdateScheduleDto): string;
    remove(id: number): string;
}
