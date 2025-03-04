// In types/dto/auth.dto.ts
export interface RegisterRequestObject {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export interface LoginRequestObject {
  email: string;
  password: string;
}
