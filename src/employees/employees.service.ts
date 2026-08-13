import { Injectable, NotFoundException } from '@nestjs/common';
import { Employee } from './employee.entity';

const SEED_EMPLOYEES: Employee[] = [
  {
    id: 'emp-001',
    name: 'Dana Kovach',
    email: 'dana.kovach@example.com',
    role: 'employee',
    teamId: 'team-platform',
    managerId: 'emp-010',
    country: 'UA',
  },
  {
    id: 'emp-002',
    name: 'Omar Haddad',
    email: 'omar.haddad@example.com',
    role: 'employee',
    teamId: 'team-platform',
    managerId: 'emp-010',
    country: 'AE',
  },
  {
    id: 'emp-003',
    name: 'Priya Nair',
    email: 'priya.nair@example.com',
    role: 'employee',
    teamId: 'team-payments',
    managerId: 'emp-011',
    country: 'IN',
  },
  {
    id: 'emp-010',
    name: 'Marta Silva',
    email: 'marta.silva@example.com',
    role: 'manager',
    teamId: 'team-platform',
    managerId: null,
    country: 'PT',
  },
  {
    id: 'emp-011',
    name: 'Ken Watanabe',
    email: 'ken.watanabe@example.com',
    role: 'manager',
    teamId: 'team-payments',
    managerId: null,
    country: 'JP',
  },
  {
    id: 'emp-020',
    name: 'Lena Fischer',
    email: 'lena.fischer@example.com',
    role: 'finance',
    teamId: 'team-finance',
    managerId: null,
    country: 'DE',
  },
];

@Injectable()
export class EmployeesService {
  private readonly employees = new Map<string, Employee>(
    SEED_EMPLOYEES.map((employee) => [employee.id, employee]),
  );

  async findById(id: string): Promise<Employee> {
    const employee = this.employees.get(id);
    if (!employee) {
      throw new NotFoundException(`Employee ${id} not found`);
    }
    return employee;
  }

  async findByIds(ids: string[]): Promise<Map<string, Employee>> {
    const result = new Map<string, Employee>();
    for (const id of new Set(ids)) {
      const employee = this.employees.get(id);
      if (employee) {
        result.set(id, employee);
      }
    }
    return result;
  }

  async findDirectReports(managerId: string): Promise<Employee[]> {
    return [...this.employees.values()].filter(
      (employee) => employee.managerId === managerId,
    );
  }
}
