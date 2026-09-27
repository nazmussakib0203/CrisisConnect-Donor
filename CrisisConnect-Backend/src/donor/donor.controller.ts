import { Param, Body, Controller, Get, Put,Patch, Query, Delete } from '@nestjs/common';
import { DonorService } from './donor.service';
import { Post, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageUploadOptions } from '../common/config/multer.config';
import { CreateDonorDTO } from './create-donor.dto';
import { VerifyOtpDTO } from './verify-otp.dto';
import { DonorLoginDTO } from './login.dto';
import { DonorGuard } from './donor.guard';
import { UseGuards } from '@nestjs/common';
import { Donor } from './entities/donor.entity';
import { CrisisStatus } from 'src/admin/admin.enums';
import { DonationCallStatus } from 'src/ngo/ngo.enums';
import { PayDonationDTO } from './pay-donation.dto';
import { CreateDonationDTO } from './create-donation.dto';
import { DonationStatus } from './donor.enums';
import { UpdateDonorDTO } from './update-donor.dto';

// Base HTTP entry point for the Donor role (User Category 4).
// File uploads for this role go into its own uploads/donor folder —
// implement the upload/download endpoints here when needed.
@Controller('donor')
export class DonorController {
  constructor(private readonly donorService: DonorService) {}

  // Confirms the Donor module is wired up and working.
  /*@Get()
  getStatus(): string {
    return this.donorService.getStatus();
  }*/

  @UseGuards(DonorGuard)
  @Post('profile/image')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions('donor')))
  uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req) {
     return this.donorService.uploadProfileImage(req.user?.userId, file?.filename);
   }

   @Post('signup')
   async createDonor(@Body() createDonorDto: CreateDonorDTO): Promise<any> {
      return this.donorService.createDonor(createDonorDto);
   }

   @Post('verify-otp')
   async verifyOtp(@Body() verifyOtpDto: VerifyOtpDTO): Promise<any> {
      return this.donorService.verifyOtp(verifyOtpDto);
   }

   @Post('login')
   async login(@Body() loginDto: DonorLoginDTO): Promise<any> {
      return this.donorService.login(loginDto);
   }

   /*@Post('verify-login-otp')
   async verifyLoginOtp(@Body() verifyOtpDto: VerifyOtpDTO): Promise<any> {
      return this.donorService.verifyLoginOtp(verifyOtpDto);
   }*/

   @UseGuards(DonorGuard)
   @Get('profile')
   async getProfile(@Req() req): Promise<any> {
    return this.donorService.getProfile(req.user?.userId);
   } 

   @UseGuards(DonorGuard)
@Put('profile')
async updateProfile(
  @Req() req,
  @Body() updateDonorDto: UpdateDonorDTO,
): Promise<any> {
  return this.donorService.updateProfile(
    req.user?.userId,
    updateDonorDto,
  );
}

   @UseGuards(DonorGuard)
   @Patch('profile/country')
   async updateCountry(@Req() req, @Body('country') country: string): Promise<any> {
    return this.donorService.updateCountry(req.user?.userId, country);
   }

   //@UseGuards(DonorGuard)
   @Get()
   async getDonors(@Query('city') city: string, @Query('country') country: string, @Query('joinedAfter') joinedAfter: string): Promise<Donor[]> {
    return this.donorService.getDonors(city, country, joinedAfter);
   }

   @UseGuards(DonorGuard)
   @Get('crisis')
   async getCrisis(@Query('status') status: string, @Query('category') category: string, @Query('city') city: string): Promise<any> {
    return this.donorService.getCrisis(status, category, city);
   }

   @UseGuards(DonorGuard)
   @Post('crisis/:crisisId/follow')
   async followCrisis(@Req() req, @Param('crisisId') crisisId: number): Promise<any> {
    return this.donorService.followCrises(req.user?.userId,crisisId);
   }

   @UseGuards(DonorGuard)
   @Delete('crisis/:crisisId/unfollow')
   async unfollowCrisis(@Req() req, @Param('crisisId') crisisId: number): Promise<any> {
    return this.donorService.unfollowCrises(req.user?.userId,crisisId);
   }

   @UseGuards(DonorGuard)
   @Get('crisis/me/following')
   async getFollowedCrises(@Req() req): Promise<any> {
    return this.donorService.getFollowedCrises(req.user?.userId);
   }

   //@UseGuards(DonorGuard)
   @Get('donation-call')
   async getDonationCalls(@Query('status') status:DonationCallStatus, @Query('crisisId') crisisId:number): Promise<any> {
    return this.donorService.getDonationCalls(status,crisisId);
   }

   @UseGuards(DonorGuard)
   @Post('donation')
   async createDonation(@Req() req, @Body() createDonationDTO: CreateDonationDTO): Promise<any> {
    return this.donorService.createDonation(req.user?.userId, createDonationDTO);
   }

   @UseGuards(DonorGuard)
   @Get('donation')
   async getDonations(@Req() req,@Query('status') status: DonationStatus,@Query('crisisId') crisisId: number,@Query('minAmount') minAmount: number): Promise<any> {
    return this.donorService.getDonations(req.user?.userId, status,crisisId,minAmount);
   }

   @UseGuards(DonorGuard)
   @Delete('donation/:id')
   async deleteDonation(@Req() req, @Param('id') donationId: number): Promise<any> {
    return this.donorService.deleteDonation(req.user?.userId, donationId);
   }

   @UseGuards(DonorGuard)
   @Post('donation/:id/pay')
   async payDonation(@Req() req, @Param('id') donationId: number, @Body() payDonationDto: PayDonationDTO): Promise<any> {
    return this.donorService.payDonation(req.user?.userId, donationId, payDonationDto);
   }

   @UseGuards(DonorGuard)
@Get('donation/receipt/:id')
async getReceipt(
  @Req() req,
  @Param('id') donationId: number,
): Promise<any> {
  return this.donorService.getReceipt(req.user?.userId, donationId);
}
   

   
   

}
