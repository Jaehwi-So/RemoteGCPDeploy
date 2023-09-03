import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtGoogleStrategy } from 'src/commons/auth/strategy/jwt-oauth-google.strategy';
import { JwtRefreshStretagy } from 'src/commons/auth/strategy/jwt-refresh.strategy';
import { User } from '../users/entities/user.entity';
import { UserModule } from '../users/user.module';
import { UserService } from '../users/user.service';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({}), //
    TypeOrmModule.forFeature([User]), //유저 관련 DB 엑세스에 필요
  ],
  providers: [
    JwtRefreshStretagy,
    JwtGoogleStrategy,
    AuthResolver, //
    AuthService,
    UserService
  ],
  controllers: [
    AuthController, //
  ],
})
export class AuthModule {
  //
}
