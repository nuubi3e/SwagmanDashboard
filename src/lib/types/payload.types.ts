import { IUserSchema } from './schema.types';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface PermissionPayload {
  id: string;
  name: string;
  actions: string[];
}

export interface RolePayload {
  name: string;
  permission?: PermissionPayload[];
}

export interface UserPayload {
  username: string;
  fullName: string;
  roleId: string;
  password: string;
  displayPic?: string;
}

export interface CategoryPayload {
  name: string;
}

export interface ProductPayload {
  name: string;
  price: number;
  description: string;
  images?: string[];
  categoryId: string;
  ingredients: IngredientsPayload[];
  sizes: SizesPayload[];
}

export interface IngredientsPayload {
  id: string;
  name: string;
  description: string;
}

export interface SizesPayload {
  price: number;
  size: string;
  id: string;
}
