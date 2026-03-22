import { api } from '@/lib/axios';

// ---------------------------------------------------------------------------
// Request / Response types
// (Mirrors ASP.NET Core Identity default endpoint contracts)
// ---------------------------------------------------------------------------

/** Request body for `POST api/Users/register`. */
export interface RegisterRequest {
  email: string;
  password: string;
}

/** Request body for `POST api/Users/login`. */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Response body for `POST api/Users/login` (bearer mode).
 *
 * @remarks
 * Only returned when `?useCookies=true` is **not** set.
 * When cookies are used, the server sets an HttpOnly cookie and returns no body.
 */
export interface LoginResponse {
  tokenType: string;
  accessToken: string;
  /** Lifetime of the access token in seconds. */
  expiresIn: number;
  refreshToken: string;
}

/** Request body for `POST api/Users/refresh`. */
export interface RefreshRequest {
  refreshToken: string;
}

/** Response body for `POST api/Users/refresh`. Identical shape to {@link LoginResponse}. */
export type RefreshResponse = LoginResponse;

/** Request body for `POST api/Users/confirmEmail`. */
export interface ConfirmEmailRequest {
  userId: string;
  code: string;
  /** Only required when confirming a new email address change (not initial registration). */
  changedEmail?: string;
}

/** Request body for `POST api/Users/resendConfirmationEmail`. */
export interface ResendConfirmationEmailRequest {
  email: string;
}

/** Request body for `POST api/Users/forgotPassword`. */
export interface ForgotPasswordRequest {
  email: string;
}

/** Request body for `POST api/Users/resetPassword`. */
export interface ResetPasswordRequest {
  email: string;
  resetCode: string;
  newPassword: string;
}

/** Request body for `POST api/Users/manage/2fa`. All fields are optional. */
export interface TwoFactorRequest {
  /** Set to `true` to enable 2FA, `false` to disable. */
  enable?: boolean;
  /** TOTP code from the authenticator app — required when enabling for the first time. */
  twoFactorCode?: string;
  /** If `true`, resets the shared TOTP key and invalidates existing authenticator apps. */
  resetSharedKey?: boolean;
  /** If `true`, generates a fresh set of recovery codes. */
  resetRecoveryCodes?: boolean;
  /** If `true`, clears the "remember this machine" flag for the current device. */
  forgetMachine?: boolean;
}

/** Response body for `GET/POST api/Users/manage/2fa`. */
export interface TwoFactorResponse {
  sharedKey: string;
  recoveryCodesLeft: number;
  /** Populated only when recovery codes are regenerated; `null` otherwise. */
  recoveryCodes: string[] | null;
  /** `otpauth://` URI for QR-code generation. */
  authenticatorUri: string;
  isTwoFactorEnabled: boolean;
  isMachineRemembered: boolean;
}

/** Response body for `GET api/Users/manage/info`. */
export interface ManageInfoResponse {
  email: string;
  isEmailConfirmed: boolean;
}

/** Request body for `POST api/Users/manage/info`. All fields are optional. */
export interface UpdateInfoRequest {
  newEmail?: string;
  newPassword?: string;
  /** Required when changing the password. */
  oldPassword?: string;
}

/** Response body for `POST api/Users/manage/info`. Identical shape to {@link ManageInfoResponse}. */
export type UpdateInfoResponse = ManageInfoResponse;

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

/**
 * Creates a new user account.
 *
 * @param data - New user credentials.
 * @returns Resolves with a `204 No Content` response on success.
 * @throws `400` if the email is already taken or the password does not meet requirements.
 *
 * @example
 * await register({ email: 'user@example.com', password: 'P@ssw0rd!' });
 */
export const register = (data: RegisterRequest) => api.post<void>('/Users/register', data);

/**
 * Authenticates a user.
 *
 * @param data - Login credentials.
 * @param useCookies - When `true`, the server sets an HttpOnly refresh-token
 *   cookie and returns no body. When `false` (default), tokens are returned in
 *   the response as {@link LoginResponse}.
 * @param useSessionCookies - When `true` (and `useCookies` is also `true`),
 *   the server-issued cookie will be a session cookie (not persistent).
 * @returns Axios response — body is {@link LoginResponse} when `useCookies` is `false`.
 * @throws `401` if the credentials are incorrect.
 *
 * @example
 * // Bearer mode (store access token in memory)
 * const { data } = await login({ email: 'user@example.com', password: 'P@ssw0rd!' });
 * console.log(data.accessToken);
 *
 * // Cookie mode (token stored in HttpOnly cookie)
 * await login({ email: 'user@example.com', password: 'P@ssw0rd!' }, true);
 */
export const login = (data: LoginRequest, useCookies = false, useSessionCookies = false) => {
  const params: Record<string, boolean> = {};
  if (useCookies) params.useCookies = true;
  if (useSessionCookies) params.useSessionCookies = true;

  return api.post<LoginResponse>('/Users/login', data, {
    params: Object.keys(params).length > 0 ? params : undefined,
  });
};

