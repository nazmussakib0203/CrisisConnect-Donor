import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class VerifyOtpDTO {
    @IsNotEmpty({message: 'Email is required'})
    @IsEmail({}, {message: 'Invalid email format'})
    email!: string;

    @IsNotEmpty({ message: 'OTP code is required' })
    @IsString({ message: 'OTP code must be a string' })
    code!: string;

}