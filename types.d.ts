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
  image?: File | string | null;
  categoryId: number;
  isActive: boolean;
  modifierGroupIds?: string[];
}

export interface UpdateProductDto {
  name: string;
  price: number;
  stock: number;
  image?: File | string | null;
  categoryId: number;
  isActive: boolean;
  modifierGroupIds?: string[];
}
export interface ProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  modifierGroups: ModifierGroup[];
  product?: Product;
}

export interface EmployeeFormDialogProps {
  open: boolean;
  onClose: () => void;
  roles: Role[];
  employee?: User;
}

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

export interface CreateModifierOptionDto {
  id?: string;
  name: string;
  additionalPrice: number;
}

export interface CreateModifierGroupDto {
  name: string;
  isRequired: boolean;
  isMultiple: boolean;
  options: CreateModifierOptionDto[];
}

export interface UpdateModifierGroupDto extends CreateModifierGroupDto {}

export type ModifierOption = {
  id: string;
  name: string;
  additionalPrice: number;
  modifierGroupId: string;
};

export type ModifierGroup = {
  id: string;
  name: string;
  isRequired: boolean;
  isMultiple: boolean;
  options: ModifierOption[];
};

export interface ModifierFormDialogProps {
  open: boolean;
  onClose: () => void;
  modifierGroup?: ModifierGroup;
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string | null;
  categoryId: number;
  isActive: boolean;
  modifierGroups?: ModifierGroup[];
}

export interface CartItemModifier {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  additionalPrice: number;
}

export interface CartItem {
  id: string; // Unique ID for cart item (since same product can have different modifiers)
  product: Product;
  quantity: number;
  selectedModifiers: CartItemModifier[];
  subtotal: number;
}

export interface DashboardChartProps {
  weeklyRevenue: { date: string; revenue: number }[];
  maxRevenue: number;
}

export interface DashboardTopProductsProps {
  products: { name: string; totalSales: number }[];
}

export interface DashboardStatusCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  sub: string;
}

export interface DashboardProps {
  stats: {
    todayRevenue: number;
    totalOrders: number;
    productsSold: number;
    todayOrders: {
      id: string;
      items: any[];
      createdAt: Date;
      totalAmount: number;
      status: string;
    }[];
  };
  weeklyRevenue: { date: string; revenue: number }[];
  topProducts: { name: string; sold: number }[];
  allProducts: { isActive: boolean }[];
}
