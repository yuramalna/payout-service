export type EmployeeRole = 'employee' | 'manager' | 'finance';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: EmployeeRole;
  teamId: string;
  managerId: string | null;
  country: string;
}
