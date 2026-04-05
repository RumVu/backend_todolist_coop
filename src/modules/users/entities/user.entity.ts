export class User {
  id!: string;
  name!: string;
  username!: string;
  email!: string;
  phoneNum?: string;
  createdAt!: string;
  updatedAt!: string;
  roles?: string[];
  isActive!: boolean;
}
