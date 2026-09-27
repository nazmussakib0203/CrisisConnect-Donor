// Payload shape for Donor requests. Add real fields (with class-validator

import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

// decorators) here as the API is built out.
export class CreateDonorDTO {
    @IsNotEmpty({message: 'User email is required'})
    @IsEmail({},{message: 'Invalid email format'})
    email!: string;

    @IsNotEmpty({message: 'Password is required'})
    @IsString({message: 'Password must be a string'})
    password!: string;

    @IsNotEmpty({message: 'Full name is required'})
    @IsString({message: 'Full name must be a string'})
    fullName!: string;

    @IsNotEmpty({message: 'City is required'})
    @IsString({message: 'City must be a string'})
    city!: string;

    @IsString({message: 'Country must be a string'})
    @IsOptional()
    country!: string;

    @IsNotEmpty({ message: 'Unique ID is required' })
    @IsString({ message: 'Unique ID must be a string' })
    uniqueId!: string;

}
