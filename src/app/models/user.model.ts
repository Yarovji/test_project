export interface UserModel {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  repeatPassword?: string;
  user_type: 'Administrator' | 'Driver';
}
