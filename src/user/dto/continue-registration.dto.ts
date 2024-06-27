import { IsNotEmpty, IsStrongPassword, IsString } from "class-validator";

export class ContinueRegistrationDto {

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

}