/**
 * Returns a new access token using a valid refresh token.
 *
 * @param data - Object containing the refresh token.
 * @returns Axios response containing a new {@link RefreshResponse} (access + refresh token pair).
 * @throws `401` if the refresh token is expired or has been revoked.
 *
 * @remarks
 * **Important:** Call this from the main `lib/axios` interceptor only.
 * Never import or use the main `api` instance here — doing so would create a
 * circular dependency and cause an infinite retry loop on 401 responses.
 *
 * @example
 * const { data } = await refresh({ refreshToken: storedToken });
 * setAccessToken(data.accessToken);
 */
export const refresh = (data: RefreshRequest) => api.post<RefreshResponse>('/Users/refresh', data);

/**
 * Confirms a user's email address using the token sent by email.
 *
 * @param data - User ID, confirmation code, and optionally a new email to confirm.
 * @returns Resolves with a `200 OK` response on success.
 * @throws `400` if the token is invalid or already used.
 *
 * @example
 * await confirmEmail({ userId: '...', code: '...' });
 */
export const confirmEmail = (data: ConfirmEmailRequest) =>
  api.post<void>('/Users/confirmEmail', data);

/**
 * Sends a new email confirmation link to the specified address.
 *
 * @param data - The email address to send the confirmation link to.
 * @returns Resolves with a `200 OK` response on success.
 *
 * @example
 * await resendConfirmationEmail({ email: 'user@example.com' });
 */
export const resendConfirmationEmail = (data: ResendConfirmationEmailRequest) =>
  api.post<void>('/Users/resendConfirmationEmail', data);

/**
 * Sends a password reset link to the specified email address.
 *
 * @param data - The email address associated with the account.
 * @returns Resolves with a `200 OK` response on success.
 *
 * @remarks
 * Always returns `200` even if the email is not registered, to prevent user enumeration.
 *
 * @example
 * await forgotPassword({ email: 'user@example.com' });
 */
export const forgotPassword = (data: ForgotPasswordRequest) =>
  api.post<void>('/Users/forgotPassword', data);

/**
 * Resets a user's password using the token sent by email.
 *
 * @param data - Email address, reset code from the email, and the new password.
 * @returns Resolves with a `200 OK` response on success.
 * @throws `400` if the reset code is invalid, expired, or the new password fails validation.
 *
 * @example
 * await resetPassword({ email: 'user@example.com', resetCode: '...', newPassword: 'NewP@ss1!' });
 */
export const resetPassword = (data: ResetPasswordRequest) =>
  api.post<void>('/Users/resetPassword', data);

/**
 * Enables, disables, or retrieves two-factor authentication settings.
 *
 * @param data - Optional 2FA configuration payload. Omit to perform a `GET` (retrieve current settings).
 * @returns Axios response containing {@link TwoFactorResponse}.
 * @throws `400` if the TOTP code is invalid when enabling 2FA.
 *
 * @example
 * // Retrieve current 2FA status
 * const { data } = await manageTwoFactor();
 *
 * // Enable 2FA
 * const { data } = await manageTwoFactor({ enable: true, twoFactorCode: '123456' });
 */
export const manageTwoFactor = (data?: TwoFactorRequest) =>
  data
    ? api.post<TwoFactorResponse>('/Users/manage/2fa', data)
    : api.get<TwoFactorResponse>('/Users/manage/2fa');

/**
 * Returns the current user's account information.
 *
 * @returns Axios response containing {@link ManageInfoResponse}.
 * @throws `401` if the user is not authenticated.
 *
 * @example
 * const { data } = await getManageInfo();
 * console.log(data.email, data.isEmailConfirmed);
 */
export const getManageInfo = () => api.get<ManageInfoResponse>('/Users/manage/info');

/**
 * Updates the current user's email or password.
 *
 * @param data - Fields to update. Provide `oldPassword` when changing the password.
 * @returns Axios response containing the updated {@link UpdateInfoResponse}.
 * @throws `400` if the old password is incorrect or the new values fail validation.
 * @throws `401` if the user is not authenticated.
 *
 * @example
 * // Change password
 * await updateManageInfo({ oldPassword: 'Old@123', newPassword: 'New@456' });
 *
 * // Change email
 * await updateManageInfo({ newEmail: 'new@example.com' });
 */
export const updateManageInfo = (data: UpdateInfoRequest) =>
  api.post<UpdateInfoResponse>('/Users/manage/info', data);

// ---------------------------------------------------------------------------
// Authenticated user info (custom endpoint)
// ---------------------------------------------------------------------------

/**
 * Shape of `GET api/Users/info` — mirrors `AuthUserDto` on the server.
 */
export interface AuthUserInfoResponse {
  id: string;
  email: string | null;
  firstName: string;
  middleName: string | null;
  lastName: string;
  roles: string[];
}

/**
 * Fetches the currently authenticated user's profile from the server.
 *
 * @remarks
 * Used on app mount to "rehydrate" the session: if the cookie is still valid
 * the server returns 200 with the user info; a 401 means the session has ended.
 *
 * @returns Axios response containing {@link AuthUserInfoResponse}.
 * @throws `401` if no valid session cookie is present.
 *
 * @example
 * const { data } = await getAuthenticatedUserInfo();
 * console.log(data.email, data.roles);
 */
export const getAuthenticatedUserInfo = () => api.get<AuthUserInfoResponse>('/Users/info');

/**
 * Log out the current user by clearing the server-side session cookie.
 *
 * @returns Resolves with a `200 OK` or `204 No Content` response on success.
 */
export const logout = () => api.post<void>('/Users/logout', {});
