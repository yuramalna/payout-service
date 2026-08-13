import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { EmployeesService } from '../employees/employees.service';
import { Employee } from '../employees/employee.entity';

export interface AuthenticatedRequest extends Request {
  user: Employee;
}

/**
 * Demo-grade authentication: the caller identifies via the `x-user-id`
 * header. A real deployment would validate a signed token instead; the
 * guard exists so authorization decisions have a subject to act on.
 */
@Injectable()
export class CurrentUserGuard implements CanActivate {
  constructor(private readonly employees: EmployeesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userId = request.header('x-user-id');
    if (!userId) {
      throw new UnauthorizedException('Missing x-user-id header');
    }
    request.user = await this.employees.findById(userId);
    return true;
  }
}
