import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDonationDTO {
  @IsNotEmpty({ message: 'Donation call ID is required' })
  @IsNumber({}, { message: 'Donation call ID must be a number' })
  donationCallId!: number;

  @IsNotEmpty({ message: 'Amount is required' })
  @IsString({ message: 'Amount must be a string' })
  amount!: string;

  @IsOptional()
  @IsString({ message: 'Message must be a string' })
  message!: string;
}