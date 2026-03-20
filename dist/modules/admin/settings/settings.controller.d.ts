import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    create(createSettingDto: CreateSettingDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateSettingDto: UpdateSettingDto): string;
    remove(id: string): string;
}
