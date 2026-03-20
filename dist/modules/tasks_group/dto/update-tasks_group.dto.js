"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTasksGroupDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_tasks_group_dto_1 = require("./create-tasks_group.dto");
class UpdateTasksGroupDto extends (0, mapped_types_1.PartialType)(create_tasks_group_dto_1.CreateTasksGroupDto) {
}
exports.UpdateTasksGroupDto = UpdateTasksGroupDto;
//# sourceMappingURL=update-tasks_group.dto.js.map