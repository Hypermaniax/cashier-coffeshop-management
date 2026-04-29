export interface CreateUserDto {
  name: string;
  username: string;
  pin: string;
  password: string;
  role: string;
  roleId: number;
  isActive: boolean;
}
