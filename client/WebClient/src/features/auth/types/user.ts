export interface IUser {
  id: string;
  email: string | null;
  // Server returns raw role strings from AuthUserDto.Roles (List<string>)
  roles: string[];
}
