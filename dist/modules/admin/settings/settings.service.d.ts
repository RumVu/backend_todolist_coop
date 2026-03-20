import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
export declare class SettingsService {
    create(createSettingDto: CreateSettingDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateSettingDto: UpdateSettingDto): string;
    remove(id: number): string;
}
