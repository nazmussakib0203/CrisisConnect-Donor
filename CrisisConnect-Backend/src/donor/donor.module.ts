/*import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonorController } from './donor.controller';
import { DonorService } from './donor.service';
import { Donor } from './entities/donor.entity';
import { Donation } from './entities/donation.entity';
import { Payment } from './entities/payment.entity';
import { Receipt } from './entities/receipt.entity';
import { User } from 'src/common/entities/user.entity';
import { Otp } from 'src/common/entities/otp.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DonorGuard } from './donor.guard';
import { Crisis } from 'src/admin/entities/crisis.entity';
import { DonationCall } from 'src/ngo/entities/donation-call.entity';

@Module({
  imports: [ConfigModule,TypeOrmModule.forFeature([Donor, Donation, Payment, Receipt, User, Otp,Crisis,DonationCall]),MailerModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    transport: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: configService.get('MAIL_USER'),
        pass: configService.get('MAIL_PASSWORD'),
      },
    },
  }),
}),JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
  return {
    secret: configService.get('JWT_SECRET'),
    signOptions: {
      expiresIn: '1d',
    },
  };
},
})
],
  controllers: [DonorController],
  providers: [DonorService,DonorGuard],

})

export class DonorModule {}
*/
import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { DonorController } from './donor.controller';

import { DonorService } from './donor.service';

import { Donor } from './entities/donor.entity';

import { Donation } from './entities/donation.entity';

import { Payment } from './entities/payment.entity';

import { Receipt } from './entities/receipt.entity';

import { User } from 'src/common/entities/user.entity';

import { Otp } from 'src/common/entities/otp.entity';

import { MailerModule } from '@nestjs-modules/mailer';

import { JwtModule } from '@nestjs/jwt';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { DonorGuard } from './donor.guard';

import { Crisis } from 'src/admin/entities/crisis.entity';

import { DonationCall } from 'src/ngo/entities/donation-call.entity';
import { PusherService } from './pusher.service';

@Module({
  imports: [
    ConfigModule,

    TypeOrmModule.forFeature([
      Donor,
      Donation,
      Payment,
      Receipt,
      User,
      Otp,
      Crisis,
      DonationCall,
    ]),

    MailerModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => {
        console.log("MAIL USER:", configService.get('MAIL_USER'));
console.log(
  "MAIL PASSWORD EXISTS:",
  !!configService.get('MAIL_PASSWORD')
);
        return {
          transport: {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: configService.get('MAIL_USER'),
              pass: configService.get('MAIL_PASSWORD'),
            },
          },
        };
      },
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),

          signOptions: {
            expiresIn: '1d',
          },
        };
      },
    }),
  ],

  controllers: [DonorController],

  providers: [
    DonorService,
    DonorGuard,
  ],
})

export class DonorModule {}