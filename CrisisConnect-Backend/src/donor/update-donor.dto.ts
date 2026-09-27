import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class UpdateDonorDTO {
  @IsNotEmpty()
  @IsString()
  fullName!: string;

  @IsNotEmpty()
  @IsString()
  city!: string;

  @IsOptional()
  @IsString()
  country?: string;
}