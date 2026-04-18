import { api } from '@/lib/axios';
import { type Roles } from '@/features/auth/types';

/**
 * Shape of `GET /api/users/{id}` — mirrors `UserDto` on the server.
 */
export interface UserResponse {
  id: string;
  email: string | null;
  firstName: string;
  middleName: string | null;
  lastName: string;
  phoneNumber: string | null;
  roles: Roles[];
}

/**
 * Fetches a specific user's profile by their unique identifier.
 *
 * @param id - The unique identifier of the user to retrieve.
 * @returns Axios response containing {@link UserResponse}.
 * @throws `401` if the user is not authenticated.
 * @throws `404` if the user with the specified ID does not exist.
 *
 * @example
 * const { data } = await getUser('user-id-123');
 * console.log(data.email, data.phoneNumber);
 */
export const getUser = (id: string) => api.get<UserResponse>(`/Users/${id}`);
