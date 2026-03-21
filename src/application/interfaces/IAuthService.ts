import { AuthResponse, LoginRequest, RegisterRequest } from "../dtos";

export interface IAuthService {
  register(dto: RegisterRequest): Promise<AuthResponse>;
  login(dto: LoginRequest): Promise<AuthResponse>;
}