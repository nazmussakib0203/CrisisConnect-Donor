import { Injectable,ConflictException, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Donor } from './entities/donor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/entities/user.entity';
import { Otp } from 'src/common/entities/otp.entity';
import { CreateDonorDTO } from './create-donor.dto';
import { OtpPurpose, UserRole } from 'src/common/common.enums';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { VerifyOtpDTO } from './verify-otp.dto';
import { DonorLoginDTO } from './login.dto';
import { JwtService } from '@nestjs/jwt';
import { Crisis } from 'src/admin/entities/crisis.entity';
import { CrisisStatus } from 'src/admin/admin.enums';
import { DonationCallStatus } from 'src/ngo/ngo.enums';
import { Ngo } from 'src/ngo/entities/ngo.entity';
import { DonationCall } from 'src/ngo/entities/donation-call.entity';
import { PayDonationDTO } from './pay-donation.dto';
import { Donation } from './entities/donation.entity';
import { CreateDonationDTO } from './create-donation.dto';
import { DonationStatus, PaymentStatus } from './donor.enums';
import { Payment } from './entities/payment.entity';
import { Receipt } from './entities/receipt.entity';
import { DataSource } from 'typeorm';
import { UpdateDonorDTO } from './update-donor.dto';
import { PusherService } from './pusher.service';


// Business logic for the Donor role (User Category 4). Replace this
// stub with real DB-backed logic as routes are added back.
@Injectable()
export class DonorService {
  constructor(@InjectRepository(Donor) private donorRepository: Repository<Donor>,
              @InjectRepository(User) private userRepository: Repository<User>,
              @InjectRepository(Otp) private otpRepository: Repository<Otp>,
              @InjectRepository(Crisis) private crisisRepository: Repository<Crisis>,
              @InjectRepository(DonationCall) private donationCallRepository: Repository<DonationCall>,
              @InjectRepository(Donation) private donationRepository: Repository<Donation>,
              @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
              @InjectRepository(Receipt) private receiptRepository: Repository<Receipt>,
              private dataSource:DataSource,
              private readonly jwtService: JwtService,
              private mailerService: MailerService,
              ){}
  getStatus(): string {
    return 'Donor module is working';
  }
  async uploadProfileImage(userId: string, filename: string): Promise<object> {
    if (!filename) {
      throw new BadRequestException('Image file is required');
    }
    const profileImage = `/uploads/donor/${filename}`;
        await this.donorRepository
          .createQueryBuilder()
          .update(Donor)
          .set({ profileImage })
          .where('userId = :userId', { userId })
          .execute();
    
        return {
          message: 'Profile image uploaded successfully',
          profileImage,
        };
  }

