import { ConfigService } from '../config.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
export declare class ConfigController {
    private readonly configService;
    constructor(configService: ConfigService);
    create(createConfigDto: CreateConfigDto): any;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, updateConfigDto: UpdateConfigDto): any;
    remove(id: string): any;
}
