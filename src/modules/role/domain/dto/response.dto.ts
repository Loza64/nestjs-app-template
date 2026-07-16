import { BaseResponse } from "src/common/dto/base-response.dto";
import { PermissionResponseDto } from "src/modules/permission/domain/dto/response.dto";

export class RoleResponseDto extends BaseResponse {
  name?: string;
  description?: string;
  permissions!: PermissionResponseDto[];
}