  async createDonor(createDonorDto: CreateDonorDTO): Promise<any> {
  console.log(
    "EMAIL RECEIVED:",
    JSON.stringify(createDonorDto.email)
  );

  const existingUser = await this.userRepository.findOne({
    where: {
      email: createDonorDto.email,
    },
  });

  console.log("EXISTING USER:", existingUser);

  if (existingUser) {
    throw new ConflictException("Email already exists");
  }

  const existingDonorByUniqueId = await this.donorRepository.findOne({
    where: {
      uniqueId: createDonorDto.uniqueId,
    },
  });

  if (existingDonorByUniqueId) {
    throw new ConflictException("Unique ID already exists");
  }

  const hashedPassword = await bcrypt.hash(
    createDonorDto.password,
    10,
  );

  const otpCode = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  const codeHash = await bcrypt.hash(otpCode, 10);

  try {
    await this.dataSource.transaction(async (manager) => {
      const newUser = manager.create(User, {
        email: createDonorDto.email,
        passwordHash: hashedPassword,
        role: UserRole.DONOR,
        isVerified: false,
      });

      await manager.save(newUser);

      const newDonor = manager.create(Donor, {
        fullName: createDonorDto.fullName,
        city: createDonorDto.city,
        country: createDonorDto.country,
        uniqueId: createDonorDto.uniqueId,
        user: newUser,
      });

      await manager.save(newDonor);

      const newOtp = manager.create(Otp, {
        user: newUser,
        codeHash,
        purpose: OtpPurpose.SIGNUP,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        isUsed: false,
      });

      await manager.save(newOtp);

      /*await this.mailerService.sendMail({
        from: process.env.MAIL_USER,
        to: createDonorDto.email,
        subject: "OTP Verification",
        text: `Your OTP code is ${otpCode}. It will expire in 5 minutes.`,
      });*/
      console.log("DONOR SIGNUP OTP:", otpCode);
    });

    return {
      message: "Donor created successfully",
    };
  } catch (error) {
    console.error("DONOR SIGNUP ERROR:", error);

    throw error;
  }
}


async verifyOtp(verifyOtpDto: VerifyOtpDTO): Promise<any> {
  // Find user by email
  const user = await this.userRepository.findOne({
    where: {
      email: verifyOtpDto.email,
    },
  });

  if (!user) {
    throw new BadRequestException('Invalid email');
  }

  // Find unused signup OTP
  const otp = await this.otpRepository.findOne({
    where: {
      user: {
        id: user.id,
      },
      purpose: OtpPurpose.SIGNUP,
      isUsed: false,
    },
  });

  if (!otp) {
    throw new BadRequestException('OTP not found');
  }

  // Check OTP expiration
  if (otp.expiresAt < new Date()) {
    throw new BadRequestException('OTP is expired');
  }

  // Compare OTP
  const ismatch = await bcrypt.compare(
    verifyOtpDto.code,
    otp.codeHash,
  );

  if (!ismatch) {
    throw new BadRequestException('Invalid OTP code');
  }

  // Mark OTP as used
  otp.isUsed = true;

  // Verify user
  user.isVerified = true;

  await this.otpRepository.save(otp);
  await this.userRepository.save(user);

  return {
    message: 'OTP verified successfully',
  };
}
  /*async login(loginDto: DonorLoginDTO): Promise<any> {
    const user = await this.userRepository.findOne({where: {email: loginDto.email,}});
    if (!user||user.isVerified===false) {
      throw new UnauthorizedException('Invalid credentials or account not verified');
    }
    const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const otpCode = Math.floor(100000+Math.random()*900000).toString();
    await this.mailerService.sendMail({from:process.env.MAIL_USER, to: loginDto.email, subject: 'OTP Verification', text: `Your OTP code is ${otpCode}. It will expire in 5 minutes.`});
    const codeHash = await bcrypt.hash(otpCode, 10);
    const newOtp = await this.otpRepository.create({user, codeHash, purpose: OtpPurpose.LOGIN, expiresAt: new Date(Date.now() + 5 * 60 * 1000), isUsed: false});
    await this.otpRepository.save(newOtp);
    return {message: 'OTP sent to email'};
  }
*/
async login(loginDto: DonorLoginDTO): Promise<any> {
    const user = await this.userRepository.findOne({
        where: {
            email: loginDto.email,
        },
    });

    if (!user || user.isVerified === false) {
        throw new UnauthorizedException(
            'Invalid credentials or account not verified'
        );
    }

    const isMatch = await bcrypt.compare(
        loginDto.password,
        user.passwordHash
    );

    if (!isMatch) {
        throw new UnauthorizedException('Invalid password');
    }

    const payload = {
        userId: user.id,
        role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
        accessToken,
    };
}
  /*async verifyLoginOtp(verifyOtpDto: VerifyOtpDTO): Promise<any> {
    const user = await this.userRepository.findOne({where: {email: verifyOtpDto.email}});
    if (!user) {
      throw new BadRequestException('Invalid email');
    }
    const otp = await this.otpRepository.findOne({where: {user: {id: user.id}, purpose: OtpPurpose.LOGIN, isUsed: false}});
    if(!otp){
      throw new BadRequestException('OTP not found');
    }
    if(otp.expiresAt < new Date()) {
      throw new BadRequestException('OTP is expired');
    }
    const isMatch = await bcrypt.compare(verifyOtpDto.code, otp.codeHash);
    if (!isMatch) {
      throw new BadRequestException('Invalid OTP code');
    }
    otp.isUsed = true;
    await this.otpRepository.save(otp);

    const payload = { userId: user.id, role: user.role};
    const accessToken = await this.jwtService.signAsync(payload);
    return {message: 'Login OTP verified successfully', accessToken};
  }*/

  async getProfile(userId: number): Promise<any> {
    const donor = await this.donorRepository.findOne({where:{user:{id: userId}}});
    return donor;
  }

