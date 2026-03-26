import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): {
        message: string;
        data: {
            id: any;
            name: any;
            username: any;
            email: any;
            phoneNum: any;
            isActive: any;
            createdAt: any;
            updatedAt: any;
        };
    };
    findAll(): {
        data: {
            id: any;
            name: any;
            username: any;
            email: any;
            phoneNum: any;
            isActive: any;
            createdAt: any;
            updatedAt: any;
        }[];
    };
    findOne(id: string): {
        data: {
            id: any;
            name: any;
            username: any;
            email: any;
            phoneNum: any;
            isActive: any;
            createdAt: any;
            updatedAt: any;
        };
    };
    update(id: string, updateUserDto: UpdateUserDto): {
        message: string;
        data: {
            id: any;
            name: any;
            username: any;
            email: any;
            phoneNum: any;
            isActive: any;
            createdAt: any;
            updatedAt: any;
        };
    };
    remove(id: string): {
        message: string;
    };
}
