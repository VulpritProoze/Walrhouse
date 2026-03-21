export interface IUser {
  id: string;
  email: string | null;
  firstName: string;
  middleName: string | null;
  lastName: string;
  // Server returns raw role strings from AuthUserDto.Roles (List<string>)
  roles: string[];
}
