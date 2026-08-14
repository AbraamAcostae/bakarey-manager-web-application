/**
 * Infrastructure request contract sent to the sign-in endpoint.
 * @author Abraam Acosta
 */
export interface SignInRequest {
  /** Username used to authenticate the account. */
  username: string;
  /** Raw password value for the sign-in request. */
  password: string;
}