  async updateProfile(userId:number, updateDonorDto: UpdateDonorDTO): Promise<any> {
    const donor = await this.donorRepository.findOne({where:{user:{id: userId}}});
    if (!donor) {
      throw new NotFoundException('Donor not found');
    }
    
    await this.donorRepository.update(donor.id,{fullName: updateDonorDto.fullName, city: updateDonorDto.city, country: updateDonorDto.country});
    return {message: 'Profile updated successfully'};
    
  }

  async updateCountry(userId:number, country: string): Promise<any> {
    const donor = await this.donorRepository.findOne({where:{user:{id: userId}}});
    if (!donor) {
      throw new NotFoundException('Donor not found');
    }
    await this.donorRepository.update(donor.id,{country});
    return {message: 'Country updated successfully'};
  }

  async getDonors(city: string, country: string, joinedAfter: string): Promise<Donor[]> {
    const where: FindOptionsWhere<Donor> = {};
    if (city) {
      where.city = city;
    }
    if(country) {
      where.country = country;
    }
    if(joinedAfter) {
      where.joiningDate = MoreThan(new Date(joinedAfter));
    }
    return this.donorRepository.find({where});
  }

  async getCrisis(status: string, category: string, city: string): Promise<any> {
  const where: FindOptionsWhere<Crisis> = {};
  if (status) {
    where.status = status as CrisisStatus;
  }
  if (category) {
    where.category = category;
  }
  if (city) {
    where.city = city;
  }
  return this.crisisRepository.find({where});
  }

  async followCrises(userId:number,crisisId:number): Promise<any> {
    const donor = await this.donorRepository.findOne({where:{user:{id: userId}},relations:{'followedCrises':true}});
    if (!donor) {
      throw new NotFoundException('Donor not found');
    }
    const crisis = await this.crisisRepository.findOne({where:{id: crisisId}});
    if (!crisis) {
      throw new NotFoundException('Crisis not found');
    }
    donor.followedCrises.push(crisis);
    await this.donorRepository.save(donor);
    return {message: 'Crisis followed successfully'};
  }

  async unfollowCrises(userId:number,crisisId:number): Promise<any> {
    const donor = await this.donorRepository.findOne({where:{user:{id: userId}},relations:{'followedCrises':true}});
    if (!donor) {
      throw new NotFoundException('Donor not found');
    }
    const crisis = await this.crisisRepository.findOne({where:{id: crisisId}});
    if(!crisis) {
      throw new NotFoundException('Crisis not found');
    }
    await this.donorRepository
    .createQueryBuilder()
    .relation(Donor, 'followedCrises')
    .of(donor.id)
    .remove(crisis.id);
    return {message: 'Crisis unfollowed successfully'};

  }

  async getFollowedCrises(userId:number): Promise<any> {
    const donor = await this.donorRepository.findOne({where:{user:{id: userId}},relations:{'followedCrises':true}});
    if (!donor) {
      throw new NotFoundException('Donor not found');
    }
    return donor.followedCrises;
  }

  async getDonationCalls(status: DonationCallStatus, crisisId: number): Promise<any> {
    const where: FindOptionsWhere<DonationCall> = {};
    if (status) {
      where.status = status as DonationCallStatus;
    }
    if (crisisId) {
      where.crisis = {id: crisisId};
    }
    return this.donationCallRepository.find({where});
  }

 async createDonation(
  userId: number,
  createDonationDTO: CreateDonationDTO
): Promise<any> {
  const donor = await this.donorRepository.findOne({
    where: { user: { id: userId } },
  });

  if (!donor) {
    throw new NotFoundException('Donor not found');
  }

  const donationCall = await this.donationCallRepository.findOne({
    where: { id: createDonationDTO.donationCallId },
  });

  if (!donationCall) {
    throw new NotFoundException('Donation call not found');
  }

  const donation = this.donationRepository.create({
    donor,
    donationCall,
    amount: createDonationDTO.amount.toString(),
    message: createDonationDTO.message,
  });

  donation.status = DonationStatus.INITIATED;

  const savedDonation =
  await this.donationRepository.save(donation);

return {
  message: 'Donation created successfully',
  donationId: savedDonation.id,
};
}
  async getDonations(
  userId: number,
  status: DonationStatus,
  crisisId: number,
  minAmount: number,
): Promise<any> {
  const donor = await this.donorRepository.findOne({
    where: { user: { id: userId } },
  });

  if (!donor) {
    throw new NotFoundException('Donor not found');
  }

  const where: FindOptionsWhere<Donation> = {
    donor: { id: donor.id }, // 🔥 IMPORTANT
  };

  if (status) {
    where.status = status as DonationStatus;
  }

  if (crisisId) {
    where.donationCall = {
      crisis: { id: crisisId },
    };
  }

  if (minAmount) {
    where.amount = MoreThanOrEqual(minAmount.toString());
  }

  return this.donationRepository.find({
    where,
  });
}

