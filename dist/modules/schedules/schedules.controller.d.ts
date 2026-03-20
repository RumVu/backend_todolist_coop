import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
export declare class SchedulesController {
    private readonly schedulesService;
    constructor(schedulesService: SchedulesService);
    create(createScheduleDto: CreateScheduleDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateScheduleDto: UpdateScheduleDto): string;
    remove(id: string): string;
}
