"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const users_repository_1 = require("./users.repository");
const crypto_1 = require("crypto");
function toProfile(user) {
    return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phoneNum: user.phoneNum,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}
let UsersService = class UsersService {
    usersRepo;
    constructor(usersRepo) {
        this.usersRepo = usersRepo;
    }
    create(createUserDto) {
        const normalizedEmail = createUserDto.email.trim().toLowerCase();
        const normalizedUsername = createUserDto.username.trim().toLowerCase();
        if (this.usersRepo.findByEmail(normalizedEmail)) {
            throw new common_1.BadRequestException('Email already in use');
        }
        if (this.usersRepo.findByUsername(normalizedUsername)) {
            throw new common_1.BadRequestException('Username already in use');
        }
        const user = this.usersRepo.create({
            id: (0, crypto_1.randomUUID)(),
            email: normalizedEmail,
            name: createUserDto.name.trim(),
            username: normalizedUsername,
            phoneNum: createUserDto.phoneNum,
            isActive: true,
        });
        return { message: 'User created', data: toProfile(user) };
    }
    findAll() {
        const users = this.usersRepo.findAll();
        return { data: users.map(toProfile) };
    }
    findOne(id) {
        const user = this.usersRepo.findById(id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return { data: toProfile(user) };
    }
    update(id, updateUserDto) {
        const updated = this.usersRepo.update(id, updateUserDto);
        if (!updated)
            throw new common_1.NotFoundException('User not found');
        return { message: 'User updated', data: toProfile(updated) };
    }
    remove(id) {
        const user = this.usersRepo.findById(id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        this.usersRepo.delete(id);
        return { message: 'User removed' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository])
], UsersService);
//# sourceMappingURL=users.service.js.map