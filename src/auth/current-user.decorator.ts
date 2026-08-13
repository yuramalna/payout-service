import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Employee } from '../employees/employee.entity';
import { AuthenticatedRequest } from './current-user.guard';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Employee => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);
