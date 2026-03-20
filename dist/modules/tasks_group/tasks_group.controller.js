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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksGroupController = void 0;
const common_1 = require("@nestjs/common");
const tasks_group_service_1 = require("./tasks_group.service");
const create_tasks_group_dto_1 = require("./dto/create-tasks_group.dto");
const update_tasks_group_dto_1 = require("./dto/update-tasks_group.dto");
let TasksGroupController = class TasksGroupController {
    tasksGroupService;
    constructor(tasksGroupService) {
        this.tasksGroupService = tasksGroupService;
    }
    create(createTasksGroupDto) {
        return this.tasksGroupService.create(createTasksGroupDto);
    }
    findAll() {
        return this.tasksGroupService.findAll();
    }
    findOne(id) {
        return this.tasksGroupService.findOne(+id);
    }
    update(id, updateTasksGroupDto) {
        return this.tasksGroupService.update(+id, updateTasksGroupDto);
    }
    remove(id) {
        return this.tasksGroupService.remove(+id);
    }
};
exports.TasksGroupController = TasksGroupController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tasks_group_dto_1.CreateTasksGroupDto]),
    __metadata("design:returntype", void 0)
], TasksGroupController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TasksGroupController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TasksGroupController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_tasks_group_dto_1.UpdateTasksGroupDto]),
    __metadata("design:returntype", void 0)
], TasksGroupController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TasksGroupController.prototype, "remove", null);
exports.TasksGroupController = TasksGroupController = __decorate([
    (0, common_1.Controller)('tasks-group'),
    __metadata("design:paramtypes", [tasks_group_service_1.TasksGroupService])
], TasksGroupController);
//# sourceMappingURL=tasks_group.controller.js.map