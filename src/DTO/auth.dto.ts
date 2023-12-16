import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { CreateUser, UpdateUser } from "src/interfaces";
import { UserModel } from "src/schemas";


export class SignUpDTO
    extends UserModel implements CreateUser { }

export class LogInDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class UpdateUserDTO
    extends SignUpDTO implements UpdateUser { }