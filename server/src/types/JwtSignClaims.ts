import { UserRequestObject } from "./UserRequest";
export interface CustomClaims {
  sub: string;
  iat: number;
  exp: number;
  userData: UserRequestObject;
}
