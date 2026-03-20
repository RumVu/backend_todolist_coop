"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksGroupService = void 0;
const common_1 = require("@nestjs/common");
let TasksGroupService = class TasksGroupService {
    create(createTasksGroupDto) {
        void createTasksGroupDto;
        return 'This action adds a new tasksGroup';
    }
    findAll() {
        return `This action returns all tasksGroup`;
    }
    findOne(id) {
        return `This action returns a #${id} tasksGroup`;
    }
    update(id, updateTasksGroupDto) {
        void updateTasksGroupDto;
        return `This action updates a #${id} tasksGroup`;
    }
    remove(id) {
        return `This action removes a #${id} tasksGroup`;
    }
};
exports.TasksGroupService = TasksGroupService;
exports.TasksGroupService = TasksGroupService = __decorate([
    (0, common_1.Injectable)()
], TasksGroupService);
//# sourceMappingURL=tasks_group.service.js.map