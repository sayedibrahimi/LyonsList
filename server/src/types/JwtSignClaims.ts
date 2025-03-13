import { UserRequestObject } from "./UserRequest";
export default interface CustomClaims {
  sub: string;
  iat: number;
  exp: number;
  userData: UserRequestObject;
}