  async deleteDonation(userId: number, donationId: number): Promise<any> {
    const donor = await this.donorRepository.findOne({where:{user:{id: userId}},relations:{'donations':true}});
    if (!donor) {
      throw new NotFoundException('Donor not found');
    }

    const donation = await this.donationRepository.findOne({where:{id: donationId, donor: {id: donor.id}}});
    if (!donation) {
      throw new NotFoundException('Donation not found');
    }
    if(donation.status !== DonationStatus.INITIATED) {
      throw new BadRequestException('Only donations with status INITIATED can be deleted');
    }
    await this.donationRepository.remove(donation);
    return {message: 'Donation deleted successfully'};
  }

  async payDonation(
  userId: number,
  donationId: number,
  payDonationDto: PayDonationDTO,
): Promise<any> {
  const donor = await this.donorRepository.findOne({
    where: { user: { id: userId } },
    relations: { donations: true, user: true },
  });

  if (!donor) {
    throw new NotFoundException('Donor not found');
  }

  const donation = await this.donationRepository.findOne({
    where: {
      id: donationId,
      donor: { id: donor.id },
    },
    relations: { donationCall: true },
  });

  if (!donation) {
    throw new NotFoundException('Donation not found');
  }

  if (donation.status !== DonationStatus.INITIATED) {
    throw new BadRequestException(
      'Only donations with status INITIATED can be paid',
    );
  }

  const cardNumber = payDonationDto.cardNumber;
  const cardLast4 = cardNumber.slice(-4);
  const lastDigit = cardLast4.slice(-1);

  const payment = this.paymentRepository.create({
    donation,
    cardLast4,
  });

  if (lastDigit === '0') {
    payment.status = PaymentStatus.FAILED;
    await this.paymentRepository.save(payment);

    return {
      message: 'Payment failed',
      paymentStatus: PaymentStatus.FAILED,
    };
  }

  payment.status = PaymentStatus.SUCCESS;
  await this.paymentRepository.save(payment);

  let receipt;

  receipt = await this.dataSource.transaction(async (manager) => {
  const newReceipt = manager.create(Receipt, {
    payment,
    receiptNo: randomUUID(),
    amount: donation.amount,
  });

  await manager.save(newReceipt);

  donation.status = DonationStatus.PAID;

  donation.donationCall.raisedAmount = (
    Number(donation.donationCall.raisedAmount) +
    Number(donation.amount)
  ).toString();

  await manager.save(donation.donationCall);
  await manager.save(donation);

  return newReceipt;
});

  /*await this.mailerService.sendMail({
  from: process.env.MAIL_USER,
  to: donor.user.email,
  subject: 'Donation Payment Confirmation',
  text: `Your donation receipt ${receipt.receiptNo}, ${receipt.amount}, ${receipt.issuedAt} has been generated.`,
});*/

return {
  message: 'Donation paid successfully',
  paymentStatus: PaymentStatus.SUCCESS,
  receiptId: receipt.id,
};
}

async getReceipt(
  userId: number,
  donationId: number,
): Promise<any> {

  const donor = await this.donorRepository.findOne({
    where: { user: { id: userId } },
  });

  if (!donor) {
    throw new NotFoundException('Donor not found');
  }

  const receipt = await this.receiptRepository.findOne({
    where: {
      payment: {
        donation: {
          id: donationId,
          donor: {
            id: donor.id,
          },
        },
      },
    },
    relations: {
      payment: {
        donation: true,
      },
    },
  });

  if (!receipt) {
    throw new NotFoundException('Receipt not found');
  }

  return receipt;
}
}