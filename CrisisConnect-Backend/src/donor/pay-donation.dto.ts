import { IsNotEmpty, IsString } from "class-validator";

export class PayDonationDTO {
    @IsNotEmpty({message: 'Card number is required'})
    @IsString({message: 'Card number must be a string'})
    cardNumber!: string;
}