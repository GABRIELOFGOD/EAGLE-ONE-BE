import { Type } from "class-transformer";
import { IsDate, IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsIn(["MALE", "FEMALE"])
  @IsNotEmpty()
  sex: "MALE" | "FEMALE";

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dob: Date;

}
