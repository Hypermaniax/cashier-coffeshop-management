export interface AuthPayload {
  role: string;
  id: string;
  name: string;
  isActive: boolean;
}

export interface CreateUserDto {
  name: string;
  username: string;
  password: string;
  roleId: number;
  isActive: boolean;
}

export interface CreateEmployeeDto {
  name: string;
  username: string;
  password: string;
  roleId: number;
  isActive: boolean;
}

export interface UpdateEmployeeDto {
  name: string;
  username: string;
  password?: string;
  roleId: number;
  isActive: boolean;
}

export interface CreateProductDto {
  name: string;
  price: number;
  stock: number;
  image?: string | null;
  categoryId: number;
  isActive: boolean;
}

export interface UpdateProductDto {
  name: string;
  price: number;
  stock: number;
  image?: string | null;
  categoryId: number;
  isActive: boolean;
}
export interface ProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  product?: Product;
}

export interface EmployeeFormDialogProps {
  open: boolean;
  onClose: () => void;
  roles: Role[];
  employee?: User;
}

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string | null;
  categoryId: number;
  isActive: boolean;
};

export type Category = { id: number; name: string };

export interface UserTableProps {
  users: User[];
  roles: Role[];
}

export type User = {
  id: string;
  name: string;
  username: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
};

type Role = {
  id: number;
  name: string;
};
