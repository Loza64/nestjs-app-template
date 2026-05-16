import { Request } from 'express';
import { User } from 'src/modules/user/domain/entity/user.entity';

export interface RequestResponse extends Request {
  user: User;
}
