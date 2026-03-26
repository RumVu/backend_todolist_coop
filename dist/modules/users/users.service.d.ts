import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
export declare class UsersService {
    private readonly usersRepo;
    constructor(usersRepo: UsersRepository);
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
