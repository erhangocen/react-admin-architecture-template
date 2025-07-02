export interface DecodedJWTModel {
  sub: string;
  email: string;
  jti: string;
  ['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']: string[];
  userId: string;
  exp: number;
  iss: string;
  aud: string;
}